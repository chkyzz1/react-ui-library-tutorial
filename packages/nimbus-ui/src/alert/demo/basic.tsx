import React from 'react';

import { Alert } from 'nimbus-ui';

export default () => (
  <>
    <Alert title="提示信息" kind="info" style={{ marginBottom: 12 }}>
      这是一条默认提示信息
    </Alert>
    <Alert closable kind="warning">
      这是一条可关闭的警告提示
    </Alert>
  </>
);
