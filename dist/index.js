"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const bodyparser_1 = __importDefault(require("@koa/bodyparser"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const app = new koa_1.default();
const router = new router_1.default();
// Middleware setup
app.use((0, bodyparser_1.default)());
app.use((0, cors_1.default)());
app.use((0, koa_logger_1.default)());
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
    }
    catch (err) {
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
exports.default = app;
//# sourceMappingURL=index.js.map