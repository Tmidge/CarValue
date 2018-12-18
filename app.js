const express = require('express');
const expressJoi = require('express-joi');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

const postCarvalue = {
  originalValue: expressJoi.Joi.types.Number().positive().required(),
  modelYear: expressJoi.Joi.types.Number().positive().integer().min(1885).max(9999).required(),
  miles: expressJoi.Joi.types.Number().positive().integer().required(),
  previousOwners: expressJoi.Joi.types.Number().positive().integer().required(),
  collisions: expressJoi.Joi.types.Number().positive().integer().required()
};

app.get('/', (req, res) => res.send(`Please include the following data: {
  originalValue: Positive number,
  modelYear: Positive integer betwen 1885-9999,
  miles: Positive integer,
  previousOwners: Positive integer,
  collisions: Positive integer
}`));

app.post('/', expressJoi.joiValidate(postCarvalue), determineValue);


function determineValue(req, res){ 
  res.send(`req: ${JSON.stringify(req.body)}`);
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));