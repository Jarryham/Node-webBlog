/**
 * Created by Administrator on 2017/2/5.
 */
'use strict';

const express = require('express');
//获取服务器对象
const app = express();
//设置路由
const web_route = require('./web_router');
var exphbs  = require('express-handlebars');

//session配置
const session = require('express-session');
//cookie解析配置
const cookieParser = require('cookie-parser')

//获取post请求的参数
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
//handlebars引用
app.engine('.hbs', exphbs({defaultLayout: 'layout',extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(session({
    secret: 'myBlog',
    resave: false,
    saveUninitialized: true
}))

app.use(cookieParser())
app.use(web_route);
//处理静态资源
app.use('/public',express.static('public'));
//配置错误处理中间件
app.use((err, req, res, next) => {
    console.log('出异常了' + err.stack);
});
//服务器启动
app.listen(80,'127.0.0.1',()=>{
    console.log('服务器启动了')
})