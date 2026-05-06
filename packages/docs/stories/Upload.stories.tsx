import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Upload } from 'nimbus-ui';

const meta: Meta<typeof Upload> = {
  title: 'Data Entry/Upload',
  component: Upload,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Upload>;

export const Basic: Story = {
  render: () => (
    <Upload
      customRequest={({ file, onProgress, onSuccess }) => {
        onProgress?.(50);
        window.setTimeout(() => onSuccess?.({ ok: true, name: file.name }), 300);
      }}
    >
      <button type="button">Click to upload</button>
    </Upload>
  ),
};

export const Dragger: Story = {
  render: () => (
    <Upload.Dragger
      customRequest={({ file, onProgress, onSuccess }) => {
        onProgress?.(80);
        window.setTimeout(() => onSuccess?.({ ok: true, name: file.name }), 300);
      }}
    >
      Drop files here
    </Upload.Dragger>
  ),
};
