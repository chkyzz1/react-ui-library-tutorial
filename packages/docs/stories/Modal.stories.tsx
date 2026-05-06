import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button, Modal } from 'nimbus-ui';

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open modal
        </Button>
        <Modal open={open} title="Confirm action" onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
          This modal is controlled by React state.
        </Modal>
      </>
    );
  },
};

export const CustomFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open custom footer</Button>
        <Modal
          open={open}
          title="Custom footer"
          onCancel={() => setOpen(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setOpen(false)}>Close</Button>
              <Button type="primary" onClick={() => setOpen(false)}>
                Save
              </Button>
            </div>
          }
        >
          Footer content can be replaced by consumers.
        </Modal>
      </>
    );
  },
};
