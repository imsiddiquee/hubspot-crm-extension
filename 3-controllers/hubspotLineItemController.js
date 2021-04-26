var request = require("request-promise");
const { json } = require("express");
const { hubs } = require("../5-utils/constants");

//http://localhost:8080/tierone/get_a_line_item_by_id/1259303592?client=TierOne
exports.get_a_line_item_by_id = async (req, res, next) => {
  try {
    const lineId = req.params.id;
    const { client } = req.query;

    console.log({ lineId });

    const { properties } = await request({
      method: "GET",
      url: `https://api.hubapi.com/crm-objects/v1/objects/line_items/${lineId}`,
      qs: {
        hapikey: hubs[client].hapikey,
        properties: "hs_product_id",
        properties: "name",
        properties: "supplier_drop_down",
        properties: "price",
      },
      json: true,
    });

    let lineItem = {
      lineId,
      name: properties.name ? properties.name.value : "",
      hs_product_id: properties.hs_product_id
        ? properties.hs_product_id.value
        : 0,
      supplier_drop_down: properties.supplier_drop_down
        ? properties.supplier_drop_down.value
        : "",
      price: properties.price ? properties.price.value : 0,
    };
    return res.json(lineItem);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//http://localhost:8080/hubspot/api/post_get_a_group_of_line_items_by_id?client=TierOne
//body
// {
//   "ids": [
//     1259303592,
//     1308941986

//   ]
// }
exports.post_get_a_group_of_line_items_by_id = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const { client } = req.query;

    console.log("ids::", ids);

    const result = await request({
      method: "POST",
      url: `https://api.hubapi.com/crm-objects/v1/objects/line_items/batch-read?hapikey=${hubs[client].hapikey}&properties=name&properties=quantity&properties=price&properties=hs_product_id&properties=supplier_drop_down`,

      body: {
        ids,
      },
      json: true,
    });

    let lineItems = [];

    for (let current of ids) {
      let properties = result[current].properties;

      let lineItem = {
        dealId: "",
        companyId: "",
        name: properties.name ? properties.name.value : "",
        product_id: properties.hs_product_id
          ? properties.hs_product_id.value
          : 0,
        carrier: properties.supplier_drop_down
          ? properties.supplier_drop_down.value
          : "",
        price: properties.price ? properties.price.value : 0,
        quantity: properties.quantity ? properties.quantity.value : 0,
      };

      lineItems.push(lineItem);
    }

    return res.json({ lineItems });
  } catch (error) {
    console.log(error);
  }
};
