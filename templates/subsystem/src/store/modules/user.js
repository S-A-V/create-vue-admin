import { defineStore } from 'pinia';
import { $token } from 'way-ui';
import { getInfo } from '@/api';
import defAva from '@/assets/images/profile.png';

const useUserStore = defineStore('user', {
  state: () => ({
    token: $token.get(),
    id: '',
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
  }),
  actions: {
    setToken(token) {
      this.token = token;
      $token.set(token);
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(({ data }) => {
            const res = data;
            const user = res.user;
            const avatar =
              user.avatar == '' || user.avatar == null
                ? defAva
                : import.meta.env.VITE_APP_BASE_API + user.avatar;
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.roles;
              this.permissions = res.permissions;
            } else {
              this.roles = ['ROLE_DEFAULT'];
            }
            this.id = user.userId;
            this.name = user.userName;
            this.avatar = avatar;
            resolve(res);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        this.token = '';
        this.roles = [];
        this.permissions = [];
        $token.remove();
        resolve();
      });
    },
  },
});

export default useUserStore;
