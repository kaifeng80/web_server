/**
 * Created by King Lee on 2014/7/9.
 */
var express = require('express');
var activity_wrapper = require('../module/activity_wrapper');
var router = express.Router();

var last_version_record = "";
var schedule_list = [];
var schedule_timer_list = [];
function get_month(month_string){
    var month = 0;
    switch(month_string){
        case "Jan":{
            month = 0;
            break;
        }
        case "Feb":{
            month = 1;
            break;
        }
        case "Mar":{
            month = 2;
            break;
        }
        case "Apr":{
            month = 3;
            break;
        }
        case "May":{
            month = 4;
            break;
        }
        case "Jun":{
            month = 5;
            break;
        }
        case "Jul":{
            month = 6;
            break;
        }
        case "Aug":{
            month = 7;
            break;
        }
        case "Sep":{
            month = 8;
            break;
        }
        case "Oct":{
            month = 9;
            break;
        }
        case "Nov":{
            month = 10;
            break;
        }
        case "Dec":{
            month = 11;
            break;
        }
        default :{
            break;
        }
    }
    return month;
};

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
        var default_channel = "template:";
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
            var  find_version = false;
            var  find_channel = false;
            for(var i = 0; i < versions.length; ++i){
                if(versions[i].text == array_version_chanel[1]){
                    find_version = true;
                }
            }
            for(var j = 0; j < channels.length; ++j){
                if(channels[j].text == array_version_chanel[0]){
                    find_channel = true;
                }
            }
            if(!find_version){
                versions.push({id:index,text:array_version_chanel[1]});
            }
            if(!find_channel){
                channels.push({id:index,text:array_version_chanel[0]});
            }
            ++index;
        }
        //  show schedule initialize date
        var date_now = new Date();
        var month_now = date_now.getMonth() + 1;
        var day_now = date_now.getDate();
        var year_now = date_now.getFullYear();
        var date_format = year_now + "-" + month_now + "-" + day_now;

        res.render('config2', {
            title: 'config',
            channel:default_channel,
            activity:default_activity,
            versions:JSON.stringify(versions),
            channels:JSON.stringify(channels),
            last_version_record:last_version_record,
            data : JSON.stringify(data),
            date:date_format,
            schedule_list:JSON.stringify(schedule_list),
            link_show: req.session.user ? "注销":"登录",
            link: req.session.user ? "/logout":"/login"
        });
    });
});

router.post('/', function(req, res) {
    var type = req.body.type;
    var version = req.body.version;
    var channel = req.body.channel;
    var result = {
        code :200
    };
    if(!version || !channel){
        if("plan" != type){
            return res.end(JSON.stringify({code:201}) + '\n', 'utf8');
        }
    }
    if("show" == type){
        activity_wrapper.get_just(channel,version,function(reply){
            result.activity = reply;
            if(!reply){
                result.code = 202;
            }
            res.end(JSON.stringify(result) + '\n', 'utf8');
        });
    }
    else if("add" == type){
        activity_wrapper.add(channel,version,function(reply,activity){
            if(1 != reply){
                result.code = 202;
            }
            result.activity = activity;
            return  res.end(JSON.stringify(result) + '\n', 'utf8');
        });
    }
    else if("del" == type){
        activity_wrapper.del(channel,version,function(reply){
            if(1 != reply){
                result.code = 202;
            }
            return  res.end(JSON.stringify(result) + '\n', 'utf8');
        });
    }
    else if("save" == type){
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
    else if("record" == type){
        last_version_record = version;
        return res.end(JSON.stringify(result) + '\n', 'utf8');
    }
    else if("plan" == type){
        var channel_src = req.body.channel_src;
        var channel_des = req.body.channel_des;
        var plan_date = req.body.plan_date;
        plan_date = plan_date.split(' ');
        var month = get_month(plan_date[1]) + 1;
        var day = parseInt(plan_date[2]);
        var year = parseInt(plan_date[3]);
        var date_future = new Date(year,month,day);
        var date_now_tmp = new Date();
        var month_now = date_now_tmp.getMonth() + 1;
        var day_now = date_now_tmp.getDate();
        var year_now = date_now_tmp.getFullYear();

        var hours_now = date_now_tmp.getHours();
        var minutes_now = date_now_tmp.getMinutes();
        var second_now = date_now_tmp.getSeconds();

        var date_now = new Date(year_now,month_now,day_now,hours_now,minutes_now,second_now);
        var timer_interval = date_future.getTime() - date_now.getTime();
        var interval_object = setInterval(function(){
            activity_wrapper.get_just(channel_src,version,function(activity){
                if(activity){
                    activity_wrapper.save(channel_des + ":" + version,activity,function(reply){

                    });
                }
            });
            clearInterval(interval_object);
            for(var n = 0; n < schedule_timer_list.length; ++n){
                if(interval_object == schedule_timer_list[n]){
                    schedule_list.splice(n,1);
                    schedule_timer_list.splice(n,1);
                }
            }
        },timer_interval);
        schedule_list.push({id:schedule_list.length,text:JSON.stringify({channel_src:channel_src,channel_des:channel_des,plan_date:plan_date}) });
        schedule_timer_list.push(interval_object);
        result.code = 205;
        result.schedule_list = schedule_list;
        return res.end(JSON.stringify(result) + '\n', 'utf8');
    }
    else if("clean" == type){
        for(var n = 0; n < schedule_timer_list.length; ++n){
            clearInterval(schedule_timer_list[n]);
        }
        schedule_list = [];
        schedule_timer_list = [];
        return res.end(JSON.stringify(result) + '\n', 'utf8');
    }
});
module.exports = router;
