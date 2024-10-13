const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ0F5SzIwcUpMbG90bFhXclF1ZnJvVkg0OWg3b1lBRXl4eVZjZHlZV0hWZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYktSUGtqOEljMy81NWRId3JEenBIVXJCbUlBSGloNWVpeDd6L2o1eiszST0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJXTHFYeDBlcFo0bEtYSVdRcW5jcXZmN0FFQXlucGtKczFTWU83VXZja1YwPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHM003L3JlY3ZxV2ROU3pmdzdOUUlQRXRaazYxREcxanorMnlNM09LL2hnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldIME05Vkd2RmFqQm5QSmgxZ2ZGRE5rczlQNXFtYnlBQVlYcnRvaXBlbVk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ikk1cEVCZnp4U3BCaG9EUWx4dFR6R2hEZXlTQzV6QWtsQzE0WDE0cTJOU0k9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS0M4T3ZRbFQ2V2NOZm0zTFUrN1M0VnBlWThNTlF0MjNMTFdieTBrUkRFTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidDc1UG9SZEFLcENzbkFteVFtTEdCcFlpaE83MzhhYkN4SEVrVzFuNHdscz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1xUkJvbXVucENwRTB2N0NtQmFWSjdZb1Z4UVdrZFJEYXlJTkRqeUhxSUczQ3VqeFUvczN6TG56UnphbXVwYVJKYkd0VEVkVTdVcHVBQ3c4cVZBQmhBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjUsImFkdlNlY3JldEtleSI6IjFpK3I1aWpCT0ZFcTJHS1NVRnZRUVIrUlllc0FueXJWd1k4WTlZUnI4Zlk9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IjJuQ0l1SmVhU2xhMm9TZWxRWWJsbVEiLCJwaG9uZUlkIjoiODhhMTFmOTMtOWEwNS00ZjRmLWFiNTctN2FmNWFjMTBiYjE1IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImhrbHdISmp1SUFtbkRjbXZvR1ZZaWtUN2ZVVT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ3YnZ6a0I4RXJPdGthekpyUEpUYnFFSjk2cWc9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiWFQzS1JGNlIiLCJtZSI6eyJpZCI6IjI1NDc2OTM2NTYxNzoyMEBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSmJmL0owQkVQWHVzTGdHR0FZZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiOXM4N2hGQUZuaEtWbFBsS2tMMnI5Ujg2bmVRcC8xRTZFeFZHZUpDdzJtdz0iLCJhY2NvdW50U2lnbmF0dXJlIjoianIweTBHZnpqc2NlaGp0K294ZmtjR08ySDhLNzFMcHFHL2dWZ2V2K2RlSlZqRzMyQUZoanAxTDAyTFh0R0ZmMGViNWlvV3Ryc0lxRkVsSUE1RkdqQ0E9PSIsImRldmljZVNpZ25hdHVyZSI6Im5HemF3cndJZ2tGbE1JWlJnWDh2dHZyYXRxVHZhQk9zUkJCcUZGQWZmN1VYekNLMjc4dmFSOVdmRk1NR3Y0UVZiM2dwQW1oNUxycEJmR2ZkRFg1YmlnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzY5MzY1NjE3OjIwQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmZiUE80UlFCWjRTbFpUNVNwQzlxL1VmT3Aza0tmOVJPaE1WUm5pUXNOcHMifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3Mjg4NTM4OTAsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBUDIxIn0=',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "Jinwiil",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254769365617",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'off',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
