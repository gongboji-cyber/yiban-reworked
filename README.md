# 易伴·心迹 v0.5（测试版）

这一版不是重做前端，而是在原有 Next.js + Supabase 骨架上，把真正影响测试可用性的后端链路补齐。

## 这次重点修了什么

### 1. 继续保留 Supabase 开发方式，但建议迁到阿里云托管 Supabase
原因很简单：
- 对现有代码改动最小
- 测试期可以直接用免费版
- 国内访问比海外链路更稳，适合 5–10 个测试账号的产品验证场景

阿里云官方文档显示，Supabase 免费版提供 `1核2GB` 规格，明确仅用于开发测试。

### 2. 记录链路补完整
- 每次用户提交都会写入 `messages`
- 系统生成结果也会再写入一条 `assistant` 记录
- 会话标题与更新时间自动刷新
- 历史页可看到输入、洞察、记录草稿与风险说明

### 3. 教师导出端不再只靠“访问码”裸奔
导出接口现在要求同时满足：
- 输入正确的 `ADMIN_EXPORT_KEY`
- 当前登录用户邮箱在 `ADMIN_EMAILS` 白名单中

### 4. 导出逻辑只纳入“已授权”的风险事件
原版存在一个明显逻辑漏洞：未授权用户也会被统计进导出。现在已改为仅导出 `user_consented = true` 的事件。

### 5. 新增导出审计
- Excel 中新增 `导出审计` sheet
- 数据库新增 `admin_export_logs` 表
- 每次导出都会记录操作者、时间、统计范围与纳入数量

## 技术路线

- 前端：Next.js 14
- 认证/数据库：Supabase 兼容方案（推荐阿里云托管 Supabase）
- AI 结果：DeepSeek，可选；未配置时自动回退到 mock
- 部署：Vercel 或任意支持 Next.js 的平台

## 测试期推荐架构

### 必选
- 1 个阿里云托管 Supabase 免费测试项目
- 1 个前端部署环境（Vercel 即可）

### 够用规模
- 5–10 个测试账号
- 少量并发
- 以验证注册、记录、导出、权限控制为主

别自欺欺人地去想“以后用户很多怎么办”。你现在的问题不是扩容，而是先把一条完整链路跑通。

## 你需要配置的环境变量

复制 `.env.example` 后填写：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EXPORT_KEY`
- `ADMIN_EMAILS`
- `SCHOOL_APPOINTMENT_URL`

可选：
- `DEEPSEEK_API_KEY`

## 首次初始化步骤

### 1）创建阿里云托管 Supabase 测试项目
阿里云官方文档说明其 Supabase 支持免费版创建，适合开发测试。

### 2）执行建表 SQL
在 Supabase SQL Editor 中运行：
- `supabase/schema.sql`

### 3）配置认证
测试期建议先采用最稳的邮箱密码登录方式。
如果你不想依赖收邮件验证，就在认证配置里关闭邮箱确认；否则前端会注册成功但不能立即进入。

### 4）填写管理员邮箱白名单
例如：
- `teacher1@example.edu,teacher2@example.edu`

### 5）部署前端
本项目是标准 Next.js 项目，安装依赖后可直接运行：

```bash
npm install
npm run dev
```

## 页面路径
- 首页：`/`
- 注册登录：`/auth`
- 聊天工作台：`/chat`
- 历史记录：`/history`
- 教师导出端：`/admin/alerts`

## 关键文件说明

### 页面文案
统一在：
- `lib/content.js`

这一版我已经把大部分开发者口吻改成了用户口吻，你后续宣传语就继续在这里改，不要再把“写给你自己看的提示”塞进页面。

### 聊天与落库
- `components/ChatWorkspace.js`
- `app/api/chat/route.js`

### 导出与权限
- `app/admin/alerts/page.js`
- `app/api/export/route.js`
- `lib/authz.js`

### 表结构
- `supabase/schema.sql`

## 当前导出包含哪些内容

Excel 共 3 个 sheet：
1. `用户风险总览`
2. `风险事件明细`
3. `导出审计`

## 当前版本的边界

这仍然只是测试版，不是正式心理干预系统。
它能做的是：
- 让用户留下结构化记录
- 让管理员导出必要风险线索
- 让整个链路具备基本权限与审计

它不能做的是：
- 替代人工判断
- 自动完成正式危机干预
- 在没有合规设计的前提下无限扩大数据收集范围

## 为什么这次选阿里云，不选腾讯云 CloudBase

不是因为 CloudBase 不行，而是因为你当前代码已经深度依赖 Supabase 的 Auth + PostgREST + RLS 使用方式。继续用 Supabase 兼容方案，迁移成本最低。腾讯云 CloudBase 虽然有长期免费体验环境和身份认证能力，但那更像另一条技术路线，不适合你现在这个“前端已成型、后端尽量不推翻”的阶段。腾讯云官方文档显示，CloudBase 当前提供一个免费体验版环境，按月给 3000 点资源点。
