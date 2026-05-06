---
title: Alert 警告提示
nav:
  title: 组件
  order: 2
group:
  title: 反馈
  order: 3
---

# Alert 警告提示

警告提示，展现需要关注的信息。

## 基本用法

<code src="./demo/basic.tsx"></code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| kind | 警告类型 | `info \| success \| error \| warning` | `info` |
| title | 标题内容，存在时展示双行模式 | `React.ReactNode` | - |
| closable | 是否显示关闭按钮 | `boolean` | `false` |
