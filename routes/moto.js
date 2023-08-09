const express = require("express");
const Moto = require("../Modelss/MotoSchema"); // Import your Moto model
const router = express.Router();

const multer = require("multer");
const fs = require("fs");

const { uploadFile } = require('../s3')

router.get("/get-motos", (req, res) => {
  try {
    Moto.find({}).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/profiles";
    fs.access(dir, (error) => {
      if (error) {
        fs.mkdir(dir, (error) => cb(error, dir));
      } else {
        cb(null, dir);
      }
    });
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + file.originalname;
    req.body.pic = "uploads/profiles/" + fileName;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });



router.post(
  "/moto/create",
  upload.single("image"), // Assuming you have set up multer correctly
  async (req, res) => {
    // console.log(req.file);
    try {
      const { title, description } = req.body;
      const imageUrl = req.body.pic; // Use the saved file path
      const images = await uploadFile(req.file)
      console.log(images)

      const moto = new Moto({
        title,
        description,
        image: images, // Assuming 'picture' is the field for the image URL in your Moto model
      });

      const savedMoto = await moto.save();

      res.json({
        Msg: `Moto Saved Successfully`,
        success: true,
        result: savedMoto,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "An error occurred while saving the Moto" });
    }
  }
);

// Other routes and middleware...

module.exports = router;


router.get("/moto/:id", (req, res) => {
  try {
    Moto.findById(req.params.id).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/moto/:id/update", upload.single("image"), async (req, res) => {
  try {
    const motoId = req.params.id;
    const { title, description } = req.body;
    const images = await uploadFile(req.file)
    
    const moto = await Moto.findById(motoId);
    if (!moto) {
      return res.status(404).json({ error: "Moto not found" });
    }
    
    moto.title = title;
    moto.description = description;
    if (images) {
      moto.image = images;
    }

    const updatedMoto = await moto.save();

   res.status(200).json({
       success: true,
      result: updatedMoto,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});


router.delete("/delete/moto/:id", (req, res) => {
  Moto.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      Moto.find({}).then((response) => {
        res.status(200).json({
          Msg: `${req.params.id} deleted Successfully`,
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
