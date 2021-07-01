# Fancier Discord Webhook
This GitHub Action can produce fancy and more meaningful discord messages for your commits.
<br>It includes Test results and coverage.

## Requirements
This currently works only for Maven projects.
For Test Results and Coverage Reports you will need to use one of the following Maven plugins:
* `maven-surefire`
* `maven-failsafe`
* `jacoco`

## Inputs

### `id`
**Required** This is the id of your Discord webhook, if you copy the webhook url, this will be the first part of it.

### `token`
**Required** Now your Discord webhook token, it's the second part of the url.

## Screenshots
The standard webhook from GitHub to Discord just dumps the commit messages right into your chat, this is fine but sometimes you just want some extra information. Did the commit introduce any new issues? Did it even compile successfully? That's what this Action is for.<br>

### Standard Webhook
![old webhook](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/old-webhook.png)

### New and improved Webhook
![tests passed](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/tests-passed.png)
![tests skipped](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/tests-skipped.png)
![tests failed](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/tests-failed.png)

### Changes
* Removed the obnoxious author name and image at the top (may be a toggle in the future)
* The branch is now clearly visible "Slimefun4:master" -> "Slimefun4 (master)"
* The repository is now referred to by its full name, including the repository owner
* The embed now includes a timestamp (it is actually the timestamp of the commit, not just the current date of when the webhook was sent)
* Commit messages have slightly shorter limits and the committer is now better distinguishable from the commit message "Reduced technical debt - TheBusyBiscuit" -> "Reduced technical debt (@TheBusyBiscuit)"
* Includes test results, passes will be prepended with a green circle, skips with yellow and failures with red.
* It will also list the exact tests which failed (max of 4, then it will crop them)
* An estimated test coverage is provided if you use the `jacoco` maven plugin.
* Dynamic embed color changes

#### Dynamic Coloring
The color of the embed changes depending on the compiler and test results. Here's a breakdown:

| Color | Description |
| ----- | ----------- |
| red | The build has failed. |
| orange | The build was successful but some tests failed. |
| yellow | The build was successful, no tests failed but some were skipped. |
| green | The build was successful, no tests failed and none were skipped. |

## Example setup
To set up this Action, create a new workflow file under `.github/workflows/workflow_name.yml`.

**Important:** Your project must have a `pom.xml` file, this Action only supports Maven at the moment.<br>
To report Unit Tests and coverage, you will need `maven-surefire` / `maven-failsafe` and/or `jacoco`.

This workflow is rather simple, it checks out your repository, sets up Java and the webhook will then run `mvn test` and report the results to your discord webhook.
You should configure the webhook id in advance.

```yaml
name: Discord Webhook

on: [push]

jobs:
  report-status:

    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2.3.4
    - name: Set up Java JDK 11
      uses: actions/setup-java@v2.1.0
      with:
        distribution: 'adopt'
        java-version: '11'
        java-package: jdk
        architecture: x64
    - name: Run Discord Webhook
      uses: baked-libs/discord-webhook@main
      with:
        id: ${{ secrets.YOUR_DISCORD_WEBHOOK_ID }}
        token: ${{ secrets.YOUR_DISCORD_WEBHOOK_TOKEN }}
```
