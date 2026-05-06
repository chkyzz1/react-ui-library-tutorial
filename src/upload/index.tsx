import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UploadFile, UploadProps, UploadRequestOption, UploadType } from './interface';

const prefixCls = 'nimbus-upload';
let uid = 0;

function getUid() {
  uid += 1;
  return `${Date.now()}_${uid}`;
}

function useControlledState<T>(defaultValue: T, value?: T) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const merged = isControlled ? (value as T) : innerValue;

  const setValue = (next: T) => {
    if (!isControlled) setInnerValue(next);
  };

  return [merged, setValue] as const;
}

function updateFileList(nextFile: UploadFile, list: UploadFile[]) {
  const idx = list.findIndex(item => item.uid === nextFile.uid);
  if (idx === -1) return [...list, nextFile];
  const next = [...list];
  next[idx] = nextFile;
  return next;
}

function isImageUrl(file: UploadFile) {
  const name = file.name || '';
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(name) || !!file.url;
}

function defaultRequest(option: UploadRequestOption) {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append(option.name || 'file', option.file);
  xhr.open(option.method || 'post', option.action || '/');
  xhr.upload.onprogress = event => {
    if (!event.total) return;
    const percent = Math.round((event.loaded / event.total) * 100);
    option.onProgress?.(percent, event);
  };
  xhr.onerror = () => option.onError?.(new Error('Upload failed'));
  xhr.onload = () => option.onSuccess?.(xhr.responseText, xhr);
  xhr.send(formData);
}

const Upload: UploadType = ({
  action,
  method = 'post',
  name = 'file',
  accept,
  multiple = false,
  maxCount,
  disabled = false,
  fileList,
  defaultFileList = [],
  listType = 'text',
  beforeUpload,
  onChange,
  onProgress,
  onSuccess,
  onError,
  onRemove,
  onPreview,
  onDrop,
  customRequest,
  itemRender,
  children,
  type = 'select',
}) => {
  const [mergedFileList, setMergedFileList] = useControlledState<UploadFile[]>(defaultFileList, fileList);
  const [dragState, setDragState] = useState<'default' | 'dragover'>('default');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileListRef = useRef<UploadFile[]>(mergedFileList);

  useEffect(() => {
    fileListRef.current = mergedFileList;
  }, [mergedFileList]);

  const mergedClassName = useMemo(
    () =>
      [
        prefixCls,
        `${prefixCls}-${type}`,
        type === 'drag' && dragState === 'dragover' ? `${prefixCls}-dragover` : '',
        disabled ? `${prefixCls}-disabled` : '',
      ]
        .filter(Boolean)
        .join(' '),
    [dragState, disabled, type],
  );

  const triggerChange = (nextList: UploadFile[], file?: UploadFile) => {
    const withCount = maxCount ? (maxCount === 1 ? nextList.slice(-1) : nextList.slice(0, maxCount)) : nextList;
    fileListRef.current = withCount;
    setMergedFileList(withCount);
    onChange?.(withCount, file);
  };

  const post = (targetFile: File) => {
    const current: UploadFile = {
      uid: getUid(),
      name: targetFile.name,
      status: 'uploading',
      percent: 0,
      originFileObj: targetFile,
    };
    const initialList = updateFileList(current, fileListRef.current);
    triggerChange(initialList, current);

    const request = customRequest || defaultRequest;
    request({
      file: targetFile,
      action,
      method,
      name,
      onProgress: percent => {
        const nextFile = { ...current, percent, status: 'uploading' as const };
        const nextList = updateFileList(nextFile, fileListRef.current);
        triggerChange(nextList, nextFile);
        onProgress?.(percent, nextFile);
      },
      onSuccess: response => {
        const doneFile = { ...current, status: 'done' as const, percent: 100, response };
        const nextList = updateFileList(doneFile, fileListRef.current);
        triggerChange(nextList, doneFile);
        onSuccess?.(response, doneFile);
      },
      onError: error => {
        const errorFile = { ...current, status: 'error' as const };
        const nextList = updateFileList(errorFile, fileListRef.current);
        triggerChange(nextList, errorFile);
        onError?.(error, errorFile);
      },
    });
  };

  const uploadFiles = async (files: File[]) => {
    for (let i = 0; i < files.length; i += 1) {
      const rawFile = files[i];
      if (beforeUpload) {
        const result = await beforeUpload(rawFile, files);
        if (result === false) continue;
        if (result instanceof File) {
          post(result);
          continue;
        }
      }
      post(rawFile);
    }
  };

  const handleRemove = async (file: UploadFile) => {
    const allow = await Promise.resolve(onRemove ? onRemove(file) : true);
    if (!allow) return;
    const nextList = mergedFileList.filter(item => item.uid !== file.uid);
    triggerChange(nextList, { ...file, status: 'removed' });
  };

  return (
    <div>
      <div
        className={mergedClassName}
        onClick={() => {
          if (disabled) return;
          inputRef.current?.click();
        }}
        onDrop={e => {
          e.preventDefault();
          if (type !== 'drag') return;
          setDragState('default');
          onDrop?.(e);
          uploadFiles(Array.from(e.dataTransfer.files));
        }}
        onDragOver={e => {
          if (type !== 'drag') return;
          e.preventDefault();
          setDragState('dragover');
        }}
        onDragLeave={e => {
          if (type !== 'drag') return;
          e.preventDefault();
          setDragState('default');
        }}
      >
        <input
          ref={inputRef}
          className={`${prefixCls}-input`}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={e => {
            const files = Array.from(e.target.files || []);
            uploadFiles(files);
            e.target.value = '';
          }}
        />
        {children || (type === 'drag' ? '点击或拖拽文件到此区域上传' : '点击上传')}
      </div>
      <ul className={`${prefixCls}-list ${prefixCls}-list-${listType}`}>
        {mergedFileList.map(file => (
          <li className={`${prefixCls}-list-item`} key={file.uid}>
            {itemRender ? (
              itemRender(file)
            ) : (
              <>
                <span
                  className={`${prefixCls}-file-name ${isImageUrl(file) && listType !== 'text' ? `${prefixCls}-image-name` : ''}`}
                  onClick={() => onPreview?.(file)}
                >
                  {file.name}
                </span>
                <span className={`${prefixCls}-status`}>{file.status || 'ready'}</span>
                {file.status === 'uploading' ? <span className={`${prefixCls}-percent`}>{file.percent || 0}%</span> : null}
                <button type="button" className={`${prefixCls}-remove`} onClick={() => handleRemove(file)}>
                  删除
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

Upload.Dragger = props => <Upload {...props} type="drag" />;

export default Upload;
