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
    var val = req.body.text_value;
    var select_channel = req.body.select_channel;
    var config_info = req.body.config_info;
    var save = req.body.save;
    var data = [];
    var index = 1;
    if(save){
        if(config_info){
            try {
                JSON.parse(config_info);
            } catch (err) {
                return res.send("save failed");
            }
            activity_wrapper.save(select_channel,config_info,function(reply){
                if(0 == reply){
                    return res.send("save succeed");
                }
                return res.send("save failed");
            });

        }
    }
    else  if(select_channel){
        activity_wrapper.get_all(function(reply){
            var all_channel = reply;
            var array = [];
            for(var v in all_channel){
                array.push(v);
                data.push({id:index,text:v});
                ++index;
            }
            for(var v in all_channel){
                if(v == select_channel){
                    return res.render('config2',{
                        title: 'config',
                        channel:v,
                        activity:all_channel[v],
                        array:array,
                        data : data,
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
