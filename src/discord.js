const discord = require('discord.js')
const {MessageEmbed} = require("discord.js")
const MAX_MESSAGE_LENGTH = 40

module.exports.send = (id, token, repo, branch, url, commits, size) =>
    new Promise((resolve, reject) => {
        let client
        console.log('Preparing Webhook...')
        try {
            client = new discord.WebhookClient({id: id, token: token})
        } catch (error) {
            console.log('Error creating Webhook')
            reject(error.message)
            return
        }

        client.send({embeds: [createEmbed(repo, branch, url, commits, size)]}).then(() => {
            console.log('Successfully sent the message!')
            resolve()
        }, reject)
    })

function createEmbed(repo, branch, url, commits, size) {
    console.log('Constructing Embed...')
    const latest = commits[0]
    return new MessageEmbed()
        .setColor(0x00bb22)
        //.setTitle(size + (size == 1 ? " Commit was " : " Commits were ") + "added to " + repo + " (" + branch + ")")
        .setTitle(`${size} ${size === 1 ? 'commit was ' : 'commits were'} added to ${branch}`)
        .setDescription(`${getChangeLog(commits, size)}`)
        .setTimestamp(Date.parse(latest.timestamp))
        .setFooter({
            text: `⚡ Edited by @${commits[0].author.username}`,
        })
}


function getChangeLog(commits, size) {
    var changelog = ''
    for (var i in commits) {
        if (i > 7) {
            changelog += `+ ${size - i} more...\n`
            break
        }

        var commit = commits[i]
        var sha = commit.id.substring(0, 6)
        var message =
            commit.message.length > MAX_MESSAGE_LENGTH
                ? commit.message.substring(0, MAX_MESSAGE_LENGTH) + '...'
                : commit.message
        changelog += `[\`${sha}\`](${commit.url}) — ${message}\n`
    }

    return changelog
}
