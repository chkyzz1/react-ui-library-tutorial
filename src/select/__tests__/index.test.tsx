import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '..';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Orange', value: 'orange' },
];

describe('<Select />', () => {
  test('should open dropdown and select option', () => {
    const onChange = jest.fn();
    const { getByText } = render(<Select options={options} onChange={onChange} />);
    userEvent.click(getByText('请选择'));
    userEvent.click(getByText('Apple'));
    expect(onChange).toHaveBeenCalledWith('apple');
  });

  test('should filter options when search enabled', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<Select options={options} showSearch />);
    userEvent.click(getByText('请选择'));
    fireEvent.change(getByPlaceholderText('搜索'), { target: { value: 'ora' } });
    expect(queryByText('Apple')).toBeNull();
    expect(getByText('Orange')).toBeTruthy();
  });
});
