---
title: Button 按钮
nav:
  title: 组件
  order: 2
group:
  title: 通用
  order: 0
---

# Button 按钮

通用按钮组件，支持不同类型、尺寸和加载状态。

## 基本用法

<code src="./demo/basic.tsx"></code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `primary \| default \| dashed \| text \| link` | `default` |
| size | 按钮尺寸 | `large \| middle \| small` | `middle` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| htmlType | 原生 type | `button \| submit \| reset` | `button` |
| block | 是否占满一行 | `boolean` | `false` |
