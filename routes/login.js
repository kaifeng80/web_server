/**
 * Created by King Lee on 2014/7/9.
 */
var express = require('express');
var router = express.Router();
var user_wrapper = require('../module/user');

/* GET login page. */
router.get('/', function(req, res) {
    res.render('login', { title: '用户登入' });
});

router.post('/', function(req, res) {
    user_wrapper.get_user(req.body.username,function(reply){
        if(req.body.password != reply){
            return res.redirect('/');
        }
        else{
            return res.redirect('/config');
        }
    });
});

module.exports = router;
