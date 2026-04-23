任务数据面板 (dev-2026-02)
项目概述

这是一个基于 JavaScript 的任务管理面板应用，实现前端与后端 API 的完整交互。项目包含了完整的 HTML 结构、CSS 样式和 JavaScript 功能实现，满足 dev-2026-02 题目要求。

项目结构
复制
项目根目录/
├── index.html                 # 主页面文件
├── styles/
│   └── main.css              # 样式文件
├── scripts/
│   └── main.js               # JavaScript 核心功能文件
└── README.md                 # 项目说明文档
功能特性
✅ 已实现功能

任务列表获取​ - 页面加载时自动从 API 获取任务列表

任务列表刷新​ - 点击"刷新任务"按钮重新获取数据

新增任务提交​ - 通过表单创建新任务

状态筛选功能​ - 按状态筛选任务（全部/待开始/进行中/已完成）

错误提示机制​ - 接口失败时显示友好的错误提示

🎨 界面特点

响应式布局，适配桌面和移动端

现代化的卡片式设计

清晰的状态徽章标识

友好的表单验证提示

简洁的消息反馈区域

技术实现
核心技术

HTML5​ - 语义化标签结构

CSS3​ - Flexbox 和 Grid 布局

JavaScript ES6+​ - 现代 JavaScript 语法

Fetch API​ - 异步 HTTP 请求

DOM 操作​ - 动态内容更新

API 接口

基础 URL: https://api.yangyus8.top/api

GET /tasks​ - 获取任务列表

POST /tasks​ - 创建新任务

快速开始
运行要求

现代浏览器（Chrome 80+、Firefox 75+、Safari 13.1+、Edge 80+）

网络连接（用于访问 API 接口）

运行步骤

克隆或下载项目文件

通过 HTTP 服务器运行（重要：不能直接双击打开文件）

推荐使用 VS Code 的 Live Server 扩展

使用 VS Code Live Server

安装 Live Server 扩展

右键点击 index.html文件

选择 "Open with Live Server"

浏览器会自动打开 http://localhost:5500