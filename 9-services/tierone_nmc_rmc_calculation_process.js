const Hubspot = require("hubspot");
const { httpGet } = require("./httpService");
const { hubs } = require("../5-utils/constants");
const createHttpError = require("http-errors");
let _hubspot;

process.on("message", (payload) => {
  if (payload.companyId !== "") {
    const sum = longComputation();
    process.send(sum);
  }
});

function longComputation() {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  }
  return sum;
}

function longComputePromise() {
  return new Promise((resolve, reject) => {
    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
      sum += i;
    }
    resolve(sum);
  });
}

// process.on("message", async (payload) => {
//   if (payload.companyId !== "") {
//     const message = await parentTotalNrcMrc(
//       payload.companyId,
//       payload.companyName
//     );
//     //console.log("message", message);
//     process.send(message);
//   }
// });

async function parentTotalNrcMrc(companyId, companyName) {
  try {
    _hubspot = getHubSpot();

    const { properties } = await getCompany(companyId);
    if (!properties.hs_parent_company_id) {
      return {
        messageType: 400,
        message: `Calculate can not perform for the parent company, ${companyName} with id:: ${companyId} is a parent company.`,
      };
    }

    const parentCompanyId = properties.hs_parent_company_id.value;
    const companyDetails = await associatedCompanyDetails(parentCompanyId);

    if (Object.keys(companyDetails.companies).length === 0) {
      return {
        messageType: 400,
        message: `Something wrong on calculation process`,
      };
    }

    //calculate summary
    let sumNrc = companyDetails.companies.map((p) => p.company_nrc);
    companyDetails.totlNrc = sumNrc.reduce((a, b) => a + b, 0);

    let sumMrc = companyDetails.companies.map((p) => p.company_mrc);
    companyDetails.totlMrc = sumMrc.reduce((a, b) => a + b, 0);

    //udpate parenet company
    const data = {
      properties: [
        {
          name: "total_mrc",
          value: companyDetails.totlMrc,
        },

        {
          name: "total_nrc",
          value: companyDetails.totlNrc,
        },
      ],
    };

    let updatedCompany = await _hubspot.companies.update(parentCompanyId, data);

    if (updatedCompany) {
      return {
        messageType: 200,
        message: `Company:: ${parentCompanyId}, successfully update total nrc and mrc.`,
      };
    }

    return {
      messageType: 500,
      message: `something wrong.`,
    };
  } catch (error) {
    console.log("error", error.message);
  }
}

function getHubSpot() {
  return new Hubspot({ apiKey: hubs.TierOne.hapikey });
}

async function getCompany(companyId) {
  return await _hubspot.companies.getById(companyId);
}

async function associatedCompanyDetails(companyId) {
  let companyDetails = {
    companies: [],
    totlNrc: 0,
    totlMrc: 0,
    parentCompanyId: companyId,
  };
  const { results = [] } = await getAssociatedCompanies(companyId);

  for (let company of results) {
    let currentCompany = await _hubspot.companies.getById(company); //await tierOne_get_company(company);
    let formatedCompany = formatCompanyData(currentCompany);
    companyDetails.companies.push(formatedCompany);
  }

  return companyDetails;
}

function formatCompanyData(company) {
  let {
    properties: { createdate, company_nrc = 0, company_mrc = 0, name },
  } = company;

  return {
    createdate: createdate.value,
    company_nrc: company_nrc ? Number(company_nrc.value) : 0,
    company_mrc: company_mrc ? Number(company_mrc.value) : 0,
    name: name.value,
  };
}

async function getAssociatedCompanies(companyId) {
  const company = {};
  try {
    const { data } = await httpGet(
      `https://api.hubapi.com/crm-associations/v1/associations/${companyId}/HUBSPOT_DEFINED/13`,
      {
        params: {
          hapikey: hubs.TierOne.hapikey,
          limit: 100,
        },
      }
    );
    if (data) {
      return data;
    }
    return data;
  } catch (error) {
    return company;
  }
}
