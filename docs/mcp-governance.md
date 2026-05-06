# 组件库主题解耦系统与 AI Agent MCP 服务技术方案

## 目标

Nimbus UI 作为企业级基础组件库，除了提供 Button、Input、Select、Modal、Table、Upload 等组件，还需要长期维护组件规范、设计 Token、文档和测试质量。

本方案的目标是基于 MCP（Model Context Protocol）设计一套组件治理体系，让规范不只停留在文档中，而是可以被工具读取、分析和执行，形成：

```text
组件源码 -> AST 解析 -> 结构化 Schema -> AI Agent 分析 -> 修复建议/补丁 -> CI 校验
```

## 背景问题

### 1. 组件规范容易失控

- Props 命名不统一，例如 `value`、`checked`、`open`、`visible` 混用。
- 事件命名风格不一致，例如 `onChange` 和 `change` 混用。
- 受控与非受控组件接口缺少统一约定。

### 2. 设计 Token 难以落地

- 样式中存在硬编码颜色、间距、字号。
- Token 定义和实际消费不一致。
- 暗黑模式、品牌换肤、主题扩展成本高。

### 3. 工程治理依赖人工

- 文档可能滞后于组件实现。
- Code Review 主要依赖人工经验，无法规模化。
- 历史组件难以批量分析和分阶段治理。

## 核心思路

通过 MCP 把组件规范变成可执行能力：

| 能力 | 作用 |
| --- | --- |
| Tool | 解析组件源码、抽取 Props、事件、样式 Token 使用情况 |
| Prompt | 表达组件规范、命名规范、Token 使用规范 |
| 结构化文档 | 提供组件 Schema、Token Registry、规则说明等上下文 |

MCP Server 不直接替代 ESLint，而是补足 ESLint 难以表达的语义治理能力。例如：判断一个颜色硬编码是否应该替换为语义 Token，或者某个组件 Props 命名是否符合组件库统一心智。

## 系统架构

```text
packages/nimbus-ui/src
        |
        v
Component Parser Tool
  - @babel/parser
  - ts-morph
  - Less/CSS scanner
        |
        v
Structured Context
  - component.schema.json
  - token.registry.json
  - rules.md
        |
        v
MCP Server
  - analyze_component
  - analyze_tokens
  - suggest_fix
  - generate_docs
        |
        v
AI Agent / CI
  - PR comment
  - quality report
  - optional patch
  - CI blocking
```

## Tool 层设计

### analyze_component

输入组件路径，输出组件结构化信息。

```json
{
  "component": "Button",
  "props": [
    {
      "name": "type",
      "type": "'primary' | 'default' | 'dashed' | 'text' | 'link'",
      "required": false,
      "defaultValue": "default"
    }
  ],
  "events": ["onClick"],
  "hasTest": true,
  "hasStory": true
}
```

可分析内容：

- Props 类型、默认值、是否必填。
- 事件回调命名。
- 是否存在 demo、Storybook stories、单元测试。
- 是否使用 `forwardRef`、受控/非受控模式等组件库常见约定。

### analyze_tokens

扫描组件样式文件，输出 Token 使用报告。

```json
{
  "component": "Button",
  "styleFile": "packages/nimbus-ui/src/button/style/index.less",
  "hardcodedValues": [
    {
      "value": "#3a7bf7",
      "type": "color",
      "suggestion": "@nimbus-color-primary"
    }
  ],
  "usedTokens": ["@nimbus-color-primary", "@nimbus-radius-base"]
}
```

检测策略：

- 颜色：匹配 hex、rgb、rgba、hsl。
- 间距：匹配常见 px 值。
- 字号：匹配 font-size 中的硬编码值。
- 合法性：和 Token Registry 对比，识别非法 Token。

### suggest_fix

基于 Tool 输出和 Prompt 规则生成修复建议，必要时生成 patch。

示例输出：

```json
{
  "level": "warn",
  "message": "Button 使用硬编码主色，建议替换为语义 Token。",
  "file": "packages/nimbus-ui/src/button/style/index.less",
  "patch": "- color: #3a7bf7;\n+ color: @nimbus-color-primary;"
}
```

## 结构化文档设计

### 组件 Schema

组件 Schema 记录组件的稳定接口，作为 AI Agent 和 CI 的判断依据。

```json
{
  "Button": {
    "category": "General",
    "controlled": false,
    "requiredFiles": ["index.tsx", "interface.ts", "style/index.less", "__tests__/index.test.tsx"],
    "requiredStories": true
  }
}
```

### Token Registry

Token Registry 记录设计系统允许使用的 Token。

```json
{
  "color": {
    "primary": "@nimbus-color-primary",
    "success": "@nimbus-color-success",
    "error": "@nimbus-color-error",
    "warning": "@nimbus-color-warning"
  },
  "spacing": {
    "xs": "@nimbus-spacing-xs",
    "sm": "@nimbus-spacing-sm",
    "md": "@nimbus-spacing-md"
  }
}
```

### 命名规范

规则示例：

- 事件回调统一使用 `onXxx`。
- 表单类组件优先使用 `value` + `onChange`。
- 弹层类组件统一使用 `open` + `onCancel`。
- 布尔属性使用语义明确的形容词，例如 `disabled`、`loading`、`closable`。

## Prompt 层规则示例

### Props 命名规范

```text
你是组件库治理 Agent。请根据组件 Schema 和源码分析结果判断 Props 命名是否符合规范。

规则：
1. 表单输入类组件使用 value/defaultValue/onChange。
2. 弹层展示类组件使用 open/onCancel/onOk。
3. 事件回调必须以 on 开头。
4. 不要引入与现有组件心智冲突的同义 Props。

输出：
- level: error/warn/info
- reason
- suggestion
```

### Token 使用规范

```text
你是设计系统治理 Agent。请检查样式文件中的颜色、间距、字号是否使用 Token。

规则：
1. 组件样式不得直接使用业务颜色硬编码。
2. 允许 0、1px border 等低风险基础值。
3. 可交互状态颜色应使用语义 Token。
4. 如果硬编码值和 Token Registry 中某个 Token 接近，请给出替换建议。
```

## 自动治理闭环

### 第一阶段：检测，不阻断

- 本地或 CI 中运行扫描脚本。
- 输出组件质量报告。
- 不影响合并，用于发现问题。

### 第二阶段：PR 评论

- CI 调用 MCP Tool。
- AI Agent 根据结构化结果生成 Review 评论。
- 对新增组件强制要求 Storybook、测试、文档齐全。

### 第三阶段：CI 拦截

- `error` 级规则阻断合并。
- `warn` 级规则只评论不阻断。
- 治理规则按组件成熟度逐步收紧。

## 组件评分体系

可以为每个组件生成质量分：

| 维度 | 权重 |
| --- | --- |
| TypeScript 类型完整度 | 20 |
| Storybook 示例完整度 | 20 |
| 单元测试覆盖 | 25 |
| Token 使用规范 | 25 |
| API 命名一致性 | 10 |

示例：

```json
{
  "component": "Upload",
  "score": 86,
  "issues": [
    {
      "level": "warn",
      "message": "样式中存在硬编码间距，建议替换为 spacing token。"
    }
  ]
}
```

## 在 Nimbus UI 中的落地路线

### Step 1：主题 Token 解耦

新增 `packages/nimbus-ui/src/theme`：

```text
theme/
├── tokens.ts
├── css-vars.less
└── index.ts
```

将组件样式中的颜色、间距、圆角逐步替换为 CSS Variables：

```less
:root {
  --nimbus-color-primary: #3a7bf7;
  --nimbus-radius-base: 4px;
}

.nimbus-button-primary {
  background: var(--nimbus-color-primary);
  border-radius: var(--nimbus-radius-base);
}
```

这样组件样式只消费语义变量，品牌换肤和暗黑模式通过覆盖 CSS Variables 完成。

当前项目已经完成第一版主题解耦样板：

- `packages/nimbus-ui/src/theme/css-vars.less` 定义 light/dark 两套 CSS Variables。
- `packages/nimbus-ui/src/theme/index.ts` 提供 `setNimbusTheme` 方法。
- `Button`、`Input`、`Select`、`Table`、`Upload`、`Alert` 和 `Modal` 已经从硬编码颜色迁移为消费 `var(--nimbus-*)`。
- Storybook 中新增 `Theme/Tokens` 示例，用于对比 light/dark 下的组件表现。

### Step 2：补 Token Registry

新增：

```text
packages/tokens/
├── token.registry.json
└── package.json
```

用于 MCP Tool 校验哪些 Token 合法，哪些 Token 未被使用。

### Step 3：实现 MCP Server 原型

新增：

```text
packages/mcp-server/
├── src/
│   ├── tools/analyzeComponent.ts
│   ├── tools/analyzeTokens.ts
│   └── index.ts
└── package.json
```

第一版只做只读分析，不自动改代码，降低风险。

当前项目已经落地第一版 Token 扫描 MVP：

```text
packages/
├── tokens/
│   └── token.registry.json
└── mcp-server/
    └── src/scanTokens.js
```

运行：

```bash
pnpm scan:tokens
```

组件结构和完整性扫描：

```bash
pnpm scan:components
```

总治理报告：

```bash
pnpm scan:governance
```

也可以输出 JSON，方便后续接入 Agent 或 CI：

```bash
node packages/mcp-server/src/scanTokens.js --json --output token-report.json
```

如果希望 CI 在存在未映射 Token 时失败：

```bash
node packages/mcp-server/src/scanTokens.js --fail-on-unmapped
```

当前项目已新增 GitHub Actions 治理流水线：

```text
.github/workflows/governance.yml
```

该流水线会在 push 和 pull_request 阶段执行：

- `pnpm scan:components -- --fail-on-missing --fail-on-naming`
- `pnpm scan:tokens -- --fail-on-unmapped`
- `pnpm scan:governance -- --fail-on-regression --output governance-report.json`

并将总治理报告作为 artifact 上传。

### Step 4：接入 CI

CI 中运行：

```bash
pnpm --filter @nimbus-ui/mcp-server scan
```

输出：

- 组件 API 报告。
- Token 使用报告。
- 缺失文档、缺失测试、缺失 Storybook 的组件列表。

## 面试表达

可以这样讲：

> 我在组件库后续治理上设计了一套基于 MCP 的自动化治理方案。核心不是单纯写规范文档，而是把组件规范、Token 规范和组件源码解析能力结合起来。Tool 负责把源码解析成结构化 Schema，Prompt 负责表达治理规则，Token Registry 和组件 Schema 提供上下文，最后在 CI 或 PR Review 阶段输出问题和修复建议。这样可以把人工 Review 中重复性的组件规范检查自动化，尤其适合组件库长期演进和历史组件治理。

简历可以写成：

> 设计基于 MCP 的组件治理方案，通过 AST 抽取组件 Props、事件与样式 Token 使用情况，结合结构化 Token Registry 和 Prompt 规则，实现组件规范检测、Token 一致性分析、文档完整性校验及 CI 阶段治理报告输出。
