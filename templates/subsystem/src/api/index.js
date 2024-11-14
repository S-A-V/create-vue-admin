import request from '@/utils/request';

// 刷新 token
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post',
  });
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'post',
  });
}

// 获取路由
export function getRouters(data) {
  return request({
    url: '/system/menu/getRouters',
    method: 'post',
    data,
  });
}

// 根据字典类型，查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/getByDictType',
    method: 'post',
    data: { dictType },
  });
}
