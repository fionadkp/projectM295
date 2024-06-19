const express = require("express");
const app = express();
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');