import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Alert } from 'nimbus-ui';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    kind: 'info',
    title: 'Notice',
    children: 'This is a lightweight feedback message.',
    closable: false,
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Basic: Story = {};

export const Kinds: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Alert kind="info" title="Info">
        Information message.
      </Alert>
      <Alert kind="success" title="Success">
        Operation completed.
      </Alert>
      <Alert kind="warning" title="Warning">
        Please check the input.
      </Alert>
      <Alert kind="error" title="Error">
        Operation failed.
      </Alert>
    </div>
  ),
};

export const Closable: Story = {
  args: {
    closable: true,
    title: 'Closable alert',
    children: 'Click the close button to remove this alert.',
  },
};
