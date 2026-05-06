import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '..';

describe('<Modal />', () => {
  test('should render content when open', () => {
    const { getByText } = render(
      <Modal open title="提示">
        内容
      </Modal>,
    );
    expect(getByText('提示')).toBeTruthy();
    expect(getByText('内容')).toBeTruthy();
  });

  test('should call onCancel when clicking close', () => {
    const onCancel = jest.fn();
    const { getByLabelText } = render(<Modal open onCancel={onCancel} />);
    userEvent.click(getByLabelText('close modal'));
    expect(onCancel).toHaveBeenCalled();
  });
});
