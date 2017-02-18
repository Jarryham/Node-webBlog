# Node-webBlog
Node progject
##Usage
	该项目需要在Node环境下运行，在Node的环境下运行指令：
`npm install`
安装完对应的依赖包后，需要有对应的数据库，本项目应用的数据库为mysql，config.js文件为数据库的配置文件；
##数据库结构表如下
-itcast
	+users
	+articles
	+comments
##项目文件说明
	common下所属文件为翻页控制器；
	controllers页面控制器存放目录；
	models页面操作数据库模块；
	public存放静态资源；
	view存放handlebar模板文件
##启动项目
	在项目目录下，命令行输入指令：
  `node app.js`
