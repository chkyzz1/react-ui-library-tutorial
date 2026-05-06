import React, { useState } from 'react';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * @description       Alert 的类型
   * @default           'info'
   */
  kind?: 'info' | 'success' | 'error' | 'warning';
  /**
   * @description       Alert 标题
   */
  title?: React.ReactNode;
  /**
   * @description       是否可关闭
   * @default           false
   */
  closable?: boolean;
}

export type KindMap = Record<Required<AlertProps>['kind'], string>;

const prefixCls = 'nimbus-alert';

const kinds: KindMap = {
  info: '#3A7BF7',
  success: '#36B37E',
  error: '#E5484D',
  warning: '#E8943A',
};

const Alert: React.FC<AlertProps> = ({ children, kind = 'info', title, closable = false, ...rest }) => {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div
      className={prefixCls}
      style={{
        borderLeftColor: kinds[kind],
      }}
      {...rest}
    >
      <div className={`${prefixCls}-content`}>
        {title ? <div className={`${prefixCls}-title`}>{title}</div> : null}
        {children ? <div className={`${prefixCls}-desc`}>{children}</div> : null}
      </div>
      {closable ? (
        <button className={`${prefixCls}-close`} type="button" onClick={() => setClosed(true)} aria-label="Close">
          x
        </button>
      ) : null}
    </div>
  );
};

export default Alert;
