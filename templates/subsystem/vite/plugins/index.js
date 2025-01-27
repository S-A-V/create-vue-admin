import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { WayUIResolver } from '@way-ui/unplugin/resolvers';

import createAutoImport from './auto-import';
import createSvgIcon from './svg-icon';
import createCompression from './compression';
import createSetupExtend from './setup-extend';

import vueJsx from '@vitejs/plugin-vue-jsx';

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [
    vue(),
    vueJsx(),
    createAutoImport(),
    createSetupExtend(),
    createSvgIcon(isBuild),
    Components({
      resolvers: [
        IconsResolver({
          prefix: 'i',
          enabledCollections: ['ep'],
        }),
        ElementPlusResolver({ importStyle: false }),
        WayUIResolver({ exclude: /WEditor/ }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
  ];
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return vitePlugins;
}
