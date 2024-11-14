<template>
  <router-view />
</template>

<script setup>
import { handleThemeStyle } from '@way-ui/utils/theme';
import { $modal } from 'way-ui';
import { postSubsystemLoadedMessage, receiveRoutesConfigMessage } from '@/utils/app';
import useSettingsStore from '@/store/modules/settings';
import useUserStore from '@/store/modules/user';

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
    handleThemeStyle(useSettingsStore().theme);
  });
});

onUnmounted(() => {
  if (appName) {
    window.removeEventListener('message', receiveRoutesConfigMessage);
  }
});
</script>
