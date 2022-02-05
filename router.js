const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const dotenv = require('dotenv')
const router = new express.Router();

router.get('/',function(req,res){
    res.sendFile('./templates/home.html',{root:__dirname})
});

module.exports = router