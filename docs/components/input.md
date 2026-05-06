# Input 组件分析

## 组件概述与功能定位
`Input` 提供单行输入、多行输入和密码输入三类能力，覆盖常见数据录入入口。

## 核心接口设计
- 受控/非受控：`value` + `onChange` 与 `defaultValue`
- `allowClear`：一键清空
- `prefix/suffix`：前后缀插槽
- 组合模式：`Input.Password`、`Input.TextArea`

## 关键技术实现
- 自定义 `useMergedState` 统一受控与非受控逻辑
- 清空按钮触发同一 `onChange` 管道，行为一致
- `TextArea` 使用 `scrollHeight` 自适应高度

## 与 Ant Design 对比
- 相同点：核心 API 与组合模式一致
- 差异点：暂未提供 `status`、`showCount` 与 `addonBefore/After`

## 面试常见问题
- 如何避免受控/非受控冲突？
  - 用 `value !== undefined` 明确模式，内部状态仅在非受控更新。
- 为什么组合模式挂在主组件上？
  - 统一命名空间，提升发现性，减少用户 import 成本。
