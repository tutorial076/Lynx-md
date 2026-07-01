import chalk from 'chalk';
import moment from 'moment';

/**
 * Logger utility for console output with timestamps and colors
 */
export class Logger {
  static info(message) {
    console.log(`${chalk.cyan(`[${moment().format('HH:mm:ss')}]`)} ${chalk.blue('ℹ')} ${message}`);
  }

  static success(message) {
    console.log(`${chalk.cyan(`[${moment().format('HH:mm:ss')}]`)} ${chalk.green('✓')} ${message}`);
  }

  static warn(message) {
    console.log(`${chalk.cyan(`[${moment().format('HH:mm:ss')}]`)} ${chalk.yellow('⚠')} ${message}`);
  }

  static error(message) {
    console.error(`${chalk.cyan(`[${moment().format('HH:mm:ss')}]`)} ${chalk.red('✗')} ${message}`);
  }

  static debug(message) {
    if (process.env.DEBUG === 'true') {
      console.log(`${chalk.cyan(`[${moment().format('HH:mm:ss')}]`)} ${chalk.magenta('◆')} ${message}`);
    }
  }
}

export default Logger;
