# Button 组件分析

## 组件概述与功能定位
`Button` 是最基础的触发器组件，支持类型、尺寸、禁用、加载和块级展示，用于统一交互入口风格。

## 核心接口设计
- `type`：`primary/default/dashed/text/link`
- `size`：`large/middle/small`
- `loading`：展示 spinner 并屏蔽点击
- `htmlType`：透传原生按钮提交语义

## 关键技术实现
- 使用 `React.forwardRef` 支持表单场景直接聚焦或测量
- `loading || disabled` 合并成统一禁用态，避免重复点击提交
- 样式采用 BEM 类名拼接，便于后续主题化

## 与 Ant Design 对比
- 相同点：类型和尺寸命名保持一致，迁移成本低
- 差异点：当前版本不包含危险按钮、图标按钮和幽灵按钮

## 面试常见问题
- 为什么要加 `htmlType`？
  - 在表单中需要区分提交与普通按钮，避免误触发提交。
- `loading` 为什么直接禁用点击？
  - 防重复请求是常见幂等保障，组件侧统一兜底更可靠。
