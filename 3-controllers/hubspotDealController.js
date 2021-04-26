var request = require("request-promise");
const Hubspot = require("hubspot");
const { json } = require("express");

exports.get_carrier_detail = async (req, res, next) => {
  try {
    let companies = [];

    let company = {
      dealName: "Chicago Bread,LLC- Yorkville,IL",
      createDate: "3/5/2021",
      firstContactCreateDate: "-",
      parentCompany: "Hamra Enterprise",
      connectivity: "$499.99",
      recentDealCloseDate: "10/1/2019",
    };

    for (let index = 0; index < 5; index++) {
      companies.push(company);
    }

    return res.render("carrierDetail", { deals: companies });
  } catch (error) {
    next(error);
  }
};
exports.get_deal = async (req, res, next) => {
  const { companyId } = req.params;

  try {
    let companies = [];

    let company = {
      companyId,
      companyName: "",
      deals: [],
      totalDealAmount: 0,
    };

    let dealIds = await get_association_company_to_deal(companyId);
    console.log("dealIds", dealIds);

    if (dealIds) {
      for (dealId of dealIds) {
        let deal = await getDealInformation(dealId);
        let dealDetail = deal.dealname + " - " + deal.amount;
        company.deals.push({ ...deal, dealDetail: dealDetail });
      }
    }

    console.log("companies", company.deals);

    return res.render("hubDeal", { deals: company.deals });
  } catch (error) {
    next(error);
  }
};

async function get_association_company_to_deal(companyId) {
  try {
    const response = await request({
      method: "GET",
      url: `https://api.hubapi.com/crm-associations/v1/associations/${companyId}/HUBSPOT_DEFINED/6`,
      qs: {
        hapikey: "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
        limit: 100,
      },
      json: true,
    });
    let { results } = response;

    return results.length ? results : 0;
  } catch (error) {
    console.log(error);
  }
}
async function get_association_deal_to_line_item(companyId) {
  try {
    const response = await request({
      method: "GET",
      url: `https://api.hubapi.com/crm-associations/v1/associations/${companyId}/HUBSPOT_DEFINED/19`,
      qs: {
        hapikey: "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
        limit: 100,
      },
      json: true,
    });
    let { results } = response;

    return results.length ? results : 0;
  } catch (error) {
    console.log(error);
  }
}

async function getDealInformation(dealId) {
  try {
    const { properties } = await request({
      method: "GET",
      url: `https://api.hubapi.com/deals/v1/deal/${dealId}`,
      qs: { hapikey: "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx" },
      json: true,
    });

    let deal = {
      dealId,
      amount: properties.amount ? properties.amount.value : 0,
      dealname: properties.dealname ? properties.dealname.value : "",
    };
    return deal;
  } catch (error) {}
}
