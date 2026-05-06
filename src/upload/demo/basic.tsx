import React from 'react';
import { Upload } from 'nimbus-ui';

export default () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <Upload action="/api/upload" beforeUpload={file => file.size < 1024 * 1024}>
      点击上传
    </Upload>
    <Upload.Dragger action="/api/upload">拖拽上传区域</Upload.Dragger>
  </div>
);
