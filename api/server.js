const express = require('express');
var app = express();
var port = process.env.PORT || 3000;


app.listen(port);
console.log('RESTful API server started on: ' + port);