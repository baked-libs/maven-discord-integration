const discord = require('discord.js')
const MAX_MESSAGE_LENGTH = 40

module.exports.send = (id, token, repo, branch, url, commits, size, report) => new Promise((resolve, reject) => {
    const client
    console.log("Preparing Webhook...")
    try {
        client = new discord.WebhookClient(id, token)
    }
    catch (error) {
        reject(error.message)
        return
    }

    client.send(createEmbed(repo, branch, url, commits, size, report)).then(() => {
        console.log("Successfully sent the message!")
        resolve()
    }, reject)
})

function createEmbed(repo, branch, url, commits, size, report) {
    console.log("Constructing Embed...")
    const latest = commits[0]

    const embed = new discord.RichEmbed()
                .setColor(getEmbedColor(report))
                //.setTitle(size + (size == 1 ? " Commit was " : " Commits were ") + "added to " + repo + " (" + branch + ")")
                .setTitle(size + (size == 1 ? " Commit was " : " Commits were ") + "added to " + banch)
                .setDescription(getChangeLog(commits, size))
                .setTimestamp(Date.parse(latest.timestamp))

    if (report.tests.length > 0) { appendTestResults(embed, report) }
    return embed
}

function getChangeLog(commits, size) {
    const changelog = ""
    for (const i in commits) {
        if (i > 3) {
            changelog += `+ ${size - i} more...\n`
            break
        }

        const commit = commits[i];
        const sha = commit.id.substring(0, 6)
        const message = commit.message.length > MAX_MESSAGE_LENGTH ? (commit.message.substring(0, MAX_MESSAGE_LENGTH) + "..."): commit.message
        changelog += `[\`${sha}\`](${commit.url}) — ${message} \n`
    }

    return changelog
}

