---
title: Table 表格
nav:
  title: 组件
  order: 2
group:
  title: 数据展示
  order: 2
---

# Table 表格

数据展示型表格组件，支持 columns 配置和基础排序。

## 基本用法

<code src="./demo/basic.tsx"></code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列定义 | `ColumnType[]` | `[]` |
| dataSource | 数据源 | `Record<string, any>[]` | `[]` |
| rowKey | 行 key | `string \| (record) => key` | - |
| bordered | 是否展示边框 | `boolean` | `false` |
| loading | 加载状态 | `boolean` | `false` |
