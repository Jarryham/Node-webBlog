/**
 * Created by Administrator on 2017/2/6.
 */
'use strict';
const mysql=require('mysql');
const config = require('./config');
let db={};
let pool  = mysql.createPool({
    connectionLimit : config.connectionLimit,
    host            : config.host,
    user            : config.user,
    password        : config.password,
    database        : config.database
});

db.query=function(sql,param,callback){
    pool.query(sql,param,(err,results,fields)=>{
        callback(err,results)
    })
}

module.exports = db;