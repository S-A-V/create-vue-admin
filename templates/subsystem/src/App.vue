<template>
  <el-config-provider :locale="globalConfig.el.locale" :size="globalConfig.el.size">
    <w-config-provider :env="globalConfig.w.env" :common-menus="globalConfig.w.commonMenus">
      <router-view />
    </w-config-provider>
  </el-config-provider>
</template>

<script setup>
import Cookies from 'js-cookie';
import locale from 'element-plus/dist/locale/zh-cn.mjs';
// import { handleThemeStyle } from '@way-ui/utils/theme';
import { $modal } from 'way-ui';
import { postSubsystemLoadedMessage, receiveRoutesConfigMessage } from '@/utils/app';
// import useSettingsStore from '@/store/modules/settings';
import useUserStore from '@/store/modules/user';

const globalConfig = ref({
  el: {
    locale,
    size: Cookies.get('size') || 'default', // 支持 large、default、small
  },
  w: {
    env: {
      VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
      VITE_APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL,
      VITE_APP_BASE_API: import.meta.env.VITE_APP_BASE_API,
    },
    commonMenus: [
      {
        path: '/index',
        meta: { title: '首页', icon: 'dashboard' },
      },
    ],
  },
});

const userStore = useUserStore();
let appName = '';

onBeforeMount(() => {
  if (['/', '/portal', '/auth'].every((p) => p !== location.pathname)) {
    if (!window.opener) {
      const errorMessage = '请从门户页进入';
      $modal.msgError(errorMessage);
      throw new Error(errorMessage);
    }

    const windowName = JSON.parse(window.name || '{}');
    appName = windowName.appName;
    console.log({ windowName: windowName, appName: appName });

    if (appName) {
      const { token } = windowName;
      if (token) {
        userStore.setToken(token);
      }
    }
  }
});

onMounted(() => {
  if (appName) {
    window.addEventListener('message', receiveRoutesConfigMessage);
    postSubsystemLoadedMessage();
  }

  nextTick(() => {
    // 初始化主题样式
    // handleThemeStyle(useSettingsStore().theme);
  });
});

onUnmounted(() => {
  if (appName) {
    window.removeEventListener('message', receiveRoutesConfigMessage);
  }
});
</script>
