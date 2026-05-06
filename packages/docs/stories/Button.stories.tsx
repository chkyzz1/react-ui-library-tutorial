import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from 'nimbus-ui';

const meta: Meta<typeof Button> = {
  title: 'General/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    type: 'primary',
    size: 'middle',
    loading: false,
    disabled: false,
    block: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'default', 'dashed', 'text', 'link'],
    },
    size: {
      control: 'inline-radio',
      options: ['large', 'middle', 'small'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Basic: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="text">Text</Button>
      <Button type="link">Link</Button>
    </div>
  ),
};
