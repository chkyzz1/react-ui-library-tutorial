import React from 'react';
import { ButtonProps } from './interface';

const prefixCls = 'nimbus-button';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'default',
      size = 'middle',
      disabled = false,
      loading = false,
      htmlType = 'button',
      block = false,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const cls = [
      prefixCls,
      `${prefixCls}-${type}`,
      `${prefixCls}-${size}`,
      block ? `${prefixCls}-block` : '',
      isDisabled ? `${prefixCls}-disabled` : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={cls}
        type={htmlType}
        disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        {...rest}
      >
        {loading ? <span className={`${prefixCls}-spinner`} aria-hidden="true" /> : null}
        <span>{children}</span>
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
