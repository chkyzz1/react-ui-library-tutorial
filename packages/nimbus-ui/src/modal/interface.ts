import type React from 'react';

export interface ModalProps {
  open: boolean;
  title?: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  footer?: React.ReactNode | null;
  closable?: boolean;
  maskClosable?: boolean;
  width?: number;
  okText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}

export interface ConfirmOptions extends Omit<ModalProps, 'open'> {}

export interface ModalType extends React.FC<ModalProps> {
  confirm: (options: ConfirmOptions) => void;
}
