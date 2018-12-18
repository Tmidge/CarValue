## Car Value app

A small express app for determining a cars value.

## Usage

Simpliy post to http://localhost:3000/ with the following data in a JSON body: 

* originalValue: Positive number,
* modelYear: Positive integer betwen 1885 and the current year plus one,
* miles: Integer greater than 0,
* previousOwners: Integer greater than 0,
* collisions: Integer greater than 0