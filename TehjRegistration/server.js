const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(bodyParser.json());

const usersFilePath = './users.json';

// Helper function to read users from file
const readUsersFromFile = () => {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  try {
    const usersData = fs.readFileSync(usersFilePath);
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return [];
  }
};

// Helper function to write users to file
const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Endpoint to register a new user
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  const users = readUsersFromFile();
  users.push(newUser);
  writeUsersToFile(users);
  res.status(201).send({ message: 'User created successfully' });
});

// Endpoint to validate login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsersFromFile();
  const user = users.find((user) => user.email === email && user.password === password);
  if (user) {
    res.send({ message: 'Login successful' });
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
