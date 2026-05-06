---
title: Select 选择器
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 1
---

# Select 选择器

下拉选择组件，支持搜索过滤与清空。

## 基本用法

<code src="./demo/basic.tsx"></code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 选项列表 | `{ label, value }[]` | `[]` |
| value | 受控值 | `string` | - |
| defaultValue | 非受控默认值 | `string` | - |
| onChange | 变更回调 | `(value) => void` | - |
| showSearch | 是否可搜索 | `boolean` | `false` |
| allowClear | 是否显示清空按钮 | `boolean` | `false` |
