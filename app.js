const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();
const https = require("https");



const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {

    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]

  }

  const jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/" +
    process.env.LIST_ID;

  const options = {
    method: "POST",
    auth: "Alberto:" + process.env.API_KEY
  }


  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

})


app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
