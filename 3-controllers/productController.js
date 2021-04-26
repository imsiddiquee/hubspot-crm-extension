const Product = require("../4-models/Product");
const createError = require("http-errors");

exports.get_products = async (req, res, next) => {
  //res.send("getting a list of all products");
  try {
    //const results = await Product.find({}, { __v: 0 });
    const results = await Product.find({}, { name: 1, price: 1, _id: 0 });
    //const results = await Product.find({ price: 8000 }, {});
    return res.send(results);
  } catch (error) {
    next(error);
  }
};

exports.post_products = async (req, res, next) => {
  const { name, price } = req.body;
  const product = new Product({
    name,
    price,
  });

  try {
    const result = await product.save();
    return res.send(result);
  } catch (error) {
    next(error);
  }
};

exports.get_product_by_id = async (req, res, next) => {
  //res.send("get a single product.");
  const id = req.params.id;

  try {
    const product = await Product.findById(id);
    if (!product) {
      throw createError.NotFound("Product not found");
      return;
    }
    res.send(product);
  } catch (error) {
    next(error);
  }
};
exports.update_product_by_id = async (req, res, next) => {
  //res.send("update a single product.");
  try {
    const id = req.params.id;
    const { price } = req.body;
    const options = { new: true };

    const result = await Product.findByIdAndUpdate(id, { price }, options);
    res.send(result);
  } catch (error) {
    next(error);
  }
};
exports.delete_product_by_id = async (req, res, next) => {
  //res.send("delete a single product.");
  const id = req.params.id;
  try {
    const result = await Product.findByIdAndDelete(id);
    res.send(result);
  } catch (error) {
    next(error);
  }
};
