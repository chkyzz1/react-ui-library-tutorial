import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from '..';

describe('<Alert />', () => {
  test('should render default', () => {
    const { container } = render(<Alert>default</Alert>);
    expect(container).toMatchSnapshot();
  });

  test('should render alert with type', () => {
    const kinds: any[] = ['info', 'warning', 'success', 'error'];

    const { getByText } = render(
      <>
        {kinds.map(k => (
          <Alert kind={k} key={k}>
            {k}
          </Alert>
        ))}
      </>,
    );

    kinds.forEach(k => {
      expect(getByText(k)).toMatchSnapshot();
    });
  });

  test('should render title and close alert', () => {
    const { getByText, getByLabelText, queryByText } = render(
      <Alert title="标题" closable>
        内容
      </Alert>,
    );
    expect(getByText('标题')).toBeTruthy();
    expect(getByText('内容')).toBeTruthy();
    userEvent.click(getByLabelText('Close'));
    expect(queryByText('内容')).toBeNull();
  });
});
