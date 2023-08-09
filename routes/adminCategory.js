const express = require("express");
const Category = require("../Modelss/Category");
const router = express.Router();
const multer = require("multer");
const { uploadFile } = require('../s3')
const fs = require("fs");


router.get("/get-categories", (req, res) => {
  try {
    Category.find({}).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadCategory = multer({ storage: storage });



router.post(
  "/category/create",
  uploadCategory.fields([{ name: "icon" }, { name: "img" }]),
  async (req, res) => {
    const iconss = req.files["icon"];
    const imagge = req.files["img"];
    const updatePic = await uploadFile(iconss)
    const updateThumbs = await uploadFile(imagge)



    const { name, description, icon, img } = req.body;
    const category = await new Category({
      name: name ? name : "default",
      description: req.body.description,
      icon: updatePic,
      img: updateThumbs
    });
    try {
      category.save().then((response) => {
        res.json({
          Msg: `Category Saved Sucessfully`,
          success: true,
          result: response,
        });
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.get("/category/:id", (req, res) => {
  try {
    Category.findById(req.params.id).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put(
  "/category/:id/update",
  uploadCategory.fields([{ name: "icon" }, { name: "img" }]),
  async (req, res) => {
    const iconss = req.files["icon"];
    const imagge = req.files["img"];
    const updatePic = await uploadFile(iconss)
    const updateThumbs = await uploadFile(imagge)
    try {
      var category = {
        name: req.body.name,
        description: req.body.description,
        img: updateThumbs,
        icon: updatePic
      };
      Category.findByIdAndUpdate(req.params.id, category).then((response) => {
        res.status(200).json({
          success: true,
          result: response,
        });
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.delete("/delete/category/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      Category.find({}).then((response) => {
        res.status(200).json({
          Msg: `${req.params.id} deleted Sucessfully`,
          success: true,
          result: response,
        });
      });
    } else {
      res.status(500).json(err);
    }
  });
});

module.exports = router;
