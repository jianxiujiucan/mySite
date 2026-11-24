# admin · 内容管理后台

独立运行的 Vue 3 + TypeScript 管理应用，与 `web` 前台不共享路由和入口。

- `src/views/AdminLoginView.vue`：登录页。
- `src/views/AdminLayout.vue`：后台导航与页面框架。
- `src/views/*Admin.vue`：简介、项目、摄影、书法管理。
- `src/components/ImageField.vue`：本地图片上传、外链输入与预览。
- `src/api.ts`：登录状态、鉴权请求和上传。
- `src/router.ts`：后台路由及登录守卫。

```bash
npm run dev:admin
npm run build:admin
```

开发地址：`http://localhost:5174/admin`，构建输出：`admin/dist/`。生产环境由 Express 托管在 `/admin`。
