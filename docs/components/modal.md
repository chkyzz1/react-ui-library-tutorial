# Modal 组件分析

## 组件概述与功能定位
`Modal` 用于承载确认、详情、二次操作等中断式交互，强调聚焦与任务闭环。

## 核心接口设计
- `open`：显示状态
- `onOk/onCancel`：确认与取消回调
- `maskClosable/closable`：关闭行为控制
- `footer`：自定义底部操作区

## 关键技术实现
- 使用 `ReactDOM.createPortal` 渲染到 `document.body`
- 打开时锁定 `body` 滚动，关闭时恢复
- 监听 `Escape` 支持键盘关闭
- 提供 `Modal.confirm` 命令式调用入口

## 与 Ant Design 对比
- 相同点：Portal + 遮罩 + 可配置 footer 的经典结构
- 差异点：当前确认弹窗仅实现基础生命周期与文案，不含异步 loading 态

## 面试常见问题
- 为什么 Modal 适合 Portal？
  - 避免被父容器 `overflow` 裁剪，提升层级与定位稳定性。
- 如何处理滚动穿透？
  - 打开时锁定 `document.body.style.overflow`，关闭时还原。
