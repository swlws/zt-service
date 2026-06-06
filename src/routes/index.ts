import Router from "@koa/router";

const router = new Router({
  prefix: "/api",
});

// 健康检查接口
router.get("/health", async (ctx) => {
  ctx.body = {
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
});

// 示例 GET 接口
router.get("/users/:id", async (ctx) => {
  const { id } = ctx.params;
  ctx.body = {
    success: true,
    data: { id, name: `User ${id}` },
  };
});

// 示例 POST 接口
router.post("/users", async (ctx) => {
  const { name, email } = ctx.request.body as any;

  // 简单验证
  if (!name || !email) {
    ctx.throw(400, "Name and email are required");
  }

  ctx.body = {
    success: true,
    data: { id: Math.random().toString(36), name, email },
  };
});

export default router;
