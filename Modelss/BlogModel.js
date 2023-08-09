const mongoose = require("mongoose")

const BlogSchema = new mongoose.Schema({
    name:{
       type : String
    },
    description:{
    type: String        
    },
    image:{
        type : String
    }
})

const Blog = mongoose.model("Blogs",BlogSchema)

module.exports = Blog;
