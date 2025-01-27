import chalk from 'chalk';
import figlet from 'figlet';

const DEFAULT_BANNER = 'create-way-admin';

export function showBanner() {
  console.log(
    chalk.greenBright.bold(
      figlet.textSync(DEFAULT_BANNER, {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
        whitespaceBreak: true,
      }),
    ),
  );
}
