const core = require('@actions/core');
const github = require('@actions/github');

const analysis = require('../src/analysis.js');
const webhook = require('../src/discord.js');

async function run() {
	const payload = github.context.payload;
	const repository = payload.repository.full_name;
	const commits = payload.commits;
	const size = commits.length;
	const branch = payload.ref.split('/')[payload.ref.split('/').length - 1];

	console.log(`Received payload ${JSON.stringify(payload, null, 2)}`);

	console.log(`Received ${commits.length}/${size} commits...`);

    	const id = core.getInput("id");
    	const token = core.getInput("token");

	//analysis.start(isSkipped(payload.head_commit)).then((report) => {
        webhook.send(id, token, repository, branch, payload.compare, commits, size, report).catch(err => core.setFailed(err.message));
    //}, err => core.setFailed(err));
}

try {
	run();
} catch (error) {
    core.setFailed(error.message);
}

function isSkipped(commit) {
	return commit.message.toLowerCase().includes("[skip]");
}
