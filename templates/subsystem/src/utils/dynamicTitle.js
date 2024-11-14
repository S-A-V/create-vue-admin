import { SESSION_KEYS } from '@way-ui/constants';
import { $cache } from 'way-ui';
import defaultSettings from '@/settings';
import useSettingsStore from '@/store/modules/settings';

/**
 * 动态修改标题
 */
export function setDynamicTitle() {
  const titleTemplate = $cache.session.get(SESSION_KEYS.APP_TITLE) || defaultSettings.title;
  const settingsStore = useSettingsStore();
  document.title = settingsStore.dynamicTitle
    ? settingsStore.title + ' - ' + titleTemplate
    : titleTemplate;
}
