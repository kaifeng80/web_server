/**
 * Created by King Lee on 2014/7/9.
 */
var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res) {
    res.render('login', { title: '用户登入' });
});

router.post('/', function(req, res) {
    res.redirect('/config');
});

module.exports = router;
