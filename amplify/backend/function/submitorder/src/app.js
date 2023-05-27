/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["mailgun_key"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	API_RESTOCARTE_GRAPHQLAPIENDPOINTOUTPUT
	API_RESTOCARTE_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const apiGraphQLAPIIdOutput = process.env.API_RESTOCARTE_GRAPHQLAPIIDOUTPUT
const environment = process.env.ENV
const restaurantTable = `Restaurant-${apiGraphQLAPIIdOutput}-${environment}`

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const aws = require('aws-sdk')

const getMailgunKey = async () => {
  const { Parameters } = await (new aws.SSM())
      .getParameters({
        Names: ['mailgun_key'].map(secretName => process.env[secretName]),
        WithDecryption: true
      })
      .promise()
  return Parameters[0].Value
}

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});
app.post('/submitorder', async function (req, res) {
  const formData = require('form-data')
  const Mailgun = require('mailgun.js')
  const mailgun = new Mailgun(formData)
  const mg = mailgun.client({username: 'api', key: await getMailgunKey()})

  try {
    const documentClient = new aws.DynamoDB.DocumentClient();
    documentClient.get({
      TableName: restaurantTable,
      Key: {id: req.body.restaurant},
    }, (err, restaurantData) => {
      if (err) {
        console.log(err)
        res.sendStatus(400)
        return
      }

      const onlineOrders = restaurantData.Item.onlineOrders

      if (!onlineOrders) {
        res.sendStatus(400)
        return
      }

      const contactEmail = restaurantData.Item.userId

      const data = {
        from: "Restocarte Orders <orders@notify.restocarte.com>",
        to: [contactEmail],
        subject: 'Order - Table ' + req.body.table,
        text: req.body.orderItems.join('\r\n')
      }

      mg.messages.create('notify.restocarte.com', data)
          .then(msg => console.log(msg)) // logs response data
          .catch(err => console.log(err)); // logs any error

      res.sendStatus(200)
    });
  } catch (err) {
    console.log(err)
    res.sendStatus(400)
  }
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
