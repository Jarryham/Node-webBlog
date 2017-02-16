/**
 * Created by Administrator on 2017/2/6.
 */
'use strict';
const db=require('../db');
/**
 *根据用户名查找用户
 * @param username
 * @param callback
 */
exports.findUserByUsername = function (username,callback){
    db.query('select * from users where username= ?',[username],callback)
}
/**
 * 存储用户数据
 * @param userData
 * @param callback
 */
exports.saveData = function(userData,callback){
    db.query('insert into users (username,password,email) values (?,?,?)',[userData.username,userData.password,userData.email],callback)
}

/**
 * 修改激活状态
 * @param username
 * @param callback
 */
exports.updateActive = (username,callback)=>{
    db.query('update users set active_flag = 1 where username = ?',[username],callback)
};

exports.updateInfoById = (picPath,userId,callback) => {
    db.query('update users set pic = ? where id = ?',[picPath,userId],callback)
}