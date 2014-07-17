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
        //var data = "[{ id: 5, text: '5%' }, { id: 10, text: '10%'}, { id: 20, text: '20%'}, { id: 30, text: '30%'}]";
        var data = [];
        var versions = [];
        var channels = [];
        var default_channel = "template:0.0.0";
        var default_activity = {};
        var index = 1;
        for(var v in all_channel){
            if(default_channel == v){
                default_activity = all_channel[v];
            }
            array.push(v);
            data.push({id:index,text:v});
            var version_chanel = v;
            var array_version_chanel = version_chanel.split(':');
            versions.push({id:index,text:array_version_chanel[1]});
            channels.push({id:index,text:array_version_chanel[0]});
            ++index;
        }
        res.render('config2', {
            title: 'config',
            channel:default_channel,
            activity:default_activity,
            versions:JSON.stringify(versions),
            channels:JSON.stringify(channels),
            array:array,
            data : JSON.stringify(data),
            link_show: req.session.user ? "注销":"登录",
            link: req.session.user ? "/logout":"/login"
        });
    });
});

router.post('/', function(req, res) {
    var type = req.body.type;
    var version = req.body.version;
    var channel = req.body.channel;
    if(!version || !channel){
        return res.end(JSON.stringify({code:201}) + '\n', 'utf8');
    }
    if("show" == type){
        activity_wrapper.get_just(channel,version,function(reply){
            var result = {
                code :200,
                activity:reply
            };
            if(!reply){
                result.code = 202;
            }
            res.end(JSON.stringify(result) + '\n', 'utf8');
        });
    }
    else if("save" == type){
        var result = {
            code :200
        };
        var config = req.body.config;
        if(config){
            try {
                JSON.parse(config);
            } catch (err) {
                result.code = 201;
                return  res.end(JSON.stringify(result) + '\n', 'utf8');
            }
            activity_wrapper.save(channel + ":" + version,config,function(reply){
                if(0 != reply){
                    result.code = 202;
                }
                return  res.end(JSON.stringify(result) + '\n', 'utf8');
            });
        }
    }
});

module.exports = router;
