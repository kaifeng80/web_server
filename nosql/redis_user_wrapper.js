/**
 * Created by King Lee on 2014/6/19.
 */
var redis_pools = require("../nosql/redis_pools");
var h_user = 'h_user';

var redis_user_wrapper = module.exports;

redis_user_wrapper.get_user = function(name,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hget(h_user,name,function (err, reply){
            if(err){
                //  some thing log
            }
            cb(reply);
            release();
        });
    });
};