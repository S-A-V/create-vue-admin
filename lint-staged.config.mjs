const eslint = 'eslint --fix';
const stylelint = 'stylelint --fix';
const prettier = 'prettier --write';

export default {
  '*.{html,vue}': [eslint, prettier, stylelint],
  '*.{css,scss}': [stylelint, prettier],
  '*.{js,mjs,cjs}': [eslint, prettier],
  '*.json': [prettier],
  '*.md': [prettier],
};
