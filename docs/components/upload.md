# Upload 组件分析

## 组件概述与功能定位
`Upload` 用于文件提交场景，支持点击选择、拖拽上传、进度反馈和文件列表管理。

## 核心接口设计
- 模式：`fileList + onChange`（受控）/`defaultFileList`（非受控）
- 钩子：`beforeUpload/onProgress/onSuccess/onError/onRemove`
- 请求：`customRequest` 覆盖默认 XHR 实现
- 扩展：`Upload.Dragger` 子组件

## 关键技术实现
- `useControlledState` 统一受控与非受控分支
- `updateFileList` 通过 `uid` 精准更新上传状态
- 上传流转：`uploading -> done/error -> removed`
- 拖拽通过 `dragover/drop` 事件驱动，并同步视觉态

## 与 Ant Design 对比
- 相同点：核心上传生命周期与 Dragger 交互一致
- 差异点：当前实现更轻量，未包含图片墙预览和分片上传

## 面试常见问题
- 为什么 `beforeUpload` 既支持 boolean 又支持 Promise/File？
  - 兼顾同步校验、异步校验与文件预处理（如压缩）。
- 自定义上传为什么重要？
  - 企业项目常接入私有网关或签名策略，必须允许替换请求层。
