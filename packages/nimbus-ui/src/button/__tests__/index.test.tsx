import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '..';

describe('<Button />', () => {
  test('should render default button', () => {
    const { container } = render(<Button>Button</Button>);
    expect(container).toMatchSnapshot();
  });

  test('should support loading and disabled click', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Button loading onClick={onClick}>
        Submit
      </Button>,
    );
    userEvent.click(getByText('Submit'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
