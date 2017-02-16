/**
 * Created by Administrator on 2017/2/13.
 */
'use strict';

let db = require('../db');

function comments(comment){
    this.id = comment.id;
    this.aid = comment.aid;
    this.uid = comment.uid;
    this.time = comment.time;
    this.content = comment.content;
};

/**
 * 根据文章ID查询对应的评论列表
 * @param aid
 * @param callback
 */
comments.findCommentByaid = (aid,callback) => {
    db.query('SELECT t1.id AS cid,t1.content,t1.time,t1.uid,t1.aid,t2.username,t2.email,t2.pic FROM comments t1 LEFT JOIN users t2 ON t1.uid = t2.id WHERE aid = ? ORDER BY t1.time DESC',[aid],callback)
}

comments.saveComment = (aid,userid,content,callback) => {
    db.query('insert into comments (content,uid,aid,time) values (?,?,?,now())',[content,userid,aid],callback)
}

module.exports = comments