import { ElMessage, ElLoading } from 'element-plus';
import { ERROR_CODE_MESSAGES } from '@way-ui/constants';
import { blobValidate } from '@way-ui/utils/way';
import { saveAs } from 'file-saver';
import service from './request';
let downloadLoadingInstance;
// 通用下载方法
function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  return service
    .post(url, params, {
      // transformRequest: [
      //   (params) => {
      //     return tansParams(params);
      //   },
      // ],
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob',
      ...config,
    })
    .then(async (data) => {
      const isBlob = blobValidate(data);
      if (isBlob) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        const errMsg =
          ERROR_CODE_MESSAGES[rspObj.code] || rspObj.msg || ERROR_CODE_MESSAGES['default'];
        ElMessage.error(errMsg);
      }
      downloadLoadingInstance.close();
    })
    .catch((r) => {
      console.error(r);
      ElMessage.error('下载文件出现错误，请联系管理员！');
      downloadLoadingInstance.close();
    });
}
export default download;
