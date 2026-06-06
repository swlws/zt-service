/**
 * User Service
 *
 * 纯业务逻辑,入参/出参均为普通对象,不依赖 Koa。
 * 可被 interfaces 调用,也可用 ts-node / jest 独立调试。
 */

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface HealthInfo {
  timestamp: string;
  uptime: number;
}

/**
 * 根据 id 查询用户
 */
export async function getUserById(id: string): Promise<User> {
  return { id, name: `User ${id}` };
}

/**
 * 创建用户
 * @throws 入参缺失时抛出 status=400 的错误
 */
export async function createUser(input: {
  name: string;
  email: string;
}): Promise<User> {
  if (!input?.name || !input?.email) {
    const err: any = new Error("Name and email are required");
    err.status = 400;
    throw err;
  }

  return {
    id: Math.random().toString(36).slice(2),
    name: input.name,
    email: input.email,
  };
}

/**
 * 健康检查信息
 */
export async function getHealth(): Promise<HealthInfo> {
  return {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}