import { fileURLToPath } from 'node:url';
import path from 'path';
import fs from 'fs-extra';
import shell from 'shelljs';
import ora from 'ora';
import chalk from 'chalk';

/**
 * 测试路径
 */
function testPath() {
  const cwd = process.cwd();
  console.table({
    'import.meta.url': import.meta.url,
    'fileURLToPath(import.meta.url)': fileURLToPath(import.meta.url),
    '----------': '----------',
    cwd: cwd,
    [`path.join(cwd, '/package.json')`]: path.join(cwd, '/package.json'),
    [`path.resolve(cwd, '/package.json')`]: path.resolve(cwd, '/package.json'),
  });
  shell.exit(1);
}

// testPath();

export function generateBranchName() {
  return `branch-${+new Date()}`;
}

export function updatePackageJson(file, pkg) {
  const pkgInfo = fs.readJsonSync(file);
  fs.outputJsonSync(file, { ...pkgInfo, ...pkg }, { spaces: 2 });
}

export function showDoneInfo(dir) {
  console.log('  项目初始化完成，可执行以下命令：');
  console.log();
  console.log(chalk.greenBright(`  cd ${dir}`));
  console.log(chalk.greenBright('  pnpm install'));
  console.log(chalk.greenBright('  pnpm dev'));
  console.log();
}

export function emptyDir(dir) {
  if (!fs.existsSync(dir)) return;
  const spinner = ora('正在清理文件夹...').start();

  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') continue;
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }

  spinner.stop();
}

export function copyDir(src, dest) {
  const spinner = ora(`正在初始化项目 ${dest}...`).start();
  try {
    fs.copySync(src, dest, { overwrite: true });
    spinner.stopAndPersist();
  } catch (error) {
    spinner.fail(chalk.redBright(error));
    shell.exit(1);
  }
}

export function cleanupTempDir(dir) {
  const spinner = ora('正在清理临时文件...').start();
  try {
    fs.removeSync(dir);
    spinner.stop();
  } catch (error) {
    spinner.fail(chalk.redBright(error));
    shell.exit(1);
  }
}
