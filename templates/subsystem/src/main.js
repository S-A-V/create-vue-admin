import { createApp } from 'vue';
import 'element-plus/dist/index.css';
import { WayUIPlugins } from 'way-ui';

import '@/assets/styles/index.scss';
import download from '@/utils/download';
import { useDict } from '@/hooks';
import 'virtual:svg-icons-register';
import Editor from '@/components/Editor';
import App from './App';
import store from './store';
import router from './router';
import './permission';

const app = createApp(App);
app.use(WayUIPlugins);
app.use(store);
app.use(router);
app.component('WEditor', Editor);
app.config.globalProperties.download = download;
app.config.globalProperties.useDict = useDict;

app.mount('#app');
