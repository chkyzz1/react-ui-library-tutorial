import React from 'react';
import { Button } from 'nimbus-ui';

export default () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <div>
      <Button type="primary" style={{ marginRight: 8 }}>
        Primary
      </Button>
      <Button type="dashed" style={{ marginRight: 8 }}>
        Dashed
      </Button>
      <Button type="link">Link</Button>
    </div>
    <div>
      <Button size="large" style={{ marginRight: 8 }}>
        Large
      </Button>
      <Button loading>Loading</Button>
    </div>
  </div>
);
