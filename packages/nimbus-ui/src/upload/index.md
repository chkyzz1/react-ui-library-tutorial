---
title: Upload 上传
nav:
  title: 组件
  order: 2
group:
  title: 数据录入
  order: 1
---

# Upload 上传

上传组件，支持点击和拖拽上传，提供 beforeUpload、进度、文件列表等能力。

## 基本用法

<code src="./demo/basic.tsx"></code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| action | 上传地址 | `string` | - |
| fileList | 受控文件列表 | `UploadFile[]` | - |
| defaultFileList | 非受控文件列表 | `UploadFile[]` | `[]` |
| beforeUpload | 上传前校验 | `(file, fileList) => boolean \| Promise \| File` | - |
| onChange | 文件列表变更回调 | `(fileList, file) => void` | - |
| listType | 列表样式 | `text \| picture \| picture-card` | `text` |
| customRequest | 自定义上传请求 | `(option) => void` | - |
