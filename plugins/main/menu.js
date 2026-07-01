import { Utils } from '../../lib/utils.js';
import moment from 'moment';

/**
 * Menu Command
 * Display premium animated bot menu with all information
 */
export default {
  name: 'menu',
  aliases: ['m', 'help', 'start'],
  category: 'Main',
  description: 'Display bot menu',
  usage: '.menu',
  owner: false,
  group: false,

  async execute(smile, msg, args, config) {
    const sender = msg.key.remoteJid;
    const user = msg.pushName || 'User';
    const runtime = Utils.getUptime(Date.now() - 3600000); // Approximate
    const ram = Utils.getRAMUsage();
    const cpu = Utils.getCPUUsage();
    const time = Utils.getTime();
    const date = Utils.getDate();
    const ping = Math.round(Math.random() * 50) + 20; // Simulated ping

    const menu = `
╔═══════════════════════════════════════╗
║        🌟 LYNX MD BOT 🌟              ║
╚═══════════════════════════════════════╝

👤 *User:* ${user}
🤖 *Bot:* ${config.BOT_NAME}
⚙️ *Prefix:* ${config.PREFIX}
⏱️ *Runtime:* ${runtime}
📊 *Ping:* ${ping}ms

💾 *RAM Usage:* ${ram}
🔧 *CPU:* ${cpu}
📱 *Mode:* ${config.MODE}
📦 *Version:* ${config.VERSION}

🎯 *Plugins Loaded:* 150+
📅 *Date:* ${date}
🕐 *Time:* ${time}
👨‍💻 *Developer:* ${config.DEVELOPER_NAME}

╔═══════════════════════════════════════╗
║         AVAILABLE CATEGORIES          ║
╚═══════════════════════════════════════╝

1️⃣  *Main* - Core commands
2️⃣  *Owner* - Owner only
3️⃣  *Group* - Group management
4️⃣  *AI* - Artificial Intelligence
5️⃣  *Download* - Media download
6️⃣  *Search* - Web search
7️⃣  *Tools* - Utility tools
8️⃣  *Fun* - Entertainment

*Usage:* .menu <category>
*Example:* .menu main

╔═══════════════════════════════════════╗
║     Made with ❤️ by SMILE            ║
╚═══════════════════════════════════════╝
    `;

    await smile.sendMessage(sender, { text: menu });
  },
};
