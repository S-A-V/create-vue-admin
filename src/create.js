import { input, confirm, select } from '@inquirer/prompts';
import path from 'path';
import fs from 'fs-extra';
import shell from 'shelljs';
import logSymbols from 'log-symbols';

import { DEFAULT_TARGET_DIR, TEMP_FOLDER, TEMPLATE_PATH } from './constants.js';
import {
  updatePackageJson,
  showDoneInfo,
  emptyDir,
  copyDir,
  cleanupTempDir,
} from './utils/index.js';
import { validateAppName } from './utils/validate.js';
import { gitClone, gitTag, gitCheckoutToTag } from './utils/git.js';

export default async function create() {
  const appName = await input({
    message: '请输入项目名称：',
    default: DEFAULT_TARGET_DIR,
    required: true,
    validate(value) {
      if (!validateAppName(value)) return '仅支持大小写字母、数字和连字符（-）';
      return true;
    },
  });

  const cwd = process.cwd();
  const targetDir = appName.trim();
  const root = path.join(cwd, targetDir);

  if (fs.existsSync(targetDir)) {
    const answer = await confirm({
      message: `目标文件夹 ${targetDir} 非空，是否覆盖？`,
    });
    if (answer) {
      emptyDir(root);
    } else {
      console.log();
      console.log(logSymbols.warning, '操作取消');
      shell.exit(1);
    }
  }

  gitClone(targetDir);
  const tags = gitTag(targetDir);
  let selectedTag = null;

  if (tags.length) {
    const answer = await select({
      message: '请选择版本号：',
      choices: tags.reverse().map((tag) => {
        return {
          name: tag,
          value: tag,
        };
      }),
      pageSize: 10,
      loop: false,
    });
    selectedTag = answer;
  } else {
    shell.exit(1);
  }

  gitCheckoutToTag(targetDir, selectedTag);
  shell.cd(root);

  console.log();
  copyDir(path.resolve(root, TEMP_FOLDER, TEMPLATE_PATH), root);
  updatePackageJson(path.resolve(root, 'package.json'), {
    name: appName.trim(),
    version: '0.0.0',
    description: '',
  });
  cleanupTempDir(path.join(root, TEMP_FOLDER));

  console.log();
  showDoneInfo(targetDir);
}
