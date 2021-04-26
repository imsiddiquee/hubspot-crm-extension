var request = require("request-promise");
const Hubspot = require("hubspot");
const { json } = require("express");

const hubspot = new Hubspot({
  apiKey: "3dea956b-54b7-4f8c-af5b-c5c8d5af3add",
  checkLimit: false, // (Optional) Specify whether to check the API limit on each call. Default: true
});

exports.get_tierOne_carrier = async (req, res, next) => {
  try {
    return res.json({
      results: [
        {
          objectId: 1,
          title: "Carrier",
          link: "http://example.com/1",

          properties: [
            {
              label: "Carrier",
              dataType: "STRING",
              value: "Mitel",
            },
            {
              label: "Amount",
              dataType: "CURRENCY",
              value: "3400",
              currencyCode: "USD",
            },
          ],
          actions: [
            {
              type: "IFRAME",
              width: 890,
              height: 748,
              uri: `https://daalvaat.herokuapp.com/hubDeal/carrierDetail`,
              label: "View Detail",
              associatedObjectProperties: [],
            },
          ],
          settingsAction: [],
        },
        {
          objectId: 2,
          title: "Carrier",
          link: "http://example.com/1",

          properties: [
            {
              label: "Carrier",
              dataType: "STRING",
              value: "Nitel",
            },
            {
              label: "Amount",
              dataType: "CURRENCY",
              value: "2321",
              currencyCode: "USD",
            },
          ],
          actions: [
            {
              type: "IFRAME",
              width: 890,
              height: 748,
              uri: `https://daalvaat.herokuapp.com/hubDeal/carrierDetail`,
              label: "View Detail",
              associatedObjectProperties: [],
            },
          ],
          settingsAction: [],
        },
      ],
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.get_carrier = async (req, res, next) => {
  //res.send("update a single product.");
  try {
    //const companyId = req.query.id || "4490302912";
    const { hs_object_id, hs_parent_company_id } = req.query;
    const companyId = hs_object_id;

    let companyIds = await get_association_parent_company_to_child_company(
      companyId
    );

    if (!companyIds) {
      return res.json({
        results: [
          {
            objectId: 1,
            title: "Carrier",
            link: "http://example.com/1",

            properties: [
              {
                label: "Description",
                dataType: "STRING",
                value: "There is no record to display.",
              },
            ],
            actions: [],
            settingsAction: [],
          },
        ],
      });
    }

    // console.log("companyIds", companyIds);

    let companies = [];

    //get related deals
    for (currentCompanyId of companyIds) {
      let company = {
        companyId: currentCompanyId,
        companyName: "",
        deals: [],
        totalDealAmount: 0,
      };

      let dealIds = await get_association_company_to_deal(currentCompanyId);
      console.log("dealIds", dealIds);

      if (dealIds) {
        for (dealId of dealIds) {
          let deal = await getDealInformation(dealId); //dealId,amount,dealname
          company.deals.push(deal);
        }

        //total deal amount
        // let sumAmount = company.deals.map((p) => p.amount);
        // company.totalDealAmount = sumAmount.reduce((a, b) => a + b, 0);
      }

      let { properties } = await hubspot.companies.getById(currentCompanyId);
      company.companyName = properties.name.value;
      company.totalDealAmount = properties.hs_total_deal_value
        ? properties.hs_total_deal_value.value
        : 0;

      //console.log("company", company);

      companies.push(company);
    }
    let temp2 = formatCompanyData(companies);

    return res.json({ results: temp2 });
  } catch (error) {
    next(error);
  }
};

function formatCompanyData(res) {
  let title = "Carrier"; //1
  let link = "http://example.com/1"; //1

  let settingsAction = [];

  let response = formatResponse(res);

  //console.log(" test response", ...response);

  return response.map((item, index) => {
    return {
      ...item,
      title: title,
      link: link,
      settingsAction: settingsAction,
    };
  });

  // return {
  //   ...response,
  //   title: title,
  //   link: link,
  //   actions: actions,
  //   settingsAction: settingsAction,
  // };
}

function formatResponse(res) {
  return res.map((item, index) => {
    let objectId = index + 1;
    let properties = [
      {
        label: "Company",
        dataType: "STRING",
        value: item.companyName,
      },
      {
        label: "Total Deal Amount",
        dataType: "CURRENCY",
        value: item.totalDealAmount,
        currencyCode: "GBP",
      },
    ];

    let actions = [
      {
        type: "IFRAME",
        width: 890,
        height: 748,
        uri: "https://daalvaat.herokuapp.com/hubDeal/" + item.companyId,
        label: "View Detail",
        associatedObjectProperties: [],
      },
    ];

    return { ...item, objectId: objectId, properties: properties, actions };
  });
}

async function get_association_parent_company_to_child_company(companyId) {
  try {
    const response = await request({
      method: "GET",
      url: `https://api.hubapi.com/crm-associations/v1/associations/${companyId}/HUBSPOT_DEFINED/13`,
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
