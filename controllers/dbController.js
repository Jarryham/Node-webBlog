/**
 * Created by Administrator on 2017/2/5.
 */
'use strict';
let db=require('db');
let dbCtr={};
//读取数据，渲染主页
dbCtr.showIndex=function(req,res,next){
    //查询目录
    db.query('select * from users where username = ?',['小乔']);
    res.render('index')
}

//输出
module.exports=dbCtr;
