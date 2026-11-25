# 静听风声 · 个人网站

根据 Penpot 第三稿实现的完整个人网站。视觉采用米白、墨黑、浅灰与少量朱红，首页保留头像、名字和四个内容入口。

## 目录结构

```text
mySite/
├─ web/                 # 面向访客的前台 Vue 应用，开发端口 3002
│  ├─ src/views/        # 首页、简介、项目、摄影、书法页面
│  ├─ src/components/   # 前台组件与图片灯箱
│  ├─ src/services/     # 前台 API 读取与本地降级
│  └─ public/           # 前台图片和静态资源
├─ admin/               # 独立后台 Vue 应用，开发端口 5174
│  ├─ src/views/        # 登录和四类内容管理页面
│  ├─ src/components/   # 图片上传与外链字段
│  └─ src/api.ts        # 后台鉴权与 CRUD 请求
├─ server/              # Express API、MySQL、鉴权和上传
├─ shared/              # 共用内容、TypeScript 类型和基础样式
├─ scripts/             # 媒体资源生成与下载脚本
└─ tests/               # 前台与后台 Playwright 测试
```

`web`、`admin` 和 `server` 可以分别维护；跨端共享的内容只放在 `shared`。两个前端共用根目录的依赖与构建命令。

## 技术栈

- Vue 3、TypeScript、Vite
- SASS，颜色统一使用 `:root` 中的 CSS 原生变量
- Vue Router，包含首页、简介、项目、项目详情、摄影、相册详情、书法和 404 页面
- Node.js、Express、MySQL（mysql2）、Sharp 图片处理
- Playwright 浏览器测试

## 内容管理后台

后台地址：`http://localhost:5174/admin`（`http://localhost:3002/admin` 会自动跳转到这里）

- 简介：名字、英文名字、头像和分段简介。
- 项目：封面、摘要、详情、特点、关联链接，支持新增、编辑和删除。
- 摄影：相册标题、副标题、详情，以及逐张照片的图片、标题、无障碍描述和详情。
- 书法：作品图片、标题、显示比例和详情，支持新增、编辑和删除。

图片字段支持本地上传和 `http(s)` 外链。上传图片保存在 `uploads/`，支持 JPG、PNG、WebP、GIF、AVIF，单张最大 8MB。上传文件需要随项目一起备份。

摄影图片上传成功后会同时生成 640×640 的 WebP 缩略图。相册封面和照片列表使用缩略图，灯箱继续使用原图。摄影、书法和项目列表图片使用原生懒加载与异步解码。

后台账号和密码由 `.env` 中的 `ADMIN_USERNAME`、`ADMIN_PASSWORD` 设置。当前本地账号为 `admin`，密码请查看本地 `.env`。登录会话保存在内存中，有效期 12 小时；重启 API 后需要重新登录。

前台代码位于 `web/src/`，后台代码独立放在 `admin/src/`；后台 API 位于 `server/admin.ts`，上传与登录逻辑分别位于 `server/uploads.ts` 和 `server/auth.ts`。

## 本地运行

```bash
npm install
npm run dev
```

也可以分别启动：

```bash
npm run dev:web
npm run dev:admin
npm run dev:server
```

打开前台 `http://localhost:3002` 或后台 `http://localhost:5174/admin`。API 默认位于 `http://localhost:3001`，两个 Vite 应用均已配置 `/api` 和 `/uploads` 代理。

未配置 MySQL 时，API 和前端会使用 `shared/content.ts` 中的演示内容，便于直接预览完整交互。

## 初始化 MySQL

1. 复制 `.env.example` 为 `.env`，填写 MySQL 账号与密码。
2. 确保 MySQL 服务已启动。
3. 执行：

```bash
npm run db:setup
```

脚本会创建 `mysite` 数据库、数据表，并写入缺失的演示内容。重复执行会补齐新增字段，但不会覆盖后台已经编辑的内容，也不会清空已有数据。

表结构位于 `server/schema.sql`，接口位于 `server/index.ts`。

## 构建与测试

```bash
npm run build
npm test
```

生产构建分别输出到 `web/dist/` 和 `admin/dist/`。执行 `npm start` 后，Express 会同时提供 API、前台页面和 `/admin` 后台页面。

测试使用本机 Chrome。运行前请先启动 `npm run dev`。

后台测试会在 MySQL 中创建并删除带 `test-` 前缀的临时项目、相册和书法作品，用于验证真实新增、外链、本地上传与删除流程。

需要为内置照片或历史上传图片补齐缩略图时执行：

```bash
npm run thumbs:generate
```

## 内容维护

- 演示内容：`shared/content.ts`
- 首页矢量资源：`web/public/images/home/`
- 项目封面：`web/public/images/projects/`
- 摄影图片：`web/public/images/photos/`
- 书法示范字稿：`web/public/images/calligraphy/`

摄影图片为 Unsplash 的版式演示素材，不代表站主拍摄作品。书法图片为项目生成的示范字稿。正式上线前请替换为个人内容。

## 响应式实现

桌面首页使用四列小卡片与较大间距。移动端布局使用 `vw` 控制边距、卡片间距和弹性尺寸，文字与控件使用 `rem`，首页为 2×2 卡片，相册和书法页根据屏幕调整列数。

图片灯箱支持前后切换、循环浏览、Escape 关闭、左右方向键切换和基本焦点管理。
