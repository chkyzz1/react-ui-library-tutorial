---
title: Input 输入框
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 1
---

# Input 输入框

输入框组件，支持受控/非受控、前后缀、清空按钮等常见场景。

## 基本用法

<code src="./demo/basic.tsx"></code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控值 | `string` | - |
| defaultValue | 默认值 | `string` | `''` |
| allowClear | 是否显示清空按钮 | `boolean` | `false` |
| prefix | 前缀内容 | `React.ReactNode` | - |
| suffix | 后缀内容 | `React.ReactNode` | - |
| size | 尺寸 | `large \| middle \| small` | `middle` |
