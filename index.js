const express = require("express");
const https = require("https");
const app = express();
const path = require("path");
const fs = require('fs');
const fetch = require("node-fetch");
const user = require("./model");
const cors = require('cors');
require('dotenv').config();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect("mongodb://localhost:27017/facebook-outhlogin-withMongo")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => console.error("Couldnot connected to database"));

const port = process.env.PORT || 3000;

const swaggerOptions = {
  swaggerDefinition:{
      info:{
          title:"Facebook API",
          description:"Facebook API information",
          contact:{
              name: "amititme68@gmail.com"
          },
          servers:["https://localhost:3000"]
      }
  },
  // ['.routes/*.js']
  apis:["index.js"]
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *  get:
 *    description: Use to authenticate using Facebook
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.use("/", express.static(path.join(__dirname, "template")));



app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json())


/**
 * @swagger
 * /login-with-facebook:
 *  post:
 *    description: Use to authenticate using Facebook
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.post('/login-with-facebook',async (req,res)=>{
  const {accessToken, userID} = req.body;
  const response = await fetch(`https://graph.facebook.com/v11.0/me?access_token=${accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`);
  const json = await response.json();

  if(json.id === userID){
    // a valid user
    // check here if the user existsin DB, then login else register and then log in
    const resp = await user.findOne({facebookID: userID});
        if(resp){
          // user is registered
          res.json({status:'ok', data:'You are logged in'});
         // window.close();
        }
        else{
          const person = new user({
            name: 'something',
            facebookID: userID,
            accessToken
          })

          await person.save();
          res.json({status:'ok',data: 'You are registered and logged in'});
        //  window.close();
        }
  }else{
    //impersonate someone
    // just send a warning
    res.json({status:'error', data:'Invalid User'});
  }
})


const options = {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
};

https.createServer(options, app).listen(port);


