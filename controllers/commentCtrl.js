/**
 * Created by Administrator on 2017/2/13.
 */
'use strict'
const comments = require('../models/comments')
exports.sendComment = (req,res,next)=>{
    //获取请求的数据
    let userid = req.body.userid;
    let aid = req.body.aid;
    let content = req.body.content;
    comments.saveComment(aid,userid,content,(err,result)=>{
        if (err) next(err)
        let id = aid
        res.redirect('/viewArticle/'+id)
    })



}