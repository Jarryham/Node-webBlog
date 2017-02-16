/**
 * Created by Administrator on 2017/2/9.
 */
'use strict';

let db = require('../db');

function Article (article){
    this.title = article.title;
    this.content = article.content;
    this.uid = article.uid;
    this.time = article.time;
    this.answerCount = article.answerCount;
};

/**
 * 保存文章
 * @param callback
 */
Article.prototype.save = function(callback){
    db.query('insert into articles (title,content,uid,answerCount,time) values (?,?,?,?,now())',[this.title,this.content,this.uid,this.answerCount],callback)
}


/**
 * 获取文章总数
 * @param callback
 */
//      getTotalCounts
Article.getTotalCounts = function(callback){
    db.query('select count(*) as total from articles',[],callback)
}

/**
 * 查询文章
 * @param offset
 * @param count
 * @param callback
 */
Article.getTotalCountsByLimit = (offset,count,callback)=>{
    db.query('SELECT t1.id AS aid,t1.title,t1.content,t1.time,t1.uid,t1.answerCount,t2.username,t2.email,t2.pic FROM articles t1 LEFT JOIN users t2 ON t1.uid = t2.id order BY t1.time DESC limit ?,?',[offset,count],callback)
}

/**
 * 根据搜索条件搜索文章
 * @param callback
 */
Article.getTotalCountsByCondition = (searchStr,callback)=> {
    db.query('select count(*) as total from articles where articles.title like ?',['%'+searchStr+'%'],callback)
}
/**
 * 模糊查询结果
 * @param searchStr
 * @param offset
 * @param count
 * @param callback
 */
Article.getTotalCountsByLimitByCondition = (searchStr,offset,count,callback) => {
    db.query('SELECT t1.id as aid,t1.title,t1.content,t1.time,t1.uid,t1.answerCount,t2.username,t2.email,t2.pic FROM articles t1 LEFT JOIN users t2 ON t1.uid=t2.id WHERE title LIKE ? ORDER BY t1.time desc limit ?,?',['%'+searchStr+'%',offset,count],callback)
}

/**
 * 根据aid查找文章
 * @param aid
 * @param callback
 */
Article.findArticleByAid =(aid,callback)=>{
    db.query('SELECT t1.id AS aid,t1.content,t1.title,t1.answerCount,t1.time,t1.uid,t2.username,t2.email,t2.pic FROM articles t1 LEFT JOIN users t2 ON t1.uid = t2.id WHERE t1.id = ?',[aid],callback)
}


module.exports = Article