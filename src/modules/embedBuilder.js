const { EmbedBuilder } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.load(fs.readFileSync('./config/config.yml', 'utf8'));

class EmbedUtility {
    static create(type = 'info') {
        const colors = {
            success: config.colors.success,
            error: config.colors.error,
            warning: config.colors.warning,
            info: config.colors.info,
            primary: config.colors.primary
        };

        return new EmbedBuilder()
            .setColor(colors[type] || colors.info)
            .setTimestamp()
            .setFooter({ text: 'RedNight Project' });
    }

    static success(description) {
        return this.create('success')
            .setDescription(`${config.emojis.success} ${description}`);
    }

    static error(description) {
        return this.create('error')
            .setDescription(`${config.emojis.error} ${description}`);
    }

    static warning(description) {
        return this.create('warning')
            .setDescription(`${config.emojis.warning} ${description}`);
    }

    static info(description) {
        return this.create('info')
            .setDescription(`${config.emojis.info} ${description}`);
    }

    static modLog(action, target, moderator, reason, extraFields = []) {
        const actionEmoji = config.emojis[action.toLowerCase()] || '📋';
        
        const embed = this.create('primary')
            .setTitle(`${actionEmoji} ${action}`)
            .addFields(
                { name: 'Target', value: `${target.tag} (${target.id})`, inline: true },
                { name: 'Moderator', value: `${moderator.tag} (${moderator.id})`, inline: true },
                { name: 'Reason', value: reason || 'No reason provided', inline: false }
            );

        if (extraFields.length > 0) {
            embed.addFields(extraFields);
        }

        if (target.displayAvatarURL) {
            embed.setThumbnail(target.displayAvatarURL({ dynamic: true }));
        }

        return embed;
    }
}

module.exports = EmbedUtility;