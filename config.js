import dotenv from 'dotenv';
import os from 'os';

// Load environment variables
dotenv.config();

export const config = {
  // Owner Configuration
  OWNER_NUMBER: process.env.OWNER_NUMBER || '94701234567',
  OWNER_NAME: process.env.OWNER_NAME || 'SMILE',
  
  // Bot Configuration
  BOT_NAME: process.env.BOT_NAME || '𝙻𝚈𝙽𝚇 𝙼𝙳',
  PREFIX: process.env.PREFIX || '.',
  PACKNAME: process.env.PACKNAME || 'LYNX-MD',
  AUTHOR: process.env.AUTHOR || 'SMILE',
  
  // Paths
  SESSION_FOLDER: './session',
  DATABASE_FOLDER: './database',
  MEDIA_FOLDER: './media',
  TEMP_FOLDER: './temp',
  PLUGINS_FOLDER: './plugins',
  
  // Modes & Features
  MODE: process.env.MODE || 'public', // public, private, owner
  AUTO_READ: process.env.AUTO_READ === 'true',
  AUTO_TYPING: process.env.AUTO_TYPING === 'true',
  AUTO_REACT: process.env.AUTO_REACT === 'true',
  AUTO_STATUS: process.env.AUTO_STATUS === 'true',
  
  // Bot Info
  DEVELOPER_NAME: process.env.DEVELOPER_NAME || 'SMILE',
  VERSION: process.env.VERSION || '1.0.0',
  
  // System Info
  NODE_VERSION: process.version,
  PLATFORM: os.platform(),
  ARCH: os.arch(),
  
  // API & External
  RAPID_KEY: process.env.RAPID_KEY || '',
  OPENAI_KEY: process.env.OPENAI_KEY || '',
};

export default config;
