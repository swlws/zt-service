/**
 * User Interface
 *
 * 唯一接触 Koa Context 的层:
 *   1. 从 ctx 中解析参数(params / query / body)
 *   2. 调用 service 执行业务
 *   3. 将结果写回 ctx.body
 */
import { Context } from "koa";
import * as userService from "../services/user.service";

/**
 * GET /users/:id
 */
export async function getUserById(ctx: Context) {
  const { id } = ctx.params as { id: string };
  const data = await userService.getUserById(id);
  ctx.body = { success: true, data };
}

/**
 * POST /users
 */
export async function createUser(ctx: Context) {
  const body = (ctx.request as any).body as { name: string; email: string };
  const data = await userService.createUser(body);
  ctx.body = { success: true, data };
}

/**
 *GET /health
 */
export async function getHealth(ctx: Context) {
  const data = await userService.getHealth();
  ctx.body = {
    success: true,
    ...data,
  };
}