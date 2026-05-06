import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Table } from 'nimbus-ui';

interface UserRecord {
  id: string;
  name: string;
  role: string;
  age: number;
}

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    sorter: (a: UserRecord, b: UserRecord) => a.age - b.age,
  },
];

const dataSource: UserRecord[] = [
  { id: '1', name: 'Alice', role: 'Designer', age: 25 },
  { id: '2', name: 'Bob', role: 'Engineer', age: 22 },
  { id: '3', name: 'Cindy', role: 'Manager', age: 29 },
];

const meta: Meta<typeof Table<UserRecord>> = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table<UserRecord>>;

export const Basic: Story = {
  args: {
    columns,
    dataSource,
    rowKey: 'id',
    bordered: true,
  },
};

export const Loading: Story = {
  args: {
    columns,
    dataSource,
    rowKey: 'id',
    bordered: true,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    columns,
    dataSource: [],
    rowKey: 'id',
    bordered: true,
  },
};
