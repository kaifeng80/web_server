/**
 * Created by King Lee on 15-1-19.
 */
var express = require('express');
var router = express.Router();
var mask_word_wrapper = require('../module/mask_word_wrapper');

/* GET home page. */
router.get('/', function(req, res) {
    if(!req.session.user){
        return res.redirect('/login');
    }
    mask_word_wrapper.get_all(function(reply){
        res.render('mask_word', { title: 'Express',
            link_show: req.session.user ? "注销":"登录",
            link: req.session.user ? "/logout":"/login",
            data:reply
        });
    });
});

router.post('/', function(req, res) {
    var result = {
        code :200
    };
    var type = req.body.type;
    var keyword = req.body.keyword;
    if(type == "add"){
        mask_word_wrapper.add(keyword,function(reply){
            if(!reply){
                code :201
            }
            mask_word_wrapper.get_all(function(reply){
                result.data = reply;
                return  res.end(JSON.stringify(result) + '\n', 'utf8');
            });
        });
    }else if(type == "del"){
        mask_word_wrapper.del(keyword,function(reply){
            if(reply){
                if(!reply){
                    code :201
                }
            }
            mask_word_wrapper.get_all(function(reply){
                result.data = reply;
                return  res.end(JSON.stringify(result) + '\n', 'utf8');
            });
        });
    }

});
module.exports = router;
