import type React from 'react';

export type InputSize = 'large' | 'middle' | 'small';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: InputSize;
  allowClear?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export interface InputTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: InputSize;
}

export interface InputPasswordProps extends InputProps {}

export interface CompoundedInput
  extends React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>> {
  Password: React.FC<InputPasswordProps>;
  TextArea: React.FC<InputTextAreaProps>;
}
