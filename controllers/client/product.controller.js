const Product = require("../../models/product.model");
// const test = require("../../helpers/pug.helper");
// [GET] /products/
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  for (const item of products) {
    item.priceNew = item.price * (1 - item.discountPercentage / 100);
    item.priceNew = item.priceNew.toFixed(0);
  }

  // console.log(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products: products,
    // test: test
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const product = await Product.findOne({
      status: "active",
      deleted: false,
      slug: slug,
    });

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product,
    });
  } catch {
    res.redirect("/");
  }
};
