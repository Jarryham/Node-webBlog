/**
 * Created by Administrator on 2017/2/6.
 */
'use strict';
let User=require('../models/userDb');
const utils = require('utility');
//引入表单提交数据处理文件
const formidable = require('formidable')

/**
 * 查找用户
 * @param req
 * @param res
 * @param next
 */
exports.showIndex = function(req,res,next){
    //User.findUserByUsername('小乔',(err,users)=>{
    //    if(err) next(err);
    //    //console.log(users)
    //    res.render('index');
    //});
    let user = req.session.user;
    res.render('index',{user})
};

/**
 * 显示注册页面
 * @param req
 * @param res
 * @param next
 */
exports.showRegister = function(req,res,next){
    res.render('register')
};

/**
 * 处理注册提交数据
 * @param req
 * @param res
 * @param next
 */

exports.doRegister = function(req,res,next){
    //获取req的参数
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let vcode = req.body.vcode;
    //console.log(username)
    //根据用户名查询数据库是否重名
    User.findUserByUsername(username,(err,result)=>{
        //console.log(result)//result 如果不重名，返回一个空数组
        if(err) next(err);
        if(result.length != 0){
            //重定向至注册页，告知用户用户名重名
           return res.render('register',{msg:'用户名已被注册'})
        }
        if(vcode != req.session.vcode){
            return res.render('register',{msg:'验证码输入错误'})
        }
        //不重名的情况下注册成功，获取用户数据插入数据库，跳转激活页面
        //加密密码
        password = utils.md5(utils.md5(password));
        //保存数据到数据库
        User.saveData({username,password,email},(err,result)=>{
            //console.log(result);
            //重定向至激活页面
            let token = utils.md5(utils.md5('_itcast'+username+'_itcast'));
            let href = '/active?username='+username+'&token='+token;
            return res.render('showNotice',{msg:`敬爱的${username},您好！您已成功注册，请点击下方链接激活`,info:'点击此处激活',href})
        });
    });
};

/**
 * 处理激活链接
 * @param req
 * @param res
 * @param next
 */
exports.doActive = (req,res,next)=>{
    //获取url的username；根据username修改数据库的active_flag
    let username = req.query.username;
    let token = req.query.token;
    //比较激活码
    let veriToken = utils.md5(utils.md5('_itcast'+username+'_itcast'));
    //不同提示非法注册，返回注册页
    if(token != veriToken){
        return res.render('showNotice',{msg:'非法注册',info:'点击重新注册',href:'/register'})
    };
    //注册成功，修改账号激活状态
    //
    User.updateActive(username,(err,result)=>{
        if (err) next(err);
        return res.render('login')
    })
};

/**
 * 处理登录页面
 * @param req
 * @param res
 * @param next
 */
exports.doLogin = (req,res,next)=>{
    //获取提交数据
    let username = req.body.username;
    let password = req.body.password;
    let remeber_me =  req.body.remember_me;
    let vcode = req.body.vcode;

    //根据用户名查找数据库对应数据
    User.findUserByUsername(username,(err,result)=>{
        if(err) next(err);
        //console.log(result)
        //
        if(result.length===0){
            //返回长度为0，不存在用户，提醒用户msg:用户不存在
            return res.render('login',{msg:'该用户不存在'})
        }
        //用户未激活，提醒用户到邮箱激活账户；
        if(result[0].active_flag != 1){
            return res.render('showNotice',{msg:`亲您还未激活，请到${result[0].email}邮箱进行激活`})
        }
        //判断密码是否正确，对输入的密码进行二次加密后比对数据库数据
        let newpassword = utils.md5(utils.md5(password));
        if(newpassword != result[0].password && password != result[0].password){
            return res.render('login',{msg:'密码输入错误'})
        };
        //判断验证码是否匹配


        req.session.user = result[0]//存储session
        let user = result[0];
        let maxAge = -1 //情况cookie
        if(remeber_me === 'on'){
            maxAge = 1000 * 60 * 60 * 24 * 7;//记住我一周
        }
        let cookieOptions = {
            domain: '127.0.0.1',
            path: '/',
            maxAge
        };
        res.cookie('username',result[0].username,cookieOptions);
        res.cookie('password',result[0].password,cookieOptions)
        res.cookie('remember_me',remeber_me,cookieOptions)

        res.redirect('/')
    })



};

/**
 * 显示登录页面
 * @param req
 * @param res
 * @param next
 */
exports.showLogin = (req,res,next) => {

    let loginObj ={};
    if(typeof req.cookies.remember_me != 'undefined'){
        loginObj.username = req.cookies.username;
        loginObj.password = req.cookies.password;
        loginObj.remember_me = req.cookies.remember_me;
        if(loginObj.remember_me === 'on') loginObj.checked = 'checked';
    }
    res.render('login',loginObj)
}

exports.loginOut = (req,res,next) => {
    req.session.user = null;
    res.render('logout')
}

/**
 * 处理验证码请求
 * @param req
 * @param res
 * @param next
 */
exports.getVcodePic = (req,res,next)=>{
    let returnObj = require('../common/getPic').getPic();
    req.session.vcode = returnObj.text;
    res.send(returnObj.buf);

}
/**
 * 显示设置页
 * @param req
 * @param res
 * @param next
 */
exports.showSetting = (req,res,next) =>{
    let user =req.session.user
    res.render('setting',{user})
}

/**
 * 处理图片上传
 * @param req
 * @param res
 * @param next
 */
exports.uploadImg = (req,res,next) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = './public/img';
    form.parse(req,function(err,fields,files){
        //console.log(files)
        if(err) next(err);
        return res.send('/'+files.pic.path)
    })
}
/**
 * 保存设置的信息
 * @param req
 * @param res
 * @param next
 */
exports.doSettings = (req,res,next) => {
    //获取提交上来的数据
    let picPath = req.body.picpath;
    let userId = req.body.userid;
    //写入数据
    User.updateInfoById(picPath,userId,(err,result) => {
        if(err) next(err);

        req.session.user.pic = picPath
        res.redirect('/')
    })
}