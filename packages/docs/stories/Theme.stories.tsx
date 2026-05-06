import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from 'nimbus-ui';

const meta: Meta = {
  title: 'Theme/Tokens',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const panelStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  minHeight: 140,
  padding: 24,
  border: '1px solid var(--nimbus-color-border)',
  borderRadius: 'var(--nimbus-radius-base)',
  background: 'var(--nimbus-color-bg-container)',
  color: 'var(--nimbus-color-text-heading)',
};

export const LightAndDark: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
      <div style={panelStyle}>
        <strong>Light</strong>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="link">Link</Button>
        </div>
      </div>
      <div data-nimbus-theme="dark" style={panelStyle}>
        <strong>Dark</strong>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="link">Link</Button>
        </div>
      </div>
    </div>
  ),
};
