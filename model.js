const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const Schema = mongoose.Schema({
      name: String,
      facebookID: String,
      accessToken: String,
},{collection:'users'});

const model = mongoose.model('users',Schema);

module.exports = model;


