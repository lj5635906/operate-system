# operate-system #
基于Vue.js 2.x系列 + Element UI 的后台管理系统解决方案。[模板地址](https://www.github.com/lin-xin/vue-manage-system)


## 目录结构介绍 ##

	|-- build                            // webpack配置文件
	|-- config                           // 项目打包路径
	|-- src                              // 源码目录
	|   |-- components                   // 组件
	|       |-- common                   // 公共组件
	|           |-- bus.js           	 // Event Bus
	|           |-- Header.vue           // 公共头部
	|           |-- Home.vue           	 // 公共路由入口
	|           |-- Sidebar.vue          // 公共左边栏
	|           |-- Tags.vue           	 // 页面切换标签组件
	|       |-- page                   	 // 主要路由页面
	|           |-- 403.vue
	|           |-- 404.vue
	|           |-- DashBoard.vue        // 系统首页
	|           |-- Eureka.vue           // 注册中心
	|           |-- Login.vue          	 // 登录
	|           |-- SysManageAdmin.vue         // 用户管理
	|           |-- SysManageMenu.vue       // 菜单管理
	|           |-- SysManageRole.vue           // 角色管理
	|           |-- Zipkin.vue           // 链路追踪
	|   |-- App.vue                      // 页面入口文件
	|   |-- main.js                      // 程序入口文件，加载各种公共组件
	|-- .babelrc                         // ES6语法编译配置
	|-- .editorconfig                    // 代码编写规格
	|-- .gitignore                       // 忽略的文件
	|-- index.html                       // 入口html文件
	|-- package.json                     // 项目及工具的依赖配置文件
	|-- README.md                        // 说明


## 安装步骤 ##

	git clone https://github.com/lj5635906/operate-system.git      // 把模板下载到本地
	cd operate-system    // 进入模板目录
	npm install         // 安装项目依赖，等待安装完成之后

## 本地开发 ##

	// 开启服务器，浏览器访问 http://localhost:8080
	npm run dev

## 构建生产 ##

	// 执行构建命令，生成的dist文件夹放在服务器下即可访问
	npm run build



 ### UI截图

 <table>
     <tr>
         <td><img src="https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/9f92fd5340b915bd52f04ba0b0af5d4f50fc7cfe5bef15bec90358a8f0e987175ebf78c46f040d7827a3278c12d4bfba?pictype=scale&from=30113&version=3.3.3.3&uin=190642964&fname=4SZ_H%4035%28%40YP%28OQKJHUPD_Y.jpg&size=750"/></td>
         <td><img src="https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/725f3c483a4f69bf6f648776b881ed685b9e9b7eff823d43124a24914dc5f4d85b1cdfe2ef7830f5c2875fefe2686674?pictype=scale&from=30113&version=3.3.3.3&uin=190642964&fname=%28TH%24G%29_SV%7DT3G%29PF%298%24W9CU.jpg&size=750"/></td>
     </tr>
     <tr>
          <td><img src="https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/89d71abb973a809d050a2ed9e9de13eedc04d81972288f0bc9d4f179527173b0fd91b6821ca441c935f860ee41ec7c66?pictype=scale&from=30113&version=3.3.3.3&uin=190642964&fname=%5D%24OPZ6%29HXD99%25%7B%6063X%60H%248Q.jpg&size=750"/></td>
          <td><img src="https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/2b0e366fcd7302447ba9ee3fe07aaad8abb361955fd7aeb206fe2ef7572b36cfa57b3378e4db80bfc5dc82ce92872b6f?pictype=scale&from=30113&version=3.3.3.3&uin=190642964&fname=%24Q49DYA69J5RMTU%60X8%608L79.jpg&size=750"/></td>
     </tr>
     <tr>
           <td><img src="https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/c90334864e32cb2b63441a99b9568c5bf434fec970d0ab437ba30939fcd8fa1afa4e655b2a54ab597f8278affc248820?pictype=scale&from=30113&version=3.3.3.3&uin=190642964&fname=~%7B%25%7DR%7B9%60WE_%7DN%60O%5D%25A%5BS%2924.jpg&size=750"/></td>
           <td><img src="https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/313b2c5f50be650656751740f57685c5515ca8fd0991c8edbf9df80ab87e43fbb2c301e2ded2a7968995a1b11602406f?pictype=scale&from=30113&version=3.3.3.3&uin=190642964&fname=63%24_WLZFVEPNG2S7MGYL%289I.jpg&size=750"/></td>
     </tr>
 </table>
