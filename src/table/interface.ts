import type React from 'react';

export type SortOrder = 'ascend' | 'descend' | null;

export interface ColumnType<RecordType = any> {
  title: React.ReactNode;
  dataIndex: keyof RecordType | string;
  key: string;
  render?: (value: any, record: RecordType, index: number) => React.ReactNode;
  sorter?: (a: RecordType, b: RecordType) => number;
}

export interface TableProps<RecordType = any> {
  columns: ColumnType<RecordType>[];
  dataSource: RecordType[];
  rowKey: keyof RecordType | ((record: RecordType) => React.Key);
  bordered?: boolean;
  loading?: boolean;
}
