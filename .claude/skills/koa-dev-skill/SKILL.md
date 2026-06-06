---
name: koa-dev-skill
description: Koa + TypeScript 后端服务的开发规范与协作骨架。当用户请求在本项目(zt-service)中新增/修改 HTTP 接口、路由、业务逻辑、Koa 中间件,或提到"接口"、"路由"、"service"、"controller"、"handler"、"接口契约"、"加一个 API"等场景时,使用本 skill。它强制三层架构(routes / interfaces / services)、约束依赖方向、并提供自我学习机制持续沉淀经验。
metadata:
  short-description: zt-service 项目的 Koa 三层架构开发规范
---

# Koa Dev Skill (zt-service)

本 skill 服务于 zt-service 项目,目标是让任何新增/修改的 HTTP 接口都遵循"routes / interfaces / services"三层架构,降低耦合且让 service 可独立调试。

## 何时触发

- 用户请求新增、修改、删除一个 HTTP 接口或路由
- 用户提到 controller / handler / endpoint / API / 接口 等概念
- 用户要重构现有路由代码或抽取业务逻辑
- 用户要为现有功能补充单测(以 service 为单测对象)

## 核心架构(必须遵守)

```
routes      → 仅声明 path + method,转发到 interface 函数
interfaces  → 唯一接触 Koa Context,负责取参 / 调 service / 写 ctx.body
services    → 纯函数业务,入参出参均为普通对象,不依赖 Koa
```

依赖方向(单向):routes → interfaces → services,反向 import 视为违规。

为什么这样分:
- service 不依赖 Koa,可直接 ts-node 或 jest 单测,无需启动服务器
- interface 是 ctx 的唯一翻译者,后续替换传输层(改 fastify / 加 RPC)只动这一层
- route 只做装配,路径变更不影响业务代码

## 标准工作流

接到接口需求时,按下面顺序逐层创建/修改,不要跳层:

1. 先写 service(src/services/<domain>.service.ts)
   - 纯函数,入参为普通对象或基础类型
   - 出参为业务数据对象,而非 success/data 包装
   - 校验失败时 throw 一个带 .status 的 Error(由全局错误中间件兜底)
   - 在本层 export 业务相关的 TS interface(如 User、HealthInfo)

2. 再写 interface(src/interfaces/<domain>.interface.ts)
   - 唯一允许 import Context from koa 的层
   - 函数签名固定为 async (ctx: Context) => void
   - 模式:取参 → 调 service → 把结果写入 ctx.body = { success: true, data }
   - 不在此层写任何业务判断(校验也下沉到 service)

3. 最后挂路由(src/routes/<domain>.route.ts)
   - 创建独立 Router(不带 prefix)
   - 仅一行一个端点:router.<method>(path, interfaceFn)
   - 在 src/routes/index.ts 中 router.use(xxxRoute.routes(), xxxRoute.allowedMethods()) 挂载

4. 验证
   - 运行 npm run typecheck,必须通过
   - 如果用户要求,运行接口冒烟测试(curl 或一段 ts-node 调用 service)

## 命名与放置

- 文件全小写连字符,以 .service.ts / .interface.ts / .route.ts 结尾
- 一个业务域(user / order / product)= 三个文件,各一个
- service 中导出的领域类型直接在 service 文件内 export,interface 通过 import * as xxxService 间接使用

## 反模式(出现就要重构)

| 反模式 | 正确做法 |
|---|---|
| route 文件里写 async (ctx) => { ... 业务 ... } | 抽到 interface,interface 再抽到 service |
| service 里出现 ctx、koa、@koa/* import | 移到 interface |
| interface 里包装 success/data 之外的判断逻辑 | 校验/分支下沉到 service |
| 直接在 src/index.ts 写路由 | src/index.ts 是历史遗留,新接口走 src/app.ts 链路 |
| 一个 route 文件里挂多个 domain 的接口 | 按 domain 拆 *.route.ts |

## 全局约定

- 入口实际生效的是 src/app.ts + src/server.ts,通过 npm run dev 启动
- 全局 /api 前缀在 src/routes/index.ts 中统一加,domain route 不再带前缀
- 错误响应由 src/app.ts 中的错误中间件统一为 success:false + message,service 只需 throw
- 项目使用 CommonJS(tsconfig.json 的 module=commonjs,package.json 无 type:module),import 不带扩展名

## 独立调试 service 的标准方式

```
npx ts-node -e "import('./src/services/user.service').then(async s => console.log(await s.getUserById('42')))"
```

或写到 scripts/debug-<domain>.ts 中以备复用(scripts 目录非必需,按需创建)。

## 详细参考

需要时按需读取下列文件,不要全部预加载:

- 完整代码模板:references/templates.md
- 新增一个 domain 的端到端 checklist:references/add-domain-checklist.md
- 经验沉淀(必读,见下方"自我学习"):references/learnings.md

## 自我学习机制

目的:让本 skill 随项目演进持续进化,而不是写一次就僵化。

### 写入时机

每次完成下列动作之一后,主动追加一条记录到 references/learnings.md:

- 用户对你的接口实现给出明确修正(corrections)
- 用户对某个非显然的实现选择表示认可(confirmations)
- 你踩到一个项目特有的坑(例如 tsconfig/依赖/Koa 版本相关)
- 你发现一种比 SKILL.md 现有规则更优的模式

### 写入格式

在 references/learnings.md 末尾追加一条:

```
## YYYY-MM-DD 短标题

- 场景: 当时在做什么
- 结论: 应该怎么做 / 不该怎么做
- 原因: 为什么(用户反馈、踩坑细节、性能考量)
- 影响范围: 仅本次 / 所有同类接口 / 整个项目
```

日期使用绝对日期(从 user_info 推断当天日期),不要写"今天""昨天"。

### 读取与提炼

- 触发本 skill 时,先读 references/learnings.md 的最近 20 条,把适用的规则纳入当前实现
- 当某条 learning 在 3 次以上场景中重复出现,把它提炼为 SKILL.md 中的明确规则(放入"反模式"或"全局约定"),并在该条 learning 末尾标注"已上升为规则"
- 与现有规则冲突的 learning,优先采信 learning(代表用户最新偏好),同步更新 SKILL.md

### 不要写入 learnings 的内容

- 通用 Koa/TS 知识(读官方文档即可)
- 单次任务的临时上下文
- 任何敏感信息(token、密码、内网地址)

## 完成后的输出

每次帮用户实现接口,最终回复应包含:

1. 三层文件清单(services/、interfaces/、routes/ 各自路径)
2. typecheck 结果
3. 调用示例(curl 或 service 独立调试命令)
4. 如有 learning 写入,简要说明追加了什么