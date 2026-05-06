import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table from '..';

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    sorter: (a: any, b: any) => a.age - b.age,
  },
];

const dataSource = [
  { id: '1', name: 'A', age: 20 },
  { id: '2', name: 'B', age: 18 },
];

describe('<Table />', () => {
  test('should render table rows', () => {
    const { getByText } = render(<Table columns={columns} dataSource={dataSource} rowKey="id" />);
    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
  });

  test('should sort data by column', () => {
    const { getByText, container } = render(<Table columns={columns} dataSource={dataSource} rowKey="id" />);
    userEvent.click(getByText('Age'));
    const firstRow = container.querySelector('tbody tr td');
    expect(firstRow?.textContent).toBe('B');
  });
});
