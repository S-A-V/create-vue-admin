import config from '@way-ui/eslint-config';

export default [
  ...config,
  {
    rules: {
      'vue/multi-word-component-names': 'warn',
    },
  },
];
