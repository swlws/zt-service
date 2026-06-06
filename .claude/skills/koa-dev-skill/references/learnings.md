# Learnings (zt-service)

按时间正序追加,每条记录代表一次从实战中沉淀的经验。

格式见 SKILL.md 中"自我学习机制"小节。

---

## 2026-06-06 三层架构初始落地

- 场景: 用户要求把原本耦合在 routes 里的业务逻辑解耦
- 结论: 采用 routes / interfaces / services 三层,service 不依赖 Koa 以便独立调试
- 原因: 用户明确否决了更复杂的 contracts/adapter 抽象,偏好"轻量、直链、可独立调试"
- 影响范围: 整个项目所有 HTTP 接口

## 2026-06-06 移除 type:module 修复 ESM/CJS 冲突

- 场景: nodemon 启动报 ERR_MODULE_NOT_FOUND,提示找不到 ./app
- 结论: 项目 import 不写扩展名,tsconfig module=commonjs,因此 package.json 必须不含 "type": "module"
- 原因: ESM 模式下 Node 强制要求 import 路径带扩展名,与现有源码风格冲突
- 影响范围: 整个项目;新建文件继续使用 CommonJS 风格 import,不要加 .js 后缀

## 2026-06-06 @unrs/resolver-binding-wasm32-wasi 版本固定

- 场景: 安装依赖时被要求选择 wasm 回退版本
- 结论: 在 package.json 的 overrides 中固定为 1.12.2(latest)
- 原因: macOS 应跑原生 binding,出现 wasm 选择提示通常是依赖解析异常;锁定避免后续每次安装重复弹窗
- 影响范围: 仅依赖管理,不影响代码

<!-- 在这里继续追加新的 learning -->