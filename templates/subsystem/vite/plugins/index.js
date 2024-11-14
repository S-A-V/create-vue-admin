import vue from '@vitejs/plugin-vue';

import createAutoImport from './auto-import';
import createSvgIcon from './svg-icon';
import createCompression from './compression';
import createSetupExtend from './setup-extend';

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue(), createAutoImport(), createSetupExtend(), createSvgIcon(isBuild)];
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return vitePlugins;
}
