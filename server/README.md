# server · API 与数据服务

- `index.ts`：公开读取接口，以及前台和后台的生产静态托管。
- `admin.ts`：后台内容 CRUD 与上传接口。
- `auth.ts`：管理员登录和内存会话。
- `uploads.ts`：图片格式、大小与本地保存规则。
- `thumbnails.ts`：WebP 缩略图生成与已有缩略图查找。
- `db.ts`：MySQL 连接池和读取降级。
- `schema.sql`：数据库表结构。
- `setup.ts`：幂等初始化、字段迁移和演示数据导入。

```bash
npm run db:setup
npm run dev:server
```

API 地址：`http://localhost:3001/api`。数据库配置见根目录 `.env`，上传文件保存在根目录 `uploads/`。

批量补齐现有图片缩略图：`npm run thumbs:generate`。
