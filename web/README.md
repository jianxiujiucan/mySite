# web · 前台应用

面向访客的 Vue 3 + TypeScript 应用。

- `src/views/`：首页、简介、项目、摄影、书法及详情页面。
- `src/components/`：页头、页脚、标题和图片灯箱。
- `src/services/api.ts`：前台读取 API，API 不可用时使用 `shared/content.ts` 中的演示内容。
- `public/images/`：项目本地图片资源。
- `vite.config.ts`：3002 端口、API/上传代理，以及 `/admin` 到独立后台的跳转。

```bash
npm run dev:web
npm run build:web
```

开发地址：`http://localhost:3002`，构建输出：`web/dist/`。
