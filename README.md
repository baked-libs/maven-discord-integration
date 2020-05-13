# discord-webhook
This GitHub Action can produce fancy and more meaningful discord messages for your commits.
<br>It includes Test results and coverage.

## Requirements
This currently works only for Maven projects.
For Test Results and Coverage Reports you will need to use one of the following Maven plugins:
* `maven-surefire`
* `maven-failsafe`
* 'jacoco'

## Inputs

### `id`
**Required** This is the id of your Discord webhook, if you copy the webhook url, this will be the first part of it.

### `token`
**Required** Now your Discord webhook token, it's the second part of the url.

## Screenshots
TODO

## Example workflow
TODO