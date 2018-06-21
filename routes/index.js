var express = require("express");
var router = express.Router();
var path = require("path");
var media = path.join(__dirname, "../public/media");
var fs = require("fs");
/**
 * path.join() 路径拼接
 * __dirname 全局变量，存储的是文件所在的文件目录
 * media 返回为  E:music/public/media
 * fs 为文件操作系统
 * readdir 读取一个目录的内容
 * */

/* GET home page. */
router.get("/", function(req, res, next) {
    fs.readdir(media, (err, name) => {
        if (err) {
            console.log(err);
        } else {
            console.log(name); // name 为一个数组
            res.render("index", { title: "Music", music: name }); // 发送给前台
        }
    });
});

module.exports = router;
