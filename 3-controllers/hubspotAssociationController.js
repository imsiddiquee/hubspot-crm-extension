var request = require("request-promise");
const Hubspot = require("hubspot");
const { hubs } = require("../5-utils/constants");

//http://localhost:8080/hubspot/api/get_company_to_deal/5654143298?client=TierOne
exports.get_company_to_deal = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const { client } = req.query;

    console.log({ client });

    const response = await request({
      method: "GET",
      url: `https://api.hubapi.com/crm-associations/v1/associations/${companyId}/HUBSPOT_DEFINED/6`,
      qs: {
        hapikey: hubs[client].hapikey,
        limit: 100,
      },
      json: true,
    });

    let { results } = response;
    console.log(results);

    return res.json(results.length ? results : []);
  } catch (error) {
    next(error);
  }
};

//http://localhost:8080/hubspot/api/get_deal_to_line_item/4702253081?client=TierOne
exports.get_deal_to_line_item = async (req, res, next) => {
  try {
    const dealId = req.params.id;
    const { client } = req.query;

    const response = await request({
      method: "GET",
      url: `https://api.hubapi.com/crm-associations/v1/associations/${dealId}/HUBSPOT_DEFINED/19`,
      qs: {
        hapikey: hubs[client].hapikey,
        limit: 100,
      },
      json: true,
    });
    let { results } = response;

    return res.json(results.length ? results : []);
  } catch (error) {
    next(error);
  }
};

//localhost:8080/hubspot/api/parent_company_to_child_company/5644499285?client=TierOne
http: exports.parent_company_to_child_company = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const { client } = req.query;

    const response = await request({
      method: "GET",
      url: `https://api.hubapi.com/crm-associations/v1/associations/${companyId}/HUBSPOT_DEFINED/13`,
      qs: {
        hapikey: hubs[client].hapikey,
        limit: 100,
      },
      json: true,
    });
    let { results } = response;

    return res.json(results.length ? results : []);
  } catch (error) {
    next(error);
  }
};
