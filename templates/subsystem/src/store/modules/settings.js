import defaultSettings from '@/settings';
import { setDynamicTitle } from '@/utils/dynamicTitle';
import { defineStore } from 'pinia';

const {
  sideTheme,
  showSettings,
  topNav,
  commonMenus,
  tagsView,
  fixedHeader,
  sidebarLogo,
  dynamicTitle,
} = defaultSettings;

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || '';

const useSettingsStore = defineStore('settings', {
  state: () => ({
    title: '',
    theme: storageSetting.theme || '#3660FF',
    sideTheme: storageSetting.sideTheme || sideTheme,
    showSettings: showSettings,
    topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
    commonMenus:
      storageSetting.commonMenus === undefined ? commonMenus : storageSetting.commonMenus,
    tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
    fixedHeader:
      fixedHeader || storageSetting.fixedHeader === undefined
        ? fixedHeader
        : storageSetting.fixedHeader,
    sidebarLogo:
      storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
    dynamicTitle:
      storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle,
  }),
  actions: {
    // 修改布局设置
    changeSetting(data) {
      const { key, value } = data;
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    },
    // 设置网页标题
    setTitle(title) {
      this.title = title;
      setDynamicTitle();
    },
  },
});

export default useSettingsStore;
