import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Select } from 'nimbus-ui';

const cityOptions = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Shenzhen', value: 'shenzhen' },
  { label: 'Hangzhou', value: 'hangzhou' },
];

const meta: Meta<typeof Select> = {
  title: 'Data Entry/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    options: cityOptions,
    placeholder: 'Select city',
    allowClear: true,
    showSearch: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Basic: Story = {};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('shanghai');

    return (
      <div style={{ display: 'grid', gap: 12, width: 260 }}>
        <Select options={cityOptions} value={value} onChange={setValue} allowClear showSearch />
        <div>Current value: {value || 'empty'}</div>
      </div>
    );
  },
};
