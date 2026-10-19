require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,      // privileged: enable "Server Members Intent" in the developer portal
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,     // XP from chatting (message content is NOT needed)
  ],
});

/* ---- Load commands: every file in ./commands exports { data, execute } ---- */
client.commands = new Collection();
client.buttons = new Collection(); // customId prefix -> command that handles it

const commandsDir = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsDir).filter((f) => f.endsWith('.js'))) {
  const command = require(path.join(commandsDir, file));
  if (!command?.data || typeof command.execute !== 'function') {
    console.warn(`[WARN] ${file} is missing "data" or "execute", skipping.`);
    continue;
  }
  const name = command.data.name;
  if (client.commands.has(name)) {
    console.warn(`[WARN] Duplicate command "${name}" in ${file}, skipping.`);
    continue;
  }
  client.commands.set(name, command);
  if (command.buttonPrefix) client.buttons.set(command.buttonPrefix, command);
}

/* ---- Load events: every file in ./events exports { name, once?, execute } ---- */
const eventsDir = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsDir).filter((f) => f.endsWith('.js'))) {
  const event = require(path.join(eventsDir, file));
  const handler = (...args) => Promise.resolve(event.execute(...args)).catch((e) => console.error(`Error in event ${event.name}:`, e));
  if (event.once) client.once(event.name, handler); else client.on(event.name, handler);
}

process.on('unhandledRejection', (err) => console.error('Unhandled rejection:', err));
client.login(process.env.DISCORD_TOKEN);
