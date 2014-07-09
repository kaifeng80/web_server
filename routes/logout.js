/**
 * Created by King Lee on 2014/7/9.
 */
var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/', function(req, res) {
    res.render('logout', { title: 'logout' });
});

module.exports = router;

