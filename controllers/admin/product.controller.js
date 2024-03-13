const Product = require("../../models/product.model");
const filerStatusHelper = require("../../helpers/filter-state.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");

//[GET] /admin/products/
module.exports.index = async (req, res) => {
  try {
    const find = {
      deleted: false,
    };

    if (req.query.status) {
      find.status = req.query.status;
    }

    // Status Filter
    const filterState = filerStatusHelper(req.query);
    // End Status Filter

    // Option Change
    const optionsChange = [
      {
        value: "active",
        title: "Hoạt động",
      },
      {
        value: "inactive",
        title: "Dừng hoạt động",
      },
      {
        value: "delete-all",
        title: "Xóa tất cả",
      },
      {
        value: "change-position",
        title: "Thay đổi vị trí",
      },
    ];
    // End Option Change

    // Search
    if (req.query.keyword) {
      const regex = new RegExp(req.query.keyword, "i");
      find.title = regex;
    }
    // End Search

    // Trash Product
    const deleteCount = await Product.countDocuments({ deleted: true });
    // End Trash Product

    // Pagination
    const countProducts = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req.query, 4, countProducts);
    // End Pagination

    const products = await Product.find(find)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .sort({ position: "desc" });

    res.render("admin/pages/products/index", {
      pageTitle: "Danh sách sản phẩm",
      products,
      filterState,
      optionsChange,
      deleteCount,
      keyword: req.query.keyword,
      pagination: objectPagination,
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

//[GET] /admin/products/trash
module.exports.trash = async (req, res) => {
  try {
    const find = {
      deleted: true,
    };

    // Option Change
    const optionsChange = [
      {
        value: "restore",
        title: "Khôi phục",
      },
      {
        value: "delete-force",
        title: "Xóa vĩnh viễn",
      },
    ];
    // End Option Change

    // Pagination
    const countProducts = await Product.countDocuments(find);
    const objectPagination = paginationHelper(req.query, 4, countProducts);
    // End Pagination

    const products = await Product.find(find)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    res.render("admin/pages/products/trash", {
      pageTitle: "Thùng rác",
      products,
      optionsChange,
      pagination: objectPagination,
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;
    await Product.updateOne(
      { _id: id },
      { status: status, updateAt: new Date() }
    );

    req.flash("success", "Cập nhật trạng thái thành công!");

    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
      case "active":
      case "inactive":
        await Product.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: req.body.type,
          }
        );
        req.flash("success", "Cập nhật trạng thái thành công!");
        break;
      case "delete-all":
        await Product.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        req.flash("success", "Xóa sản phẩm thành công!");
        break;
      case "restore":
        await Product.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: false,
            updateAt: new Date(),
          }
        );
        req.flash("success", "Khôi phục sản phẩm thành công!");
        break;
      case "delete-force":
        await Product.deleteMany({
          _id: { $in: ids },
        });
        req.flash("success", "Xóa sản phẩm thành công!");
        break;
      default:
        break;
      case "change-position":
        ids.forEach(async (item) => {
          let [id, position] = item.split("-");
          position = parseInt(position);

          await Product.updateOne(
            {
              _id: id,
            },
            {
              position: position,
            }
          );
        });
        req.flash("success", "Thay đổi vị trí thành công!");
        break;
    }
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    await Product.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );
    req.flash("success", "Xóa sản phẩm thành công!");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

//[PATCH] /admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
  try {
    const id = req.params.id;

    await Product.updateOne(
      {
        _id: id,
      },
      {
        deleted: false,
        updateAt: new Date(),
      }
    );
    req.flash("success", "Khôi phục sản phẩm thành công!");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

//[DELETE] /admin/products/delete-force/:id
module.exports.deleteForce = async (req, res) => {
  try {
    const id = req.params.id;

    await Product.deleteOne({
      _id: id,
    });
    req.flash("success", "Xóa sản phẩm thành công!");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
  });
};

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.file && req.file.filename) {
      req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    if (req.body.position == "") {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const product = new Product(req.body);
    product.save();

    res.redirect(`/${systemConfig.prefixAdmin}/products`)
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try{
    const id = req.params.id

    const product = await Product.findOne({
      _id: id,
      deleted: false
    })
  
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product
    });
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

//[POST] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id

    const product = await Product.findOne({
      _id: id
    });

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.file && req.file.filename) {
      req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    if (req.body.position == "") {
      
      req.body.position = product.position;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    await Product.updateOne({
      _id: req.params.id,
      deleted: false
    },req.body)

    req.flash("success","Cập nhật sản phẩm thành công")

    res.redirect("back")
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try{
    const id = req.params.id

    let product = await Product.findOne({
      _id: id,
      deleted: false
    })

    product = product.toObject()
  
    product.priceNew = product.price * (1 - product.discountPercentage / 100);
    product.priceNew = product.priceNew.toFixed(0);
    
    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product
    });

  } catch (error) {
    console.log(error);
    req.flash("error", error);
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};