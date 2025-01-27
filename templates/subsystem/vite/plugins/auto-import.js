import autoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { WayUIResolver } from '@way-ui/unplugin/resolvers';

export default function createAutoImport() {
  return autoImport({
    eslintrc: {
      enabled: true, // Default `false`
      // provide path ending with `.mjs` or `.cjs` to generate the file with the respective format
      filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
    imports: ['vue', 'vue-router', 'pinia'],
    dts: false,
    resolvers: [ElementPlusResolver(), WayUIResolver()],
  });
}
