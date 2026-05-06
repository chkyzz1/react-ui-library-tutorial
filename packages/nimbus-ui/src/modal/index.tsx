import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ConfirmOptions, ModalProps, ModalType } from './interface';

const prefixCls = 'nimbus-modal';

const Modal: ModalType = ({
  open,
  title,
  onOk,
  onCancel,
  footer,
  closable = true,
  maskClosable = true,
  width = 520,
  okText = '确定',
  cancelText = '取消',
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onCancel?.();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  const defaultFooter = (
    <div className={`${prefixCls}-footer`}>
      <button type="button" className={`${prefixCls}-btn ${prefixCls}-btn-default`} onClick={onCancel}>
        {cancelText}
      </button>
      <button type="button" className={`${prefixCls}-btn ${prefixCls}-btn-primary`} onClick={onOk}>
        {okText}
      </button>
    </div>
  );

  return ReactDOM.createPortal(
    <div className={prefixCls}>
      <div className={`${prefixCls}-mask`} onClick={maskClosable ? onCancel : undefined} />
      <div className={`${prefixCls}-content`} style={{ width }}>
        <div className={`${prefixCls}-header`}>
          <div className={`${prefixCls}-title`}>{title}</div>
          {closable ? (
            <button type="button" className={`${prefixCls}-close`} aria-label="close modal" onClick={onCancel}>
              x
            </button>
          ) : null}
        </div>
        <div className={`${prefixCls}-body`}>{children}</div>
        {footer === undefined ? defaultFooter : footer}
      </div>
    </div>,
    document.body,
  );
};

Modal.confirm = (options: ConfirmOptions) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const destroy = () => {
    ReactDOM.unmountComponentAtNode(div);
    if (div.parentNode) div.parentNode.removeChild(div);
  };

  const onCancel = () => {
    options.onCancel?.();
    destroy();
  };

  const onOk = () => {
    options.onOk?.();
    destroy();
  };

  ReactDOM.render(<Modal {...options} open onCancel={onCancel} onOk={onOk} />, div);
};

export default Modal;
