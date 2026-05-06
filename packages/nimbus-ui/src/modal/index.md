---
title: Modal 对话框
nav:
  title: 组件
  order: 2
group:
  title: 反馈
  order: 3
---

# Modal 对话框

模态对话框组件，基于 Portal 渲染到 `document.body`。

## 基本用法

<code src="./demo/basic.tsx"></code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示 | `boolean` | `false` |
| title | 标题 | `React.ReactNode` | - |
| onOk | 确认回调 | `() => void` | - |
| onCancel | 取消回调 | `() => void` | - |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| closable | 是否显示关闭按钮 | `boolean` | `true` |
