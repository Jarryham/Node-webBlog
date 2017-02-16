/**
 * Created by Administrator on 2017/2/7.
 */
'use strict';

const captchapng = require('captchapng');

exports.getPic = ()=>{
    let num = parseInt(Math.random()*9000+1000)
    let p = new captchapng(80,30,num);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);

    let img = p.getBase64();
    let imgbase64 = new Buffer(img,'base64');

    return {
        text:num,
        buf:imgbase64
    }
}