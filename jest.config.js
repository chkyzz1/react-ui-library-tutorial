module.exports = {
  verbose: true,
  roots: ['<rootDir>/packages/nimbus-ui/src'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^nimbus-ui$': '<rootDir>/packages/nimbus-ui/src/index.ts',
    '^@nimbus-ui/utils$': '<rootDir>/packages/utils/src/index.ts',
    '^src$': '<rootDir>/packages/nimbus-ui/src/index.ts',
    '^src(.*)$': '<rootDir>/packages/nimbus-ui/src/$1',
  },
  testRegex: '(/test/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/esm/', '/dist/'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
};
