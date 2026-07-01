import {
  default as makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  isJidBroadcast,
} from '@whiskeysockets/baileys';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import moment from 'moment';
import { fileURLToPath } from 'url';

import config from './config.js';
import { Logger } from './lib/logger.js';
import { Utils } from './lib/utils.js';
import { PluginLoader } from './lib/pluginLoader.js';
import handleMessage from './handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start time for uptime calculation
const startTime = Date.now();

// Plugin loader instance
const pluginLoader = new PluginLoader(config.PLUGINS_FOLDER);

/**
 * Display startup console banner
 */
function displayBanner() {
  console.clear();
  console.log(
    chalk.cyan(`
██╗     ██╗   ██╗███╗   ██╗██╗  ██╗
██║     ╚██╗ ██╔╝████╗  ██║╚██╗██╔╝
██║      ╚████╔╝ ██╔██╗ ██║ ╚███╔╝
██║       ╚██╔╝  ██║╚██╗██║ ██╔██╗
███████╗   ██║   ██║ ╚████║██╔╝ ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═══╝╚═╝  ╚═╝
    `)
  );
  console.log(
    chalk.bold.green(`╔═══════════════════════════════════════════════════════════╗`)
  );
  console.log(chalk.bold.green(`║`) + chalk.cyan.bold(`          🌟 LYNX MD - WhatsApp Bot 🌟`) + chalk.bold.green(`         ║`));
  console.log(chalk.bold.green(`╚═══════════════════════════════════════════════════════════╝`));
  console.log(`\n`);
}

/**
 * Initialize connection and start bot
 */
async function startBot() {
  displayBanner();

  try {
    // Ensure required folders exist
    fs.ensureDirSync(config.SESSION_FOLDER);
    fs.ensureDirSync(config.DATABASE_FOLDER);
    fs.ensureDirSync(config.MEDIA_FOLDER);
    fs.ensureDirSync(config.TEMP_FOLDER);
    fs.ensureDirSync(config.PLUGINS_FOLDER);

    Logger.info(`Bot Name: ${config.BOT_NAME}`);
    Logger.info(`Developer: ${config.DEVELOPER_NAME}`);
    Logger.info(`Version: ${config.VERSION}`);
    Logger.info(`Mode: ${config.MODE}`);
    Logger.info(`Prefix: ${config.PREFIX}`);
    Logger.info('');

    // Load authentication state
    Logger.info('Loading authentication state...');
    const { state, saveCreds } = await useMultiFileAuthState(
      config.SESSION_FOLDER
    );

    // Create WhatsApp connection
    Logger.info('Connecting to WhatsApp...');
    const smile = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: {
        level: 'silent',
      },
      browser: ['Ubuntu', 'Chrome', '120.0.0.0'],
      syncFullHistory: false,
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      shouldIgnoreJid: (jid) => isJidBroadcast(jid),
    });

    // Connection update handler
    smile.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        Logger.warn('QR Code generated - scan with WhatsApp');
      }

      if (connection === 'open') {
        Logger.success('✓ Connected to WhatsApp!');
        displayConnected(smile);
      } else if (connection === 'close') {
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          Logger.warn('Connection closed! Attempting to reconnect...');
          setTimeout(() => startBot(), 5000);
        } else {
          Logger.error('Connection closed permanently. Please re-authenticate.');
        }
      }

      if (update.receivedPendingNotifications) {
        Logger.info('Syncing messages...');
      }
    });

    // Message update handler
    smile.ev.on('messages.upsert', async (m) => {
      try {
        const message = m.messages[0];

        if (!message.message) return;

        // Handle messages
        await handleMessage(smile, message, pluginLoader);
      } catch (error) {
        Logger.error(`Message handler error: ${error.message}`);
      }
    });

    // Credentials update handler
    smile.ev.on('creds.update', saveCreds);

    // Load plugins
    Logger.info('Loading plugins...');
    await pluginLoader.loadPlugins();
    Logger.success(`✓ ${pluginLoader.getPluginCount()} plugins loaded`);

    // Register store update events (for database persistence)
    smile.ev.on('contacts.update', (contacts) => {
      Logger.debug(`Contacts updated: ${contacts.length}`);
    });

    smile.ev.on('chats.delete', async (chats) => {
      Logger.debug(`${chats.length} chats deleted`);
    });
  } catch (error) {
    Logger.error(`Startup error: ${error.message}`);
    setTimeout(() => startBot(), 5000);
  }
}

/**
 * Display connection info
 */
async function displayConnected(smile) {
  try {
    const user = smile.user;
    if (user) {
      Logger.info(`Logged in as: ${user.name}`);
      Logger.info(`JID: ${user.id}`);
      Logger.info(`Number: +${user.id.split(':')[0]}`);
    }

    Logger.info('');
    Logger.info(`${chalk.cyan('═').repeat(50)}`);
    Logger.success(
      `Bot is online and ready to receive messages! 🎉`
    );
    Logger.info(`Uptime: ${Utils.getUptime(startTime)}`);
    Logger.info(`RAM Usage: ${Utils.getRAMUsage()}`);
    Logger.info(`Plugins: ${pluginLoader.getPluginCount()}`);
    Logger.info(`${chalk.cyan('═').repeat(50)}`);
    Logger.info('');
  } catch (error) {
    Logger.error(`Display error: ${error.message}`);
  }
}

// Start the bot
startBot().catch((error) => {
  Logger.error(`Fatal error: ${error.message}`);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  Logger.warn('\nShutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  Logger.warn('\nTermination signal received, shutting down...');
  process.exit(0);
});
