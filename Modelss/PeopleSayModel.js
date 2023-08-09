const mongoose = require("mongoose")

const PeopleModel = new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    userName:{
        type: String,
    },
    destination:{
        type:String
    },
    img:{
     type:String   
    }
})

const PeopleSay = mongoose.model("PeopleSay",PeopleModel)

module.exports = PeopleSay