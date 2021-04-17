'use strict';
const fetch = require('node-fetch');
const mysql = require('serverless-mysql')({
  config: {
    host     : 'database-1.cmkpz4xan9bs.us-east-2.rds.amazonaws.com',
    database : 'stars-wars',
    user     : 'admin',
    password : 'admin123'
  }
})

module.exports.postPeople = async (event) => {

  const resp = await fetch(`https://swapi.py4e.com/api/people/${event['number']}/?format=json`);
  const data = await resp.json();
  const {name, height, mass, hair_color, skin_color, eye_color, gender} = data;

  let results = await mysql.query(`CALL sp_people_insert (?,?,?,?,?,?,?)`,[name, height, mass, hair_color, skin_color, eye_color, gender]);
 
  await mysql.end() 

  return {
    statusCode: 200,
    message:  results[0][0].message
  }; 

};

module.exports.getPeople = async () => {

  let results = await mysql.query(`SELECT * FROM people`);
 
  await mysql.end()

  return {
    statusCode: 200,
    body: results
  };
  
};
