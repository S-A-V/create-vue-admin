import { defineStore } from 'pinia';
import { SESSION_KEYS } from '@way-ui/constants';
import { WInnerLink as InnerLink, $cache, $permission, $rolePermission } from 'way-ui';
import SUBSYSTEM from '@/constants/subsystem';
import router, { constantRoutes, dynamicRoutes } from '@/router';
import { getRouters } from '@/api';
import Layout from '@/layout';
import ParentView from '@/components/ParentView/index.vue';
import { getAppName } from '@/utils/app';

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue');

// 组件库暂时会用到，先不要做删减
const usePermissionStore = defineStore('_way-permission', {
  state: () => ({
    // 接口返回的原始数据
    rawRoutes: [],
    routes: [],
    // addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
  }),
  actions: {
    setRawRoutes(v) {
      this.rawRoutes = v;
    },
    setRoutes(routes) {
      // this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes);
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes;
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes;
    },
    getRoutes() {
      const appName = getAppName();

      if (
        appName &&
        import.meta.env.VITE_SUBSYSTEM_ROUTES_OBTAIN_METHOD ===
          SUBSYSTEM.OBTAIN_ROUTES_BY_POST_MESSAGE
      ) {
        const cachedRoutes = JSON.parse($cache.session.get(SESSION_KEYS.ROUTES_CONFIG)) || {};
        return new Promise((resolve) => {
          const routes = cachedRoutes.children ? this.generateRoutes(cachedRoutes) : [];
          resolve(routes);
        });
      }

      const params = { systemPath: appName };
      // 向后端请求路由数据
      return getRouters(params).then((res) => {
        return this.generateRoutes(res.data);
      });
    },
    generateRoutes(rawRoutes) {
      this.setRawRoutes(rawRoutes);
      const appName = getAppName();
      if (!appName) return [];

      $cache.session.set(SESSION_KEYS.APP_NAME, rawRoutes.path);
      $cache.session.set(SESSION_KEYS.APP_TITLE, rawRoutes.meta?.title);
      const currentRoutes = rawRoutes.children || [];
      if (!currentRoutes.length) return [];

      /**
       * 
      const formattedRoutes = currentRoutes.map((route) => {
        if (!appName.startsWith('http')) {
          route.path = `/${appName}${route.path}`;
        }
        return route;
      });
       */
      const formattedRoutes = currentRoutes;
      const formattedRoutesString = JSON.stringify(formattedRoutes);

      const defaultRoutes = filterAsyncRouter(JSON.parse(formattedRoutesString));
      const sidebarRoutes = filterAsyncRouter(JSON.parse(formattedRoutesString));
      const rewriteRoutes = filterAsyncRouter(JSON.parse(formattedRoutesString), false, true);
      const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
      asyncRoutes.forEach((route) => {
        router.addRoute(route);
      });

      this.setRoutes(rewriteRoutes);
      this.setDefaultRoutes(sidebarRoutes);
      this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
      this.setTopbarRoutes(defaultRoutes);
      return rewriteRoutes;
    },
  },
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout;
      } else if (route.component === 'ParentView') {
        route.component = ParentView;
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route['children'];
      delete route['redirect'];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  let children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c) => {
          c.path = el.path + '/' + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path;
      if (el.children && el.children.length) {
        children = children.concat(filterChildren(el.children, el));
        return;
      }
    }
    children = children.concat(el);
  });
  return children;
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = [];
  routes.forEach((route) => {
    if (route.permissions) {
      if ($permission.hasAny(route.permissions)) {
        res.push(route);
      }
    } else if (route.roles) {
      if ($rolePermission.hasAny(route.roles)) {
        res.push(route);
      }
    }
  });
  return res;
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
};

export default usePermissionStore;
