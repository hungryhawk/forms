const express = require('express');

const usersDB = {
  users: require('./models/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require('fs').promises;

const path = require('path');

const app = express();
app.use(express.json());

app.post('/api/users', async (req, res) => {
  const {  name, password } = req.body;

  const newUser = {
    username: name,
    password: password,
    id: usersDB.users.length
      ? usersDB.users[usersDB.users.length - 1].id + 1
      : 1,
  };

  usersDB.setUsers([...usersDB.users, newUser]);
  await fsPromises.writeFile(
    path.join(__dirname, 'models', 'users.json'),
    JSON.stringify(usersDB.users)
  );
  res.status(201).json('User was created');
  //   console.log(usersDB.users);
});

app.get('/api/users/:id', (req, res) => {
  const foundUser = usersDB.users.find(
    (user) => user.id === parseInt(req.params.id)
  );
  if (!foundUser) {
    return res
      .status(400)
      .json({ message: `User with ID ${req.params.id} not found` });
  }
  res.json(foundUser);
});

app.listen(5000, console.log('server is running'));
