import React from 'react';
import { Input } from 'nimbus-ui';

export default () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <Input placeholder="请输入内容" prefix="@" suffix=".com" allowClear />
    <Input.Password placeholder="请输入密码" />
    <Input.TextArea placeholder="多行文本" />
  </div>
);
