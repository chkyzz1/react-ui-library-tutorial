import React, { useState } from 'react';
import { Button, Modal } from 'nimbus-ui';

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        打开弹窗
      </Button>
      <Modal open={open} title="确认操作" onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
        这是一个基础弹窗示例。
      </Modal>
    </>
  );
};
