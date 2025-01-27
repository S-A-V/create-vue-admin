export const DEFAULT_TARGET_DIR = 'vite-project';

// 模板文件夹
export const TEMPLATES_FOLDER = 'templates';

// 项目类型
export const PROJECT_TYPE_MAP = {
  PORTAL: 'portal',
  SUBSYSTEM: 'subsystem',
};

export const PROJECT_TYPES = [
  { name: '门户', value: PROJECT_TYPE_MAP.PORTAL },
  { name: '子系统', value: PROJECT_TYPE_MAP.SUBSYSTEM },
];

// 仓库地址
export const REPO_URL = 'http://10.88.99.112/DefaultCollection/ChisFrame/_git/ChisFrame';

// 仓库克隆后的本地目录名
export const TEMP_FOLDER = 'temp';

// v1.0.0 的模板路径
export const TEMPLATE_PATH_ARCHIVE = {
  [PROJECT_TYPE_MAP.PORTAL]: 'chis-way/way-admin-ui',
  [PROJECT_TYPE_MAP.SUBSYSTEM]: 'chis-way/way-admin-templates/subsystem',
};

// v1.0.0 之后版本的模板路径
export const TEMPLATE_PATH = {
  [PROJECT_TYPE_MAP.PORTAL]: 'way-admin-ui',
  [PROJECT_TYPE_MAP.SUBSYSTEM]: 'way-admin-templates/subsystem',
};
