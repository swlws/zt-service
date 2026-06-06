# 新增一个 domain 的 Checklist

参照本清单从零加一个 HTTP 接口域(以 `order` 为例),逐项打勾。

## 0. 准备

- [ ] 已读 `references/learnings.md` 最近 20 条,已识别相关约束
- [ ] 与用户确认接口契约:HTTP 方法 / 路径 / 入参 / 出参 / 错误场景

## 1. service 层

- [ ] 创建 `src/services/order.service.ts`
- [ ] export 领域类型(`Order`、相关 DTO)
- [ ] 实现纯函数:入参普通对象 / 出参业务对象
- [ ] 入参校验失败抛 `Error` 并设置 `.status`(400/404/...)
- [ ] 文件中不出现 `koa`、`@koa/*`、`ctx` 字样

## 2. interface 层

- [ ] 创建 `src/interfaces/order.interface.ts`
- [ ] `import { Context } from "koa"`
- [ ] 每个端点一个 `async (ctx: Context) => void`
- [ ] 仅包含三步:取参 / 调 service / 写 `ctx.body = { success: true, data }`
- [ ] 不出现 `if/else` 业务分支,不做数据加工

## 3. route 层

- [ ] 创建 `src/routes/order.route.ts`
- [ ] `new Router()` 不带 prefix
- [ ] 一行一个端点,handler 直接指向 interface 函数
- [ ] export default router

## 4. 挂载

- [ ] 在 `src/routes/index.ts` 中 import 新 route
- [ ] `router.use(orderRoute.routes(), orderRoute.allowedMethods())`

## 5. 验证

- [ ] `npm run typecheck` 通过
- [ ] service 独立调用一次:
  ```
  npx ts-node -e "import('./src/services/order.service').then(async s=> console.log(await s.getById('1')))"
  ```
- [ ] 如用户要求,启动 `npm run dev`,curl 真实请求路径

## 6. 学习沉淀

- [ ] 本次实现是否有非显然选择 / 用户修正 / 项目特有坑?
  - 是 → 在 `references/learnings.md` 末尾追加一条
  - 否 → 跳过
- [ ] 检查最近的 learning 是否有重复 3 次以上的模式
  - 是 → 提炼到 SKILL.md 的"反模式"或"全局约定",并在原 learning 标记"已上升为规则"

## 7. 输出汇报

- [ ] 列出三层文件路径
- [ ] 贴 typecheck 结果
- [ ] 给出一条 curl 或 service 调试命令
- [ ] 说明本次是否追加了 learning