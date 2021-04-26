const { httpGet, httpPost, httpPut, httpDelete } = require("./httpService");

const currentAPPURI = "https://daalvaat.herokuapp.com";
const responseSize = 5;

process.on("message", async (payload) => {
  if (payload.companyId !== "") {
    const response = await longDataProcess(payload);
    //process.send({ result: response });
    // process.disconnect();
  }
});

async function longDataProcess(payload) {
  try {
    const { companyId: COMPANYID, client: APPCLIENT } = payload;

    const companies = await get_parent_company_to_child_company(
      COMPANYID,
      APPCLIENT
    );
    if (companies.length == 0) {
      return res.json(displayEmptyMessage("Check company information"));
    }
    console.log("companies:::", companies);

    const deals = await get_company_to_deal(companies, APPCLIENT);
    if (deals.length == 0) {
      return res.json(
        displayEmptyMessage("Check company related deal information")
      );
    }
    console.log("deals:::", deals);

    const lineItemIds = await get_deal_to_line_item(deals, APPCLIENT);
    if (lineItemIds.length == 0) {
      return res.json(
        displayEmptyMessage("Check deal related line items information")
      );
    }
    console.log("lineItemIds:::", lineItemIds);

    const chunkArr = function (length) {
      var data = [...lineItemIds];
      var result = Array();
      while (data.length > 0) {
        result.push(data.splice(0, length));
      }
      return result;
    };

    var chunks = chunkArr(90);

    let counter = 1;
    let tempLineItems = [];
    for (let chunk of chunks) {
      const { lineItems } = await get_group_of_line_items_by_ids(
        chunk,
        APPCLIENT
      );
      if (counter == 5) {
        setTimeout(function () {
          counter = 1;
        }, 1000);
      }
      tempLineItems.push(...lineItems);
    }

    console.log("tempLineItems::", tempLineItems.slice(0, 2));

    let sortedLineItems = tempLineItems.sort((a, b) =>
      a.carrier > b.carrier ? 1 : -1
    );
    console.log("sortedLineItems::", sortedLineItems.slice(0, 2));

    //process.send({ results: sortedLineItems.splice(0,3) });

    const groupBy = (key) =>
      sortedLineItems.reduce((total, currentValue) => {
        const newTotal = total;
        if (total.length && total[total.length - 1][key] === currentValue[key])
          newTotal[total.length - 1] = {
            ...total[total.length - 1],
            ...currentValue,
            price:
              parseFloat(total[total.length - 1].price) +
              parseFloat(currentValue.price),
          };
        else newTotal[total.length] = currentValue;
        return newTotal;
      }, []);

    const result = groupBy("carrier").sort((a, b) =>
      a.price < b.price ? 1 : -1
    );
    console.log("response::", result.slice(0, 2));

    let response = formatCompanyData(result.slice(0, responseSize));
    process.send({ results: result });
    //return res.json({ results: response });

    console.log("result:::", result);

    //store in db
    const uri = `${currentAPPURI}/carrierAnalytic/api/post_carrier_analytic`;

    const dataScope = {
      companyId: payload.companyId,
      clientApp: APPCLIENT.client,
      extensions: JSON.stringify(response),
      description: `Carrier Analytic for company ${APPCLIENT.client}`,
    };

    console.log("option", dataScope);
    let { data } = await httpPost(uri, dataScope);

    process.disconnect();
  } catch (error) {
    console.log(error);
  }
}

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

async function get_parent_company_to_child_company(companyId, APPCLIENT) {
  try {
    const uri = `${currentAPPURI}/hubspot/api/parent_company_to_child_company/${companyId}?client=${APPCLIENT.client}`;
    const { data } = await httpGet(uri);
    data.push(parseInt(companyId));

    return data;
  } catch (error) {
    console.log(error);
    //console.log(error);
  }
}

async function get_company_to_deal(companies, APPCLIENT) {
  try {
    let counter = 1;
    let deals = [];
    for (let company of companies) {
      const uri = `${currentAPPURI}/hubspot/api/get_company_to_deal/${company}?client=${APPCLIENT.client}`;
      const { data } = await httpGet(uri);
      deals.push(...data);

      if (counter === 80) {
        setTimeout(function () {
          counter = 1;
        }, 1000);
      }

      counter += 1;
    }
    return deals;
  } catch (error) {
    console.log(error);
  }
}

async function get_deal_to_line_item(deals, APPCLIENT) {
  try {
    let counter = 1;
    let lineItemIds = [];
    for (let deal of deals) {
      const uri = `${currentAPPURI}/hubspot/api/get_deal_to_line_item/${deal}?client=${APPCLIENT.client}`;
      const { data } = await httpGet(uri);
      lineItemIds.push(...data);
      if (counter > 90) {
        setTimeout(function () {
          counter = 1;
        }, 1000);
      }

      counter += 1;
    }
    return lineItemIds;
  } catch (error) {
    console.log(error);
  }
}
async function get_group_of_line_items_by_ids(lineItemIds, APPCLIENT) {
  try {
    const ids = lineItemIds;

    const uri = `${currentAPPURI}/hubspot/api/post_get_a_group_of_line_items_by_id?client=${APPCLIENT.client}`;

    let { data } = await httpPost(uri, { ids });
    return data;
  } catch (error) {
    console.log(error);
  }
}

function formatCompanyData(res) {
  let title = "Carrier"; //1
  let link = "http://example.com/1"; //1

  let settingsAction = [];

  let response = formatResponse(res);

  return response.map((item, index) => {
    return {
      ...item,
      title: title,
      link: link,
      settingsAction: settingsAction,
    };
  });
}

function formatResponse(res) {
  return res.map((item, index) => {
    let objectId = index + 1;
    let properties = [
      {
        label: "Carrier",
        dataType: "STRING",
        value: item.carrier,
      },
      {
        label: "Total price",
        dataType: "CURRENCY",
        value: item.price,
        currencyCode: "USD",
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

process.on("uncaughtException", function (err) {
  console.log("Error happened: " + err.message + "\n" + err.stack + ".\n");
  console.log("Gracefully finish the routine.");
});
