const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`
╔════════════════════════════════════════╗
║     🌙 RedNight Bot - Online 🌙       ║
╠════════════════════════════════════════╣
║  Bot: ${client.user.tag.padEnd(30)} ║
║  Servers: ${String(client.guilds.cache.size).padEnd(27)} ║
║  Users: ${String(client.users.cache.size).padEnd(29)} ║
║  Commands: ${String(client.commands.size).padEnd(26)} ║
╚════════════════════════════════════════╝
        `);

        const activityType = client.config.bot.activity.type.toLowerCase();
        const activityTypes = {
            playing: ActivityType.Playing,
            watching: ActivityType.Watching,
            listening: ActivityType.Listening,
            competing: ActivityType.Competing,
            streaming: ActivityType.Streaming
        };

        client.user.setPresence({
            activities: [{
                name: client.config.bot.activity.text,
                type: activityTypes[activityType] || ActivityType.Watching
            }],
            status: client.config.bot.status
        });

        const statuses = [
            { name: client.config.bot.activity.text, type: activityTypes[activityType] },
            { name: `${client.config.bot.prefix}help`, type: ActivityType.Listening },
            { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching },
            { name: 'RedNight Project', type: ActivityType.Playing }
        ];

        let currentStatus = 0;
        setInterval(() => {
            currentStatus = (currentStatus + 1) % statuses.length;
            client.user.setActivity(statuses[currentStatus]);
        }, 30000);
    }
};