// Use the dotenv package, to create environment variables
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express()
const apiRouter = require('./api/index.js'); 

// Create a constant variable, PORT, based on what's in process.env.PORT or fallback to 3000
const PORT = process.env.PORT || 3002;


// Require morgan and body-parser middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Have the server use morgan with setting 'dev'
app.use(morgan('dev'));
app.use(cors());

// Import cors 
// Have the server use cors()

// Have the server use bodyParser.json()

// Have the server use your api router with prefix '/api'-

// Import the client from your db/index.js

// Create custom 404 handler that sets the status code to 404.
// app.use((req, res, next) => {
//     res.status(404).send('Request failed with status code 404');
//   });
// Create custom error handling that sets the status code to 500
// and returns the error as an object
// function handleServerError(error) {
//     console.error(error);
  
//     const errorObject = {
//       statusCode: 500,
//       message: 'Internal Server Error',
//       error: error.toString() 
//     };
  
//     return errorObject;
//   }
  
//   try {
//     throw new Error('Something went wrong');
//   } catch (error) {
//     const errorObject = handleServerError(error);
//     console.log(errorObject);
//   }

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})



// Start the server listening on port PORT
// On success, connect to the database
