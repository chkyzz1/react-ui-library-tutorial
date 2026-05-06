import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Upload from '..';

function mockFile(name: string) {
  return new File(['hello'], name, { type: 'text/plain' });
}

describe('<Upload />', () => {
  test('should upload file with customRequest', async () => {
    const onSuccess = jest.fn();
    const customRequest = ({ file, onProgress, onSuccess: success }: any) => {
      onProgress?.(50);
      success?.({ ok: true, fileName: file.name });
    };
    const { container, getByText } = render(<Upload customRequest={customRequest} onSuccess={onSuccess} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [mockFile('a.txt')] } });
    await Promise.resolve();
    expect(onSuccess).toHaveBeenCalled();
    expect(getByText('a.txt')).toBeTruthy();
  });

  test('should support beforeUpload reject', async () => {
    const customRequest = jest.fn();
    const { container } = render(<Upload customRequest={customRequest} beforeUpload={() => false} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [mockFile('b.txt')] } });
    await Promise.resolve();
    expect(customRequest).not.toHaveBeenCalled();
  });
});
