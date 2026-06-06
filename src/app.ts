import Koa from "koa";
import bodyParser from "koa-bodyparser";
import router from "./routes/index";

const app = new Koa();

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message || "Internal Server Error",
    };
    console.error("Error:", err);
  }
});

// 请求日志中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 解析请求体
app.use(bodyParser());

// 注册路由
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
