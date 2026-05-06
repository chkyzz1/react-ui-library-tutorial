import React, { useState } from 'react';
import { Select } from 'nimbus-ui';

const options = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Shenzhen', value: 'shenzhen' },
];

export default () => {
  const [value, setValue] = useState<string | undefined>();

  return (
    <Select
      value={value}
      onChange={setValue}
      options={options}
      showSearch
      allowClear
      placeholder="请选择城市"
    />
  );
};
