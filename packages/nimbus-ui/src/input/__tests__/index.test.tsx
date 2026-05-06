import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '..';

describe('<Input />', () => {
  test('should render input and clear text', () => {
    const onChange = jest.fn();
    const { getByLabelText, getByDisplayValue } = render(<Input defaultValue="hello" allowClear onChange={onChange} />);
    expect(getByDisplayValue('hello')).toBeTruthy();
    userEvent.click(getByLabelText('clear input'));
    expect(onChange).toHaveBeenCalled();
  });

  test('should support controlled mode', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(<Input value="fixed" onChange={onChange} placeholder="name" />);
    fireEvent.change(getByPlaceholderText('name'), { target: { value: 'next' } });
    expect(onChange).toHaveBeenCalled();
  });
});
