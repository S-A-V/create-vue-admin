import path from 'path';
import shell from 'shelljs';
import ora from 'ora';
import chalk from 'chalk';

import { TEMP_FOLDER, REPO_URL } from '../constants.js';

export function gitClone(projectDir) {
  const targetDir = path.join(projectDir, TEMP_FOLDER);
  const command = `git clone -c core.longpaths=true ${REPO_URL} ${targetDir}`;
  // const command = `git clone ${REPO_URL} ${targetDir}`;
  const spinner = ora('正在加载资源...').start();
  const { code, stdout, stderr } = shell.exec(command, { silent: true });
  if (code !== 0) {
    spinner.fail(chalk.redBright(stderr));
    shell.exit(1);
  } else {
    // spinner.succeed(chalk.greenBright("项目创建成功"));
    spinner.stop();
  }
  // console.log("clone", { code, stdout });
}

export function gitTag(projectDir) {
  const targetDir = path.join(projectDir, TEMP_FOLDER);
  shell.cd(targetDir);
  const command = 'git tag';
  const spinner = ora('正在获取版本号...').start();
  const { code, stdout, stderr } = shell.exec(command, { silent: true });
  if (code !== 0) {
    spinner.fail(chalk.redBright(stderr));
    shell.exit(1);
  } else {
    spinner.stop();
  }
  return stdout.trim().split('\n');
}

export function gitCheckoutToTag(projectDir, tagName) {
  // const targetDir = path.join(projectDir, TEMP_FOLDER);
  // shell.cd(targetDir);
  const command = `git checkout tags/${tagName}`;
  const spinner = ora('正在加载资源...').start();
  const { code, stdout, stderr } = shell.exec(command, { silent: true });
  if (code !== 0) {
    spinner.fail(chalk.redBright(stderr));
    shell.exit(1);
  } else {
    spinner.stop();
  }
}
