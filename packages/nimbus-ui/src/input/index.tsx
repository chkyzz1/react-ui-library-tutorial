import React, { useEffect, useRef, useState } from 'react';
import { CompoundedInput, InputPasswordProps, InputProps, InputTextAreaProps } from './interface';

const prefixCls = 'nimbus-input';

function useMergedState(defaultValue = '', value?: string) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const mergedValue = isControlled ? value : innerValue;

  const setValue = (next: string) => {
    if (!isControlled) setInnerValue(next);
  };

  return [mergedValue, setValue] as const;
}

const InternalInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      defaultValue = '',
      onChange,
      allowClear = false,
      prefix,
      suffix,
      className,
      size = 'middle',
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [mergedValue, setValue] = useMergedState(String(defaultValue), value as string | undefined);
    const cls = [`${prefixCls}-wrapper`, `${prefixCls}-wrapper-${size}`, disabled ? `${prefixCls}-disabled` : '', className]
      .filter(Boolean)
      .join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setValue('');
      const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    return (
      <span className={cls}>
        {prefix ? <span className={`${prefixCls}-prefix`}>{prefix}</span> : null}
        <input
          ref={ref}
          className={prefixCls}
          value={mergedValue}
          disabled={disabled}
          onChange={handleChange}
          {...rest}
        />
        {allowClear && mergedValue ? (
          <button type="button" className={`${prefixCls}-clear`} onClick={handleClear} aria-label="clear input">
            x
          </button>
        ) : null}
        {suffix ? <span className={`${prefixCls}-suffix`}>{suffix}</span> : null}
      </span>
    );
  },
);

InternalInput.displayName = 'Input';

const Password: React.FC<InputPasswordProps> = ({ type, ...rest }) => {
  const [visible, setVisible] = useState(false);

  return (
    <InternalInput
      {...rest}
      type={visible ? 'text' : 'password'}
      suffix={
        <button type="button" onClick={() => setVisible(v => !v)} className={`${prefixCls}-icon-btn`}>
          {visible ? 'Hide' : 'Show'}
        </button>
      }
    />
  );
};

const TextArea: React.FC<InputTextAreaProps> = ({ className, size = 'middle', value, defaultValue = '', onChange, ...rest }) => {
  const [mergedValue, setValue] = useMergedState(String(defaultValue), value as string | undefined);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [mergedValue]);

  return (
    <textarea
      ref={ref}
      className={[`${prefixCls}-textarea`, `${prefixCls}-textarea-${size}`, className].filter(Boolean).join(' ')}
      value={mergedValue}
      onChange={e => {
        setValue(e.target.value);
        onChange?.(e);
      }}
      {...rest}
    />
  );
};

const Input = InternalInput as CompoundedInput;
Input.Password = Password;
Input.TextArea = TextArea;

export default Input;
