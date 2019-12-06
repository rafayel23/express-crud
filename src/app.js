const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const assetsPath = path.join(__dirname, '../assets');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(assetsPath));

function getUsers() {
  return JSON.parse(fs.readFileSync('./users.json').toString());
}

function setUsers(users) {
  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
}

app.get('/users', (req, res) => {
  let {minAge, maxAge} = req.query;
  minAge = +minAge || 0;
  maxAge = +maxAge || Infinity;
  const users = getUsers();
  res.send(users.filter(user => user.age >= minAge && user.age <= maxAge));
})

app.post('/users', (req, res) => {
  const users = getUsers();
  let {name, age} = req.body;
  age = +age;
  users.push({name, age});
  setUsers(users);
  res.send(users);
})

app.post('/remove', (req, res) => {
  const {index} = req.body;
  const users = getUsers();

  if(index) {
    users.splice(index, 1);
  } else {
    users.length = 0;
  }

  setUsers(users);
  res.send(users);
})

app.listen(3000, () => {
  console.log('Running server on localhost:3000');
})