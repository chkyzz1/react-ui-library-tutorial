import React from 'react';
import { Table } from 'nimbus-ui';

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    sorter: (a: any, b: any) => a.age - b.age,
  },
  { title: 'Address', dataIndex: 'address', key: 'address' },
];

const dataSource = [
  { id: '1', name: 'Alice', age: 24, address: 'Beijing' },
  { id: '2', name: 'Bob', age: 30, address: 'Shanghai' },
];

export default () => <Table columns={columns} dataSource={dataSource} rowKey="id" bordered />;
