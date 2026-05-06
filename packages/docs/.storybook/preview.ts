import type { Preview } from '@storybook/react';

import '../../nimbus-ui/src/theme/css-vars.less';
import '../../nimbus-ui/src/alert/style/index.less';
import '../../nimbus-ui/src/button/style/index.less';
import '../../nimbus-ui/src/input/style/index.less';
import '../../nimbus-ui/src/modal/style/index.less';
import '../../nimbus-ui/src/select/style/index.less';
import '../../nimbus-ui/src/table/style/index.less';
import '../../nimbus-ui/src/upload/style/index.less';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
