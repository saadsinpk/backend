const mongoose = require('mongoose');

const subListSchema = new mongoose.Schema({
    title: String,
    items: [{
      title: String,
      image: String,
      description: String,
    }]
  });
  

const mainListSchema = new mongoose.Schema({
    title: String,
    subLists: [subListSchema]
});

module.exports = {
    MainList: mongoose.model("MainList", mainListSchema),
    SubList: mongoose.model("SubList", subListSchema),
  };