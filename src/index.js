const core = require('@actions/core')
const github = require('@actions/github')

const webhook = require('../src/discord.js')

async function run() {
  const payload = github.context.payload
  const repository = payload.repository.full_name
  const commits = payload.commits
  const size = commits.length
  const branch = payload.ref.split('/')[payload.ref.split('/').length - 1]

  //console.log(`Received payload ${JSON.stringify(payload, null, 2)}`)
  console.log(`Received payload.`)

  console.log(`Received ${commits.length}/${size} commits...`)

  const id = core.getInput('id')
  const token = core.getInput('token')
  const in_thread = core.getInput('in_thread')

  webhook
    .send(id, token, repository, branch, payload.compare, commits, size, in_thread)
    .catch((err) => core.setFailed(err.message))
}

try {
  run()
} catch (error) {
  core.setFailed(error.message)
}
