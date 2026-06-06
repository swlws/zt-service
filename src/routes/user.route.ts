/**
 * User Route
 *
 * 仅声明 path + method,转发到对应的 interface 函数。
 * 不包含任何业务或参数解析逻辑。
 */
import Router from "@koa/router";
import * as userInterface from "../interfaces/user.interface";

const router = new Router();

router.get("/health", userInterface.getHealth);
router.get("/users/:id", userInterface.getUserById);
router.post("/users", userInterface.createUser);

export default router;