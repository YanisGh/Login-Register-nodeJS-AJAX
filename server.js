const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const app = express();
const crypto = require('crypto');

function MD5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

app.use(cors());

// Configure MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'nodeuser',
  password: 'node',
  database: 'LicencePro'
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Handle the login request
app.get('/login', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  const hashedPassword = MD5(password);
  console.log('Hashed Password:', hashedPassword);

  // Perform the SQL query to search for the login data
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  connection.query(query, [username, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Check if the login credentials are valid
    if (results.length > 0) {
      console.log("sa marche");
      res.send('Login successful!');
    } else {
      res.send('Invalid login credentials!');
    }
  });
});
// Handle the register request
app.post('/register', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    const hashedPassword = MD5(password);
    console.log('Hashed Password:', hashedPassword);
  
    // Perform the SQL query to search for the existing user
    const query = `SELECT * FROM users WHERE username = ?`;
    connection.query(query, [username], (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      if (results.length > 0) {
        console.log('User already exists');
        res.send('User already exists');
      } else {
        // Perform the SQL query to insert a new user
        const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
        connection.query(insertQuery, [username, hashedPassword], (err, result) => {
          if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).send('Internal Server Error');
            return;
          }
          console.log('User inserted successfully!');
          res.send('User inserted successfully!');
        });
      }
    });
  });
  

// 404 error handling middleware
app.use(function(req, res, next){
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(404).send('Adresse inconnue :' + req.originalUrl);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
