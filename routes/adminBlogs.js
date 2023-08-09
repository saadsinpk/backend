const express = require("express");
const { uploadFile } = require("../s3");
const routeers = express.Router();
const multer = require("multer");
const Blog = require("../Modelss/BlogModel");

routeers.get("/get-blogs", async (req, res) => {
    try {
        let result = await Blog.find()
        if (!result) {
            res.send("data not Found")
        } else {
            res.send(result)
        }
    } catch (e) {
        console.log(e)
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

routeers.post("/blogs/post", upload.single("img"), async (req, res) => {
    // const imagge = req.files["img"];
    const img = await uploadFile(req.file)

    // console.log(req.file)
    console.log(img)
    // // console.log(updateThumbs)
    // console.log(req.body)
    try {
        const category = await new Blog({
            name: req.body.name,
            description: req.body.description,
            image: img
        });
        category.save()
            .then((succ) => {
                console.log(succ)
                res.send("File save succ")
            })
            .catch((err) => {
                res.send("File Dont  save succ")
                console.log(err)
            })

    } catch (error) {
        res.status(500).json(error);
    }
});
// routeers.post("/blogs/post", upload.single("img"), async (req, res) => {
//     // const iconss = req.files["icon"];
//     const imagge = req.files["img"];
//     // const updatePic = await uploadFile(iconss)


//     const { name, description, image } = req.body;
//     // const category = await new Category({
//     //     name: name ? name : "default",
//     //     description: req.body.description,
//     //     image: uploadImage
//     // });
//     try {
//         const uploadImage = await uploadFile(imagge)
//         console.log(uploadImage)
//         // category.save().then((response) => {
//         //     res.json({
//         //         Msg: `Category Saved Sucessfully`,
//         //         success: true,
//         //         result: response,
//         //     });
//         // });
//     } catch (error) {
//         res.status(500).json(error);
//         console.log(error)
//     }
// }
// );
routeers.get("/post/:id", async (req, res) => {
    // let {id} = req.body
    try {
        // let id = req.params.id
     let result = await  Blog.findById(req.params.id)
     console.log(result)
        if(!result){
            res.send("No data found")
        }else{
            res.send(result)
        }
     
    } catch (e) {
        console.log(e)
    }
})

routeers.put("/edit/get-blogs/:id", upload.single("img"), async (req, res) => {
    let { name, description, img } = req.body
    // console.log(req.body.image ? )
    try {
        let 
        // console.log(req.file)
        // console.log(req.body)
        // var a = ''
        // if (!img) {
        //     var image1 = uploadFile(req.file)
        //     a = image1
        // }
    } catch (e) {
        console.log(e)
    }
    // console.log(a)
})

routeers.delete("/delete-blogs/:id", async (req, res) => {
    try {
        let id = req.params.id
        let FindId = await Blog.findById(id)

        if (!FindId) {
            res.send("ID not Founded ").status(400)
        } else {
            let result = await Blog.findByIdAndDelete(FindId)
            if (!result) {
                res.send("Not delected ").status(400)
            } else {
                res.send("deleted sucessfuly").status(200)
            }

        }


    } catch (e) {
        console.log(e)
    }
})

module.exports = routeers;