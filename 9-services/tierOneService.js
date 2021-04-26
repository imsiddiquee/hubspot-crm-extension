const cluster = require("cluster");
const { fork } = require("child_process");
const path = require("path");
const { httpGet, httpPost, httpPut, httpDelete } = require("./httpService");
const TierOne = require("../10-entity/TierOne");
const { COMPANY_API_URI } = require("../5-utils/hubspotAPI");
const { hubs } = require("../5-utils/constants");

const cacheTime = 10;
//const currentAPPURI = "http://localhost:8080";
const currentAPPURI = "https://daalvaat.herokuapp.com";

exports.get_a_line_item_by_id = async (req, res, next) => {
  try {
    let lineItemId = req.params.id;
    const uri = `${currentAPPURI}/hubspot/api/get_a_line_item_by_id/${lineItemId}?client=${hubs.TierOne.client}`;
    console.log({ uri });
    const { data } = await httpGet(uri);

    //return res.render("lineItem", { lineItem: data });
    return res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//http://localhost:8080/tierone/post_get_a_group_of_line_items_by_id
// {
//   "ids": [
//     1259303592,
//     1308941986

//   ]
// }

exports.post_get_a_group_of_line_items_by_id = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const uri = `${currentAPPURI}/hubspot/api/post_get_a_group_of_line_items_by_id?client=${hubs.TierOne.client}`;

    let { data } = await httpPost(uri, { ids });
    return res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//http://localhost:8080/tierone/get_tierone_company_carrier?hs_object_id=5837990014&client=TierOne
exports.get_tierone_company_carrier = async (req, res, next) => {
  try {
    const { hs_object_id: companyId, hs_parent_company_id } = req.query;
    //const companyId = hs_object_id;
    console.log("hs_object_id", companyId);

    const processPath = path.join(
      __dirname,
      "..",
      "9-services",
      "tierone_carrier_dataProcess.js"
    );

    //check cache for 5 days
    //check on db,is exist
    //if exist show from db
    //not exit continue

    //get carrier analytic data
    const uri = `${currentAPPURI}/carrierAnalytic/api/get_carrier_analytic_by_id/${companyId}?client=${hubs.TierOne.client}`;
    console.log({ uri });
    const { data } = await httpGet(uri);

    //check cache on defined cache time session.
    if (
      Object.keys(data).length > 0 &&
      new Date(data.createdAt).getTime() >
        new Date(Date.now() + 3600 * 1000 * (-24 * cacheTime)).getTime()
    ) {
      return res.json({ results: JSON.parse(data.extensions) });
    }

    //delete existing data
    if (Object.keys(data).length > 0) {
      const uri = `${currentAPPURI}/carrierAnalytic/api/delete_carrier_analytic/${companyId}?client=${hubs.TierOne.client}`;
      console.log({ uri });
      const { data } = await httpDelete(uri);
    }

    const child = fork(processPath);
    child.send({ companyId, client: hubs.TierOne });
    child.on("message", (response) => {
      //console.log("response::", response.results);
    });

    //remove previously openned node instance when we finished
    child.on("close", function (msg) {
      this.kill();
    });

    return res.json(displayEmptyMessage("Please wait try another time!"));

    //return res.json({ message: "please wait" });
  } catch (error) {
    console.log("error::", error);
    next(error);
  }
};

function displayEmptyMessage(message) {
  return {
    results: [
      {
        objectId: 1,
        title: "Carrier",
        link: "http://example.com/1",

        properties: [
          {
            label: "Description",
            dataType: "STRING",
            value: message,
          },
        ],
        actions: [],
        settingsAction: [],
      },
    ],
  };
}

exports.get_company = async (companyId) => {
  const company = {};
  try {
    const { data } = await httpGet(`${COMPANY_API_URI}/${companyId}`, {
      params: {
        hapikey: TierOne.get_tierone_hapi_key(),
      },
    });
    if (data) {
      return data;
    }
    return company;
  } catch (error) {
    return company;
  }
};
