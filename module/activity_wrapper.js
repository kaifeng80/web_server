/**
 * Created by King Lee on 2014/7/14.
 */
var redis_activity_wrapper = require('../nosql/redis_activity_wrapper');

var activity_wrapper = module.exports;

activity_wrapper.get = function(channel,version,cb){
    redis_activity_wrapper.get_activity(channel,version,function(reply){
        if(reply){
            cb(JSON.parse(reply));
        }else{
            redis_activity_wrapper.get_activity('template','template',function(reply){
                if(reply) {
                    cb(JSON.parse(reply));
                }
            });
        }
    });
};

activity_wrapper.save = function(channel_version,activity,cb){
    redis_activity_wrapper.save_activity(channel_version,activity,function(reply){
        cb(reply);
    });
};

activity_wrapper.get_all = function(cb){
    redis_activity_wrapper.get_all_activity(function(reply){
        if(reply){
            cb(reply);
        }
    });
};

