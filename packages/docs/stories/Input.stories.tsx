import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input } from 'nimbus-ui';

const meta: Meta<typeof Input> = {
  title: 'Data Entry/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Please input',
    allowClear: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Basic: Story = {};

export const WithAffix: Story = {
  render: () => <Input placeholder="Search keyword" prefix="N" suffix="UI" />,
};
