const discord = require('discord.js')
const MAX_MESSAGE_LENGTH = 40

module.exports.send = (id, token, repo, branch, url, commits, size) => new Promise((resolve, reject) => {
    var client
    console.log("Preparing Webhook...")
    try {
        client = new discord.WebhookClient(id, token)
    }
    catch (error) {
        reject(error.message)
        return
    }

    client.send(createEmbed(repo, branch, url, commits, size)).then(() => {
        console.log("Successfully sent the message!")
        resolve()
    }, reject)
})

function createEmbed(repo, branch, url, commits, size) {
    console.log("Constructing Embed...")
    var latest = commits[0]

    var embed = new discord.RichEmbed()
                .setColor(0x00BB22)
                //.setTitle(size + (size == 1 ? " Commit was " : " Commits were ") + "added to " + repo + " (" + branch + ")")
                .setTitle(size + (size == 1 ? " commit was " : " commits were ") + "added to " + branch)
                .setDescription(getChangeLog(commits, size))
                .setTimestamp(Date.parse(latest.timestamp))
                .setFooter(`⚡ Edited by @${commits[0].author.username}`)

    return embed
}

function getChangeLog(commits, size) {
    var changelog = ""
    for (var i in commits) {
        if (i > 7) {
            changelog += `+ ${size - i} more...\n`
            break
        }

        var commit = commits[i];
        var sha = commit.id.substring(0, 6)
        var message = commit.message.length > MAX_MESSAGE_LENGTH ? (commit.message.substring(0, MAX_MESSAGE_LENGTH) + "..."): commit.message
        changelog += `[\`${sha}\`](${commit.url}) — ${message}\n`
    }

    return changelog
}
