import { Events, Status, GatewayDispatchEvents } from "discord.js";

// const { Events, Status } = Constants;

const adapters = new Map();
const trackedClients = new Set();
const trackedShards = new Map();


function trackClient(client) {

    if (trackedClients.has(client)) return;
    trackedClients.add(client);

    client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (payload) => {
        adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
    });

    client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (payload) => {
        if (payload.guild_id && payload.session_id && payload.user_id === client.user?.id) {
            adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
        }
    });

    client.on(Events.ShardDisconnect, (_, shardId) => {
        const guilds = trackedShards.get(shardId);
        if (guilds) {
            for (const guildID of guilds.values()) {
                adapters.get(guildID)?.destroy();
            }
        }
        trackedShards.delete(shardId);
    });
}

function trackGuild(guild) {
    let guilds = trackedShards.get(guild.shardId);
    if (!guilds) {
        guilds = new Set();
        trackedShards.set(guild.shardId, guilds);
    }
    guilds.add(guild.id);
}

export function createDiscordJSAdapter(channel) {
    return (methods) => {
        adapters.set(channel.guild.id, methods);
        trackClient(channel.client);
        trackGuild(channel.guild);
        return {
            sendPayload(data) {
                if (channel.guild.shard.status === Status.Ready) {
                    channel.guild.shard.send(data);
                    return true;
                }
                return false;
            },
            destroy() {
                return adapters.delete(channel.guild.id);
            },
        };
    };
}