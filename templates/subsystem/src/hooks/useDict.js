import useDictStore from '@/store/modules/dict';
import { getDicts } from '@/api';

const cache = {};

function formatDict(data) {
  return data.map((p) => ({
    label: p.dictLabel,
    value: p.dictValue,
    elTagType: p.listClass,
    elTagClass: p.cssClass,
  }));
}

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else if (cache[dictType]) {
        cache[dictType].then((resp) => {
          res.value[dictType] = formatDict(resp.data);
        });
      } else {
        const p = getDicts(dictType);
        cache[dictType] = p;
        p.then((resp) => {
          res.value[dictType] = formatDict(resp.data);
          useDictStore().setDict(dictType, res.value[dictType]);
        });
      }
    });
    return toRefs(res.value);
  })();
}
