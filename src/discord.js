const discord = require('discord.js');
const MAX_MESSAGE_LENGTH = 40;

module.exports.send = (id, token, repo, branch, url, commits, size, report) => new Promise((resolve, reject) => {
    var client;
    console.log("Preparing Webhook...");
    try {
        client = new discord.WebhookClient(id, token);
    }
    catch (error) {
        reject(error.message);
        return;
    }

    client.send(createEmbed(repo, branch, url, commits, size, report)).then(() => {
        console.log("Successfully sent the message!");
        resolve();
    }, reject);
});

function createEmbed(repo, branch, url, commits, size, report) {
    console.log("Constructing Embed...");
    var latest = commits[0];

    var embed = new discord.RichEmbed()
                .setColor(getEmbedColor(report))
                //.setTitle(size + (size == 1 ? " Commit was " : " Commits were ") + "added to " + repo + " (" + branch + ")")
                .setTitle(size + (size == 1 ? " Commit a été ajouté" : " Commits ont été ajoutés") + " en " + branch)
                .setDescription(getChangeLog(commits, size))
                .setTimestamp(Date.parse(latest.timestamp));

    if (report.tests.length > 0) {
        appendTestResults(embed, report);
    }

    return embed;
}

function getChangeLog(commits, size) {
    var changelog = "";

    for (var i in commits) {
        if (i > 3) {
            changelog += `+ ${size - i} plus...\n`;
            break;
        }

        var commit = commits[i];
        var sha = commit.id.substring(0, 6);
        var message = commit.message.length > MAX_MESSAGE_LENGTH ? (commit.message.substring(0, MAX_MESSAGE_LENGTH) + "..."): commit.message;
        changelog += `\`${sha}\` — ${message} \n`;
    }

    return changelog;
}

function getEmbedColor(report) {
    if (report.status === "FAILURE") {
        return 0xE80000;
    }

    if (report.tests.length > 0) {
        var skipped = 0;
        var failures = 0;

        for (var i in report.tests) {
            var status = report.tests[i].status;
            if (status === "SKIPPED") skipped++;
            if (status === "FAILURE" || status === "ERROR") failures++;
        }

        if (failures > 0) {
            return 0xFF6600;
        }
        if (skipped > 0) {
            return 0xFF9900;
        }

        return 0x00FF00;
    }
    else {
        return 0x00BB22;
    }
}

function appendTestResults(embed, report) {
    var title = false;
    var passes = 0;
    var skipped = 0;
    var failures = [];

    for (var i in report.tests) {
        var status = report.tests[i].status;
        if (status === "OK") passes++;
        else if (status === "SKIPPED") skipped++;
        else failures.push(report.tests[i].name);
    }

    var tests = "";

    if (passes > 0) {
        tests += ` :green_circle: ${passes} Tests réussis`;
    }

    if (skipped > 0) {
        tests += ` :yellow_circle: ${skipped} Tests ignorées`;
    }

    if (failures.length > 0) {
        tests += ` :red_circle: ${failures.length} Tests échoués\n`;

        for (var i in failures) {
            if (i > 2) {
                tests += `\n+ ${failures.length - i} plus...`;
                break;
            }

            tests += `\n${parseInt(i) + 1}. \`${failures[i]}\``;
        }
    }

    embed.addField("Unit Tests" + (failures > 0 ? "": ` (~${report.coverage}% coverage):`), tests);
}
