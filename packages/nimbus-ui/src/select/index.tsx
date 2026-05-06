import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SelectProps } from './interface';

const prefixCls = 'nimbus-select';

const Select: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = '请选择',
  disabled = false,
  allowClear = false,
  showSearch = false,
}) => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [innerValue, setInnerValue] = useState(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const mergedValue = isControlled ? value : innerValue;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current || rootRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!showSearch || !keyword) return options;
    return options.filter(item => String(item.label).toLowerCase().includes(keyword.toLowerCase()));
  }, [options, keyword, showSearch]);

  const selected = options.find(item => item.value === mergedValue);

  const triggerChange = (nextValue: string | undefined) => {
    if (!isControlled) setInnerValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div className={[prefixCls, disabled ? `${prefixCls}-disabled` : ''].filter(Boolean).join(' ')} ref={rootRef}>
      <div className={`${prefixCls}-selector`} onClick={() => !disabled && setOpen(v => !v)}>
        <span className={`${prefixCls}-value`}>{selected ? selected.label : placeholder}</span>
        {allowClear && mergedValue ? (
          <button
            type="button"
            className={`${prefixCls}-clear`}
            aria-label="clear select"
            onClick={e => {
              e.stopPropagation();
              triggerChange(undefined);
              setKeyword('');
            }}
          >
            x
          </button>
        ) : (
          <span className={`${prefixCls}-arrow`}>v</span>
        )}
      </div>
      {open ? (
        <div className={`${prefixCls}-dropdown`}>
          {showSearch ? (
            <input
              className={`${prefixCls}-search`}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="搜索"
            />
          ) : null}
          <div className={`${prefixCls}-options`}>
            {filteredOptions.map(item => (
              <div
                key={item.value}
                className={[
                  `${prefixCls}-option`,
                  mergedValue === item.value ? `${prefixCls}-option-active` : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  triggerChange(item.value);
                  setOpen(false);
                }}
              >
                {item.label}
              </div>
            ))}
            {filteredOptions.length === 0 ? <div className={`${prefixCls}-empty`}>暂无数据</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Select;
