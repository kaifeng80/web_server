/**
 * Created by King Lee on 2014/7/9.
 */
var express = require('express');
var activity_wrapper = require('../module/activity_wrapper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if(!req.session.user){
        return res.redirect('/login');
    }
    activity_wrapper.get_all(function(reply){
        var all_channel = reply;
        var array = [];
        for(var v in all_channel){
            array.push(v);
        }
        res.render('config', {
            title: 'config',
            channel:"",
            activity:"",
            content:'content',
            array:array,
            link_show: req.session.user ? "注销":"登录",
            link: req.session.user ? "/logout":"/login"
        });
    });
});

router.post('/', function(req, res) {
    var val = req.body.text_value;
    var select_channel_index = req.body.select_channel;
    if(select_channel_index){
        activity_wrapper.get_all(function(reply){
            var all_channel = reply;
            var array = [];
            for(var v in all_channel){
                array.push(v);
            }
            for(var v in all_channel){
                if(v == select_channel_index){
                    return res.render('config',{
                        title: 'config',
                        channel:v,
                        activity:all_channel[v],
                        content:'content',
                        array:array,
                        link_show: req.session.user ? "注销":"登录",
                        link: req.session.user ? "/logout":"/login"
                    });
                }
            }
        });
    }
    else{
        return res.redirect('/');
    }
});

module.exports = router;
