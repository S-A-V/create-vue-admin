import { createApp } from 'vue';

import Cookies from 'js-cookie';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import locale from 'element-plus/es/locale/lang/zh-cn';

import WayUI from 'way-ui';

import '@/assets/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

// 注册指令
import download from '@/utils/download';

import Editor from '@/components/Editor';
// svg图标
import 'virtual:svg-icons-register';
import SvgIcon from '@/components/SvgIcon';
import elementIcons from '@/components/SvgIcon/svgicon';

import './permission'; // permission control

import { useDict } from '@/hooks';

const app = createApp(App);

// 全局方法挂载
app.config.globalProperties.useDict = useDict;
app.config.globalProperties.download = download;

app.use(router);
app.use(store);
app.use(elementIcons);

// 全局组件挂载
app.component('SvgIcon', SvgIcon);
app.component('WEditor', Editor);

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default',
});
app.use(WayUI);

app.mount('#app');
