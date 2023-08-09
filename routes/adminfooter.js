const express = require("express");
const Footer = require("../Modelss/Footer");
const routers = express.Router();

routers.get("/get-footertext", async (req, res) => {
  try {
    Footer.find().then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
    //   .then((response) => {
    //     res.status(200).json({
    //       success: true,
    //       result: response,
    //     });
    //   });
    //   res.status(200).json({
    //       success: true,
    //       result: response,
    //     });
  } catch (error) {
    res.status(500).json(error);
  }
});

routers.post("/footertext/create", async (req, res) => {
  try {
    console.log('req.body',req.body)

    // let Footer = new Footer(req.body);
    // await Footer.save().then((response) => {
    //   res.send(response)
    //   // res.json({
    //   //   Msg: `Footer Content Saved Sucessfully`,
    //   //   success: true,
    //   //   result: response,
    //   // });
    // });
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

// router.get("/faq/:id", (req, res) => {
//   try {
//     Faq.findById(req.params.id).then((response) => {
//       res.status(200).json({
//         success: true,
//         result: response,
//       });
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

routers.put("/footer/update/:id", async (req, res) => {
  try {

    let id = req.params.id
    let findId = await Footer.findById(id)
    if (!findId) {
      res.send("id can not get").status(400)
    } else {
      // res.send(findId)
      let update = await Footer.findByIdAndUpdate(id, req.body, { new: true })
      console.log(req.body)
      if (!update) {
        res.send("Can not be edit").status(200)
      } else {
        res.send(update)
      }
      
      // });
    }
  } catch (error) {
    res.send(error);
  }
});

// router.delete("/delete/faq/:id", (req, res) => {
//   Faq.findByIdAndDelete(req.params.id, (err) => {
//     if (!err) {
//       Faq.find({}).then((response) => {
//         res.status(200).json({
//           Msg: `${req.params.id} deleted Sucessfully`,
//           success: true,
//           result: response,
//         });
//       });
//     } else {
//       res.status(500).json(err);
//     }
//   });
// });

module.exports = routers;
