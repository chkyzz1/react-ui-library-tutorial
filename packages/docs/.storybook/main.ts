import path from 'path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'nimbus-ui': path.resolve(__dirname, '../../nimbus-ui/src/index.ts'),
      '@nimbus-ui/utils': path.resolve(__dirname, '../../utils/src/index.ts'),
    };
    return config;
  },
};

export default config;
