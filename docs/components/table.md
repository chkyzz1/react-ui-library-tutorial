# Table 组件分析

## 组件概述与功能定位
`Table` 面向结构化数据展示，采用列配置驱动渲染，支持排序与加载态。

## 核心接口设计
- `columns`：列定义（`title/dataIndex/key/render/sorter`）
- `dataSource`：行数据源
- `rowKey`：行唯一键
- `bordered/loading`：展示增强选项

## 关键技术实现
- 原生 `<table>` 渲染，语义化强、兼容性好
- 排序状态由 `sortKey + sortOrder` 双状态管理
- 支持 `render` 自定义单元格，兼顾灵活性

## 与 Ant Design 对比
- 相同点：columns 驱动模式与排序函数约定一致
- 差异点：当前不含分页、筛选、固定列和虚拟滚动

## 面试常见问题
- `rowKey` 为什么重要？
  - 是 React diff 的核心，缺失会导致重排与状态错位。
- 为什么排序不直接改原数据？
  - 保持数据不可变便于调试，且避免污染外部状态源。
