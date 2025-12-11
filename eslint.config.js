import nextConfig from 'eslint-config-next';

export default [
  ...nextConfig,
  {
    name: 'local-overrides',
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@next/next/no-img-element': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
];
