import React, { useMemo, useState } from 'react';
import { SortOrder, TableProps } from './interface';

const prefixCls = 'nimbus-table';

function getRowKey<RecordType>(record: RecordType, rowKey: TableProps<RecordType>['rowKey']) {
  if (typeof rowKey === 'function') return rowKey(record);
  return (record as any)[rowKey];
}

function getNextOrder(order: SortOrder): SortOrder {
  if (order === null) return 'ascend';
  if (order === 'ascend') return 'descend';
  return null;
}

const Table = <RecordType extends Record<string, any>>({
  columns,
  dataSource,
  rowKey,
  bordered = false,
  loading = false,
}: TableProps<RecordType>) => {
  const [sortKey, setSortKey] = useState<string>();
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return dataSource;
    const column = columns.find(item => item.key === sortKey);
    if (!column?.sorter) return dataSource;
    const copied = [...dataSource].sort(column.sorter);
    return sortOrder === 'ascend' ? copied : copied.reverse();
  }, [columns, dataSource, sortKey, sortOrder]);

  return (
    <div className={[prefixCls, bordered ? `${prefixCls}-bordered` : ''].filter(Boolean).join(' ')}>
      <table className={`${prefixCls}-inner`}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={col.sorter ? `${prefixCls}-sortable` : ''}
                onClick={() => {
                  if (!col.sorter) return;
                  const next = col.key === sortKey ? getNextOrder(sortOrder) : 'ascend';
                  setSortKey(col.key);
                  setSortOrder(next);
                }}
              >
                <span>{col.title}</span>
                {col.sorter && sortKey === col.key ? <span className={`${prefixCls}-sort-mark`}>{sortOrder || '-'}</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length ? (
            sortedData.map((record, index) => (
              <tr key={getRowKey(record, rowKey)}>
                {columns.map(column => {
                  const value = record[column.dataIndex as keyof RecordType];
                  return (
                    <td key={column.key}>{column.render ? column.render(value, record, index) : (value as React.ReactNode)}</td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={`${prefixCls}-empty`}>
                暂无数据
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {loading ? <div className={`${prefixCls}-loading`}>Loading...</div> : null}
    </div>
  );
};

export default Table;
