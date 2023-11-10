//Intialize express and Router
const express = require('express');
const router = express.Router();

//Start creating routes
router.get('/',(req,res)=>{
    res.render("index");
})

module.exports = router;