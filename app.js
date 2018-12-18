const express = require('express');
const expressJoi = require('express-joi');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

const postCarValue = {
  originalValue: expressJoi.Joi.types.Number().positive().required(),
  modelYear: expressJoi.Joi.types.Number().positive().integer().min(1885).max(new Date().getFullYear() + 1).required(),
  miles: expressJoi.Joi.types.Number().integer().min(0).required(),
  previousOwners: expressJoi.Joi.types.Number().integer().min(0).required(),
  collisions: expressJoi.Joi.types.Number().integer().min(0).required()
};

app.get('/', (req, res) => res.send(`Please include the following data: {
  originalValue: Positive number,
  modelYear: Positive integer betwen 1885 and the current year plus one,
  miles: Integer greater than 0,
  previousOwners: Integer greater than 0,
  collisions: Integer greater than 0
}`));

app.post('/', expressJoi.joiValidate(postCarValue), determineValue);

const monthlyDepreciation = .005
const ageMax = 10
const mileDepreciation = .002
const mileMax = 150000
const tooManyOwnersDepreciation = .25
const noPreviousOwners = 1.10
const collisionDepreciation = .02
const maxCollisions = 5
const tooManyOwners = 3


function determineValueFromAge(modelYear, value){
  // cars are sold a year ahead i.e. a 2019 model year is generally made and sold in 2018
  const yearOfManufacture = modelYear -1; 
  const age = new Date().getFullYear() - yearOfManufacture;
  const  depreciationModifier = 12 * monthlyDepreciation * (age >= ageMax ? ageMax : age);

  return value - (depreciationModifier * value);
}

function determineValueFromMileage(miles, value){
  miles = parseInt(miles / 1000, 10) * 1000;

  const depreciationModifier = mileDepreciation * (miles >= mileMax ? mileMax / 1000 : miles / 1000);

  return value - (depreciationModifier * value);
}

function determineValueFromOwners(owners, value){
  if(owners >= tooManyOwners){
    value -= (tooManyOwnersDepreciation * value);
  }

  return value;
}

function determineFinalValue(collisions, owners, value){
  const depreciationModifier = collisionDepreciation * (collisions >= maxCollisions ? maxCollisions : collisions);

  value -= (depreciationModifier * value);
  if(owners === 0){
      value *= noPreviousOwners;
  }

  return value.toFixed(2);
}

function determineValue(req, res){ 
  const data = req.body;
  const valueFromAge = determineValueFromAge(data.modelYear, data.originalValue);
  const valueFromMileage = determineValueFromMileage(data.miles, valueFromAge);
  const valueFromOwners = determineValueFromOwners(data.previousOwners, valueFromMileage);
  const finalValue =  determineFinalValue(data.collisions, data.previousOwners, valueFromOwners);

  res.send(JSON.stringify({value: finalValue}));
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));