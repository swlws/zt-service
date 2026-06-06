/**
 * Routes 聚合入口
 *
 * 统一挂载全局 /api 前缀,并合并各业务路由。
 * 新增业务路由时,在此处 import + use 即可。
 */
import Router from "@koa/router";
import userRoute from "./user.route";

const router = new Router({
  prefix: "/api",
});

router.use(userRoute.routes(), userRoute.allowedMethods());

export default router;