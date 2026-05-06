import type React from 'react';

export type UploadStatus = 'uploading' | 'done' | 'error' | 'removed';
export type UploadListType = 'text' | 'picture' | 'picture-card';

export interface UploadFile<T = any> {
  uid: string;
  name: string;
  status?: UploadStatus;
  percent?: number;
  response?: T;
  originFileObj?: File;
  url?: string;
}

export interface UploadRequestOption {
  file: File;
  action?: string;
  method?: string;
  name?: string;
  onProgress?: (percent: number, event?: ProgressEvent<EventTarget>) => void;
  onSuccess?: (response: any, xhr?: XMLHttpRequest) => void;
  onError?: (error: Error) => void;
}

export type BeforeUploadValue = boolean | File | Promise<boolean | File>;

export interface UploadProps {
  action?: string;
  method?: string;
  name?: string;
  accept?: string;
  multiple?: boolean;
  maxCount?: number;
  disabled?: boolean;
  fileList?: UploadFile[];
  defaultFileList?: UploadFile[];
  listType?: UploadListType;
  beforeUpload?: (file: File, fileList: File[]) => BeforeUploadValue;
  onChange?: (fileList: UploadFile[], file?: UploadFile) => void;
  onProgress?: (percent: number, file: UploadFile) => void;
  onSuccess?: (response: any, file: UploadFile) => void;
  onError?: (error: Error, file: UploadFile) => void;
  onRemove?: (file: UploadFile) => boolean | Promise<boolean>;
  onPreview?: (file: UploadFile) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  customRequest?: (option: UploadRequestOption) => void;
  itemRender?: (file: UploadFile) => React.ReactNode;
  children?: React.ReactNode;
  type?: 'select' | 'drag';
}

export interface UploadType extends React.FC<UploadProps> {
  Dragger: React.FC<UploadProps>;
}
