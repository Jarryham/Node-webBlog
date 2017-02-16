/**
 * Created by Administrator on 2017/2/5.
 */
const express = require('express');
let user=require('./controllers/findUser');
//引入文章控制器
let articleCtrl =require('./controllers/articleControllers');
//引入评论控制器
let commentCtrl = require('./controllers/commentCtrl')
let web_router=express.Router();

//主页显示
web_router//.get('/',user.showIndex)//显示首页第一版
            .get('/',articleCtrl.getPage)
            .get('/register',user.showRegister)
            .post('/doRegister',user.doRegister)
            .get('/active',user.doActive)
            .get('/login',user.showLogin)
            .post('/login',user.doLogin)
            .get('/logout',user.loginOut)
            .get('/getPic',user.getVcodePic)
            .get('/showSetting',user.showSetting)
            .post('/upload',user.uploadImg)//上传数据，服务器会回传图片地址
            .post('/doSettings',user.doSettings)
            .get('/publishArticle',articleCtrl.publishArticle)//显示发表文章页面
            .post('/publish/article',articleCtrl.saveArticle)//保存发表文章
            .get('/getPage',articleCtrl.getPage)//分页效果
            .post('/searchArticle',articleCtrl.searchArticle)//提交查询并显示查询结果
            .get('/searchArticle',articleCtrl.searchArticle)//查询分页效果
            .get('/viewArticle/:aid',articleCtrl.viewArticle)//显示文章页
            .post('/sendComment',commentCtrl.sendComment)

module.exports= web_router