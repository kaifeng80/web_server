
var redis_mask_word_wrapper = require('../nosql/redis_mask_word_wrapper');

var mask_word_wrapper = module.exports;

mask_word_wrapper.add = function(keyword,cb){
    redis_mask_word_wrapper.add_online(keyword,cb);
};

mask_word_wrapper.del = function(keyword,cb){
    redis_mask_word_wrapper.del_online(keyword,cb);
};

mask_word_wrapper.get_all = function(cb){
    redis_mask_word_wrapper.get_all_online(cb);
};