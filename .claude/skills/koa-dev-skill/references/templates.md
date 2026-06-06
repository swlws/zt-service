# 代码模板

将 `<Domain>` 替换为业务域大驼峰,`<domain>` 替换为小写连字符。

## services/<domain>.service.ts

```ts
/**
 * <Domain> Service
 *
 * 纯业务逻辑,入参/出参均为普通对象,不依赖 Koa。
 * 可被 interfaces 调用,也可用 ts-node / jest 独立调试。
 */

export interface <Domain> {
  id: string;
  // ... 领域字段
}

/**
 * 业务方法示例
 * @throws 入参非法时抛 status=400 的 Error
 */
export async function getById(id: string): Promise<<Domain>> {
  if (!id) {
    const err: any = new Error("id is required");
    err.status = 400;
    throw err;
  }
  // ... 业务逻辑
  return { id };
}
```

要点:
- 不 import 任何 koa 相关
- throw 的 Error 带 `.status` 由全局错误中间件兜底
- 出参直接是业务对象,不要 `{ success, data }` 包装

## interfaces/<domain>.interface.ts

```ts
/**
 * <Domain> Interface
 *
 * 唯一接触 Koa Context 的层:
 *   1. 从 ctx 中解析参数(params / query / body)
 *   2. 调用 service 执行业务
 *   3. 将结果写回 ctx.body
 */
import { Context } from "koa";
import * as <domain>Service from "../services/<domain>.service";

export async function getById(ctx: Context) {
  const { id } = ctx.params as { id: string };
  const data = await <domain>Service.getById(id);
  ctx.body = { success: true, data };
}

export async function create(ctx: Context) {
  const body = (ctx.request as any).body as { /* ... */ };
  const data = await <domain>Service.create(body);
  ctx.body = { success: true, data };
}
```

要点:
- 函数签名固定 `async (ctx: Context) => void`
- 取参 → 调 service → 写 ctx.body,三步内完成
- 不做业务判断、不组织数据(组织数据是 service 的事)

## routes/<domain>.route.ts

```ts
/**
 * <Domain> Route
 *
 * 仅声明 path + method,转发到对应的 interface 函数。
 */
import Router from "@koa/router";
import * as <domain>Interface from "../interfaces/<domain>.interface";

const router = new Router();

router.get("/<domain>s/:id", <domain>Interface.getById);
router.post("/<domain>s", <domain>Interface.create);

export default router;
```

要点:
- 不带 prefix,prefix 在 routes/index.ts 统一加
- 一行一个端点
- 没有任何 inline handler

## routes/index.ts 挂载新 route

```ts
import Router from "@koa/router";
import userRoute from "./user.route";
import <domain>Route from "./<domain>.route";  // 新增

const router = new Router({ prefix: "/api" });

router.use(userRoute.routes(), userRoute.allowedMethods());
router.use(<domain>Route.routes(), <domain>Route.allowedMethods());  // 新增

export default router;
```