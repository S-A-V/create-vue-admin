# way-admin

way-admin 是一个后台管理系统的前端解决方案，基于 Vue 3、Element Plus 实现。

## 准备工作

- Node >= 18
- Git

## 文件结构

```text
├── bin                        // 执行脚本
├── public                     // 公共文件
│   ├── logo.svg               // 浏览器标签图标
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题、字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── layout                 // 布局
│   ├── plugins                // 通用方法
│   ├── router                 // 路由
│   ├── store                  // 全局 store 管理
│   ├── utils                  // 全局公用方法
│   ├── views                  // 所有页面
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口、加载组件、初始化等
│   ├── permission.js          // 权限管理
│   └── settings.js            // 系统配置
├── .editorconfig              // 编码格式
├── .env.development           // 开发环境配置
├── .env.production            // 生产环境配置
├── .env.staging               // 测试环境配置
├── .eslintignore              // 忽略语法检查
├── .eslintrc.js               // eslint 配置项
├── .gitignore                 // git 忽略项
├── index.html                 // html 模板
├── package.json               // package.json
└── vite.config.js             // vite 配置文件
```

## 运行

```bash
# 进入项目文件夹
cd way-admin

# 安装依赖
pnpm install

# 启动服务
pnpm run dev

# 打包正式环境
pnpm run build
```
