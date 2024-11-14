import autoImport from 'unplugin-auto-import/vite';

export default function createAutoImport() {
  return autoImport({
    eslintrc: {
      enabled: false, // Default `false`
      // provide path ending with `.mjs` or `.cjs` to generate the file with the respective format
      filepath: './.eslintrc-auto-import.mjs', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
    imports: ['vue', 'vue-router', 'pinia'],
    dts: false,
  });
}
