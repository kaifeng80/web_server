/**
 * Created by King Lee on 2014/7/9.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var array = [];
    for(var i = 0; i < 10; ++i)
    {
        array.push(i);
    }
    res.render('config', { title: 'config',content:'content',array:array });
});

module.exports = router;
