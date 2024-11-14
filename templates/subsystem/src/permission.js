import router from './router';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { $token, $validator } from 'way-ui';
import useUserStore from '@/store/modules/user';
import useSettingsStore from '@/store/modules/settings';
import usePermissionStore from '@/store/modules/permission';

NProgress.configure({ showSpinner: false });

const whiteList = ['/401'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  if ($token.get()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title);
    /* has token*/
    if (whiteList.indexOf(to.path) !== -1) {
      next();
      NProgress.done();
    } else {
      if (useUserStore().roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        useUserStore()
          .getInfo()
          .then(() => {
            usePermissionStore()
              .getRoutes()
              .then((accessRoutes) => {
                // 根据roles权限生成可访问的路由表
                accessRoutes.forEach((route) => {
                  if (!$validator.isHttp(route.path)) {
                    router.addRoute(route); // 动态添加可访问路由表
                  }
                });
                next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
              });
          })
          .catch((err) => {
            console.log(err);

            useUserStore()
              .logOut()
              .then(() => {
                ElMessage.error(err);
                next({ path: '/401' });
              });
          });
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next('/401');
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
