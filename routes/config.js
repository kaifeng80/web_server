/**
 * Created by King Lee on 2014/7/9.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if(!req.session.user){
        return res.redirect('/login');
    }
    var array = [];
    for(var i = 0; i < 10; ++i)
    {
        array.push(i);
    }
    res.render('config', {
        title: 'config',
        content:'content',
        array:array,
        link_show: req.session.user ? "注销":"登录",
        link: req.session.user ? "/logout":"/login"
    });
});

router.post('/', function(req, res) {
    var val = req.body.text_value;
    return res.redirect('/');
});

module.exports = router;
