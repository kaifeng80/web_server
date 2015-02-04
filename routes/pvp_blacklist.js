/**
 * Created by King Lee on 15-2-3.
 */
var express = require('express');
var router = express.Router();
var pvp_blacklist_arapper = require('../module/pvp_blacklist_arapper');
/* GET home page. */
router.get('/', function(req, res) {
    if(!req.session.user){
        return res.redirect('/login');
    }
    pvp_blacklist_arapper.get_block_list(function(reply){
        var black_list = reply;
        var black_list_show = [];
        for(var i = 0; i < black_list.length; ++i){
            var black = new Object();
            var find = false;
            var index = 0;
            for(var j = 0; j < black_list_show.length; ++j){
                if(black_list[i].device_guid == black_list_show[j].device_guid){
                    find = true;
                    index = j;
                }
            }
            if(find){
                ++black_list_show[index].count;
            }else{
                black.nickname = black_list[i].nickname;
                black.device_guid = black_list[i].device_guid;
                black.interval = black_list[i].record_time - black_list[i].upload_last_time;
                black.count = 1;
                black_list_show.push(black)
            }
        }
        var string_black_list_show = "";
        for(var j = 0; j < black_list_show.length; ++j){
            string_black_list_show += JSON.stringify(black_list_show[j]);
        }
        res.render('pvp_blacklist',
            {
                title: 'pvp_blacklist',
                link_show: req.session.user ? "注销":"登录",
                link: req.session.user ? "/logout":"/login",
                black_list:string_black_list_show
            }
        );
    });
});

router.post('/', function(req, res) {
    var result = {
        code :200
    };
    var type = req.body.type;
    var device_guid = req.body.device_guid;
    if(type == "del"){
        pvp_blacklist_arapper.disappear_from_rank_pvp(device_guid);
    }else if(type == "restore"){
        pvp_blacklist_arapper.display_rank_pvp(device_guid);
    }
    return  res.end(JSON.stringify(result) + '\n', 'utf8');
});
module.exports = router;
