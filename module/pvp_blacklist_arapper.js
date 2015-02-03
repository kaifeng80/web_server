/**
 * Created by King Lee on 15-2-3.
 */

var redis_rank_pvp_wrapper = require('../nosql/redis_rank_pvp_wrapper');

var pvp_blacklist_wrapper = module.exports;

pvp_blacklist_wrapper.get_block_list = function(cb){
    redis_rank_pvp_wrapper.get_block_list(cb);
};

pvp_blacklist_wrapper.disappear_from_rank_pvp = function(device_guid){
    redis_rank_pvp_wrapper.disappear_from_rank_pvp(device_guid);
};

pvp_blacklist_wrapper.display_rank_pvp = function(device_guid){
    redis_rank_pvp_wrapper.display_rank_pvp(device_guid);
};

