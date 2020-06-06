# Discord Webhook
This GitHub Action can produce fancy and more meaningful discord messages for your commits.

## Inputs

### `id`
**Required** This is the id of your Discord webhook, if you copy the webhook url, this will be the first part of it.

### `token`
**Required** Now your Discord webhook token, it's the second part of the url.

## Screenshots
The standard webhook from GitHub to Discord just dumps the commit messages right into your chat, this is fine but sometimes you just want some extra information. Did the commit introduce any new issues? Did it even compile successfully? That's what this Action is for.

| Standard Webhook | New and improved Webhook |
|:-----------:|:----------------------------------------------------------:|
| ![Old webhook interface](assets/old-webhook.png) | ![New webhook interface](assets/tests-passed.png) |



#### Example setup
```yml
name: Discord Webhook
on: [push]
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v1
    - name: Run Discord Webhook
      uses: Mist3r_Robot/discord-webhook@master
      with:
        id: ${{ secrets.DISCORD_WEBHOOK_ID }}
        token: ${{ secrets.DISCORD_WEBHOOK_TOKEN }}
```


Forked from [Slimefun/discord-webhook](https://github.com/Slimefun/discord-webhook).
