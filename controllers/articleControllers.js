/**
 * Created by Administrator on 2017/2/9.
 */
    'use strict'
let articles = require('../models/articlesDb');
let Pager = require('../common/pager');
let moment = require('moment');//操作时间显示
const comments = require('../models/comments')
const md = require('markdown-it')();

function replaceAll(str,oldStr,newStr){
    while(str.indexOf(oldStr) != -1)
        str = str.replace(oldStr,newStr);
    return str;
}


/**
 * 显示文章发表页
 * @param req
 * @param res
 * @param next
 */
exports.publishArticle = (req,res,next) =>{
    let user = req.session.user;
   res.render('publish',{user})
}

/**
 * 保存发布的文章
 * @param req
 * @param res
 * @param next
 */
exports.saveArticle = (req,res,next)=>{
    let title = req.body.title;
    let content = req.body.content;
    let uid = req.session.user.id;
    content = replaceAll(content,'\\','/')
    content = md.render(content)
    let answerCount = 0;
    let newArt = new articles({title,content,uid,answerCount});
    newArt.save((err,result)=>{
        if(err) next(err);
        let id = result.insertId;
        res.redirect('/viewArticle/'+id)
    })
}

exports.getPage = (req,res,next) => {
    //let user = req.session.user;
    let totalPages = 0;
    let viewPages = 3;
    let currentPage = req.query.page||1;

    //查询数据库
    articles.getTotalCounts((err,results) => {
        if (err) next(err);
        let totalCounts = results[0].total;
        totalPages = Math.ceil(totalCounts/viewPages);//获取显示的总页数

        //分页显示文章列表
        //sql:SELECT
        //t1.id AS aid,
        //    t1.title,
        //    t1.content,
        //    t1.time,
        //    t1.uid,
        //    t1.answerCount,
        //    t2.username,
        //    t2.email,
        //    t2.pic
        //FROM
        //articles t1
        //LEFT JOIN users t2 ON t1.uid = t2.id
        //ORDER BY t1.time DESC
        //limit 0,1;
        //查询数据库



        //起始条数：（当前页-1）* 每页显示数
        let offset = (currentPage -1)*viewPages

        articles.getTotalCountsByLimit(offset,viewPages,(err,Articles)=>{
            if(err) next(err);
            //console.log(Articles)
            let pager = new Pager({currentPage,totalPages,url:'/getPage'});
            moment.locale('zh-cn')
            for(var i = 0; i < Articles.length; i++) {
                 let article = Articles[i];
                 article.showTime = moment(article.time).fromNow();
            }
            res.render('index',{Articles,pager:pager,user:req.session.user})
        })


    })
};

/**
 * 根据条件查询数据库显示首页
 * @param req
 * @param res
 * @param next
 */
exports.searchArticle = (req,res,next) => {
    let totalPages = 0;
    let viewPages = 3;
    let currentPage = req.query.page||1;
    let searchStr = req.body.q || req.query.keyWord;

    //查询数据库
    articles.getTotalCountsByCondition(searchStr,(err,results) => {
        if (err) next(err);
        let totalCounts = results[0].total;
        totalPages = Math.ceil(totalCounts/viewPages);//获取显示的总页数


        //起始条数：（当前页-1）* 每页显示数
        let offset = (currentPage -1)*viewPages

        articles.getTotalCountsByLimitByCondition(searchStr,offset,viewPages,(err,Articles)=>{
            if(err) next(err);
            //console.log(Articles)
            let pager = new Pager({currentPage,totalPages,url:'/searchArticle',keyWord:searchStr});
            moment.locale('zh-cn')
            for(var i = 0; i < Articles.length; i++) {
                let article = Articles[i];
                article.showTime = moment(article.time).fromNow();
            }
            res.render('index',{Articles,pager:pager,user:req.session.user})
        })


    })
}

/**
 * 显示文章页
 * @param req
 * @param res
 * @param next
 */
exports.viewArticle = (req,res,next) => {
    let aid = req.params.aid;
    //根据aid 查找文章
    moment.locale('zh-cn')
    articles.findArticleByAid(aid,(err,result)=>{
        if(err) next(err)
        let articleData = result[0];
        articleData.showTime = moment(articleData.time).fromNow()

        //根据文章ID查询评论信息
        comments.findCommentByaid(aid,(err,comments)=>{
            if(err) next(err);
            res.render('article',{articleData,comments,user:req.session.user});
        })
    })

}
