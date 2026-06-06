import Koa from "koa";
import Router from "@koa/router";
import bodyparser from "@koa/bodyparser";
import cors from "@koa/cors";
import logger from "koa-logger";

const app = new Koa();
const router = new Router();

// Middleware setup
app.use(bodyparser());
app.use(cors());
app.use(logger());

// Router configuration
router.get("/api/health", (ctx) => {
  ctx.body = { status: "ok" };
});

router.get("/api/time", (ctx) => {
  ctx.body = { timestamp: new Date().toISOString() };
});

// Error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
