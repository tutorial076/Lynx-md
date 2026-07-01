import { Utils } from './lib/utils.js';
import { Logger } from './lib/logger.js';
import config from './config.js';

/**
 * Message Handler
 * Routes messages to appropriate plugins based on commands and prefix
 */
export async function handleMessage(smile, msg, pluginLoader) {
  try {
    // Skip if no text
    if (!msg.message?.conversation && !msg.message?.extendedTextMessage?.text) {
      return;
    }

    // Get message text
    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';

    // Get sender info
    const sender = msg.key.remoteJid;
    const isGroup = sender.endsWith('@g.us');
    const senderNumber = sender.split('@')[0];
    const isOwner = Utils.isOwner(senderNumber, config.OWNER_NUMBER);

    // Auto read messages
    if (config.AUTO_READ) {
      try {
        await smile.readMessages([msg.key]);
      } catch (error) {
        Logger.debug(`Auto-read error: ${error.message}`);
      }
    }

    // Auto typing indicator
    if (config.AUTO_TYPING) {
      try {
        await smile.sendPresenceUpdate('composing', sender);
      } catch (error) {
        Logger.debug(`Typing indicator error: ${error.message}`);
      }
    }

    // Check if message starts with prefix
    if (!text.startsWith(config.PREFIX)) {
      return;
    }

    // Parse command and arguments
    const { command, args } = Utils.parseArgs(text, config.PREFIX);

    // Get plugin
    const plugin = pluginLoader.getPlugin(command);

    if (!plugin) {
      return;
    }

    // Check access mode
    if (plugin.owner && !isOwner) {
      await smile.sendMessage(sender, {
        text: '❌ This command is for owner only',
      });
      return;
    }

    if (config.MODE === 'private' && !isOwner) {
      await smile.sendMessage(sender, {
        text: '🔒 Bot is in private mode',
      });
      return;
    }

    if (plugin.group && !isGroup) {
      await smile.sendMessage(sender, {
        text: '❌ This command only works in groups',
      });
      return;
    }

    // Execute plugin
    try {
      Logger.debug(`Executing ${command} by ${senderNumber}`);
      await plugin.execute(smile, msg, args, config);

      // Auto react
      if (config.AUTO_REACT) {
        try {
          await smile.sendMessage(sender, {
            react: {
              text: '✓',
              key: msg.key,
            },
          });
        } catch (error) {
          Logger.debug(`Auto-react error: ${error.message}`);
        }
      }
    } catch (error) {
      Logger.error(`Plugin execution error (${command}): ${error.message}`);
      await smile.sendMessage(sender, {
        text: `❌ Error executing command: ${error.message}`,
      });
    }
  } catch (error) {
    Logger.error(`Handler error: ${error.message}`);
  }
}

export default handleMessage;
