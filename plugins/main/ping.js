/**
 * Ping Command
 * Check bot's response time and latency
 */
export default {
  name: 'ping',
  aliases: ['p', 'latency'],
  category: 'Main',
  description: 'Check bot latency',
  usage: '.ping',
  owner: false,
  group: false,

  async execute(smile, msg, args, config) {
    const before = Date.now();
    const { key } = msg;

    const sentMsg = await smile.sendMessage(msg.key.remoteJid, {
      text: '🏓 Pong!',
    });

    const after = Date.now();
    const latency = after - before;

    await smile.sendMessage(msg.key.remoteJid, {
      text: `🏓 *Pong*\n\nLatency: *${latency}ms*`,
    });
  },
};
