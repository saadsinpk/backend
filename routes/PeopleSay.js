const express = require("express")
const Routerss = express.Router()
const PeopleSay = require("../Modelss/PeopleSayModel")
const { sendResponse } = require("../Helper/Helper")
const multer = require("multer");
const { uploadFile } = require("../s3");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


Routerss.get("/pepleSay/get", async (req, res) => {
  try {
    let result = await PeopleSay.find()
    if (!result) {
      res.send(sendResponse(false, result, "Data not Found")).status(400)

    } else {
      res.send(sendResponse(false, result, "Data  Found")).status(200)
    }
  } catch (e) {
    console.log(e)
  }
})

// Routerss.post("/pepleSay/save", upload.single("img"), async (req, res) => {
//   // const imagge = req.files["img"];
//   // const img = await uploadFile(req.file)

//   // console.log(req.file)
//   console.log(req.file)
//   // // console.log(updateThumbs)
//   // console.log(req.body)
//   try {


//   } catch (error) {
//       res.status(500).json(error);
//   }
// });

Routerss.post("/pepleSay/save", upload.single("img"), async (req, res) => {
  const img = await uploadFile(req.file)
  // console.log(img)
  // console.log(req.file)
  // console.log(req.body)
  try {

    // const PeopleSay = new PeopleSay(req.body);
    const result = new PeopleSay({
      title: req.body.title,
      description: req.body.description,
      userName: req.body.userName,
      destination: req.body.destination,
      img: img
    });
    await result.save()
    if (!result) {
      res.send(sendResponse(false, false, "result Not Save")).status(400)
    } else {
      res.send(sendResponse(false, result, "result  Save")).status(200)
    }
  } catch (e) {
    console.log(e)
  }
})

Routerss.put("/pepleSay/edit/:id", upload.single("img"), async (req, res) => {

  var myImage = ''
  if (!req.body.img) {
    const imagess = await uploadFile(req.file)
    myImage = imagess
  } else {
    myImage = req.body.img
  }

  // let 
    console.log(req.body.img)
  // console.log(req.file)

  try {
    let id = req.params.id

    let findId = await PeopleSay.findById(id)
    console.log(findId)
      if(!findId){
        res.send("data not found")
      }else{

  let updateData = await PeopleSay.findByIdAndUpdate(id, {
    title: req.body.title,
    description: req.body.description,
    userName:req.body.userName,
    destination:req.body.destination,
    img: myImage,
  }, { new: true })

    if(!updateData){
      res.send(sendResponse(true,null,"Data Does not update Sucessfully")).status(400)

    }else{
      res.send(sendResponse(true,updateData,"Data Updataed Sucessfully")).status(200)
    }

      }
        
    
    
    // arr.push(findId)
    // console.log(arr)

    // if (arr[0].img.includes("https://")) {
    //   let updateData = await PeopleSay.findByIdAndUpdate(id, req.body, { new: true })
    //   if (!updateData) {
    //     console.log("update Failed")
    //   } else {
    //     console.log("update suceesfully")
    //   }
    //   // console.log("not create image ")
    // } else {
    //   const img = await uploadFile(req.file)
    //   // let updateData = await PeopleSay.findByIdAndUpdate(id, req.body, { new: true })
    //   let updateData = await PeopleSay.findByIdAndUpdate(id, {
    //     title: req.body.title,
    //     description: req.body.description,
    //     userName: req.body.userName,
    //     destination: req.body.destination,
    //     img: img
    //   }, { new: true })

    //   if (!updateData) {
    //     // res.send(sendResponse(false,"error not save file or upload image"))
    //     console.log("updateData")
    //   }
    //   // res.send(sendResponse(tru,"error not save file or upload image"))
    //   console.log("updateData")

    // }

    // console.log(arr[0])
    // console.log(findId)
    // req.file ? awdawd  :let id = req.params.id
    // if(req.file){

    // }else{


    // }


    //     if(!findId){
    //       res.send(sendResponse(false,null,"ID can not Found")).status(400)
    //     }else{
    //     // res.send(findId)  
    //     // console.log(findId)
    //     let updateData = await Footer.findByIdAndUpdate(id, req.body, { new: true })
    // // let update = await Footer.findByIdAndUpdate(id,req.body,{new:true})
    //     if(!updateData){
    //       res.send("Can not be edit").status(200)
    //     }else{
    //       res.send(updateData)
    //     }

    // });

    // } 
  } catch (error) {
    res.send(error);
  }
});

Routerss.delete("/pepleSay/delete/:id", async (req, res) => {
  try {
    let id = req.params.id
    let findId = await PeopleSay.findById(id)

    // console.log(findId)

    if (!findId) {
      res.send(sendResponse(false, null, "ID can not Found")).status(400)
    } else {
      // res.send(findId)  
      // console.log(findId)
      let result = await PeopleSay.findByIdAndDelete(findId)
      // let update = await Footer.findByIdAndUpdate(id,req.body,{new:true})
      if (!result) {
        res.send(sendResponse(false, null, "Data can not delete")).status(400)
      } else {
        res.send(sendResponse(false, result, "Data Deleted SucessFully")).status(200)
      }

      // });

    }
  } catch (error) {
    res.send(error);
  }
});


module.exports = Routerss;
