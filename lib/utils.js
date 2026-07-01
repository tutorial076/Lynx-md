import os from 'os';
import moment from 'moment';

/**
 * Utility functions for bot operations
 */
export class Utils {
  static formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  static getRAMUsage() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const percentage = ((usedMem / totalMem) * 100).toFixed(2);
    return `${this.formatSize(usedMem)} / ${this.formatSize(totalMem)} (${percentage}%)`;
  }

  static getCPUUsage() {
    const cpus = os.cpus();
    return `${cpus.length} cores`;
  }

  static getUptime(startTime) {
    const uptime = Date.now() - startTime;
    const duration = moment.duration(uptime);
    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  }

  static getTime() {
    return moment().format('HH:mm:ss');
  }

  static getDate() {
    return moment().format('DD/MM/YYYY');
  }

  static isOwner(number, ownerNumber) {
    return number === ownerNumber || number === `${ownerNumber}@s.whatsapp.net`;
  }

  static formatPhoneNumber(number) {
    return number.replace(/[^0-9]/g, '');
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static parseArgs(text, prefix) {
    const args = text.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    return { command, args, fullText: text.slice(prefix.length).trim() };
  }
}

export default Utils;
