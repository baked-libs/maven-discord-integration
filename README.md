[![](https://img.shields.io/badge/-Github_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/marketplace/actions/classic-discord-webhook) [![Twitter Follow](https://img.shields.io/twitter/follow/Thomasbnt_?color=%231DA1F2&label=Follow%20me&logo=Twitter&style=for-the-badge)](https://twitter.com/Thomasbnt_) [![Follow me on DEV](https://img.shields.io/badge/dev.to-%2308090A.svg?&style=for-the-badge&logo=dev.to&logoColor=white&alt=devto)](https://dev.to/thomasbnt) [![Support me on Buy Me a Coffee](https://img.shields.io/badge/Support%20me-☕-orange.svg?style=for-the-badge)](https://www.buymeacoffee.com/thomasbnt?via=thomasbnt)

# Discord Webhook
This GitHub Action can produce fancy and **more meaningful Discord messages for your commits**.

## Screenshots
The standard webhook from GitHub to Discord just dumps the commit messages right into your chat, this is fine but sometimes you just want some extra information. Did the commit introduce any new issues? Did it even compile successfully? That's what this Action is for.

| Standard Webhook | New and improved Webhook |
|:-----------:|:----------------------------------------------------------:|
| ![Old webhook interface](https://user-images.githubusercontent.com/14293805/90334058-11e81900-dfcb-11ea-8de0-f01a7591254d.png) | ![New webhook interface](https://user-images.githubusercontent.com/14293805/110182888-faa93580-7e0d-11eb-8b03-31c443698ffd.png) |


#### ⚙ Setup
Setup this code on your  `.github/workflows/` and name it want you want like `discord-push.yml` and push that. 
```yml
name: Discord Webhook
on: [push]
jobs:
  Discord_notification:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v1
    - name: Run Discord Webhook
      uses: Mist3r-Robot/classic-discord-webhook@main
      with:
        id: ${{ secrets.DISCORD_WEBHOOK_ID }}
        token: ${{ secrets.DISCORD_WEBHOOK_TOKEN }}
```

You can see the example file at [/.github/workflows/discord-push.yml](/.github/workflows/discord-push.yml)
## Inputs

| `id` | `token` |
|:-----------:|:----------------------------------------------------------:|
| **Required** — This is the id of your Discord webhook, if you copy the webhook url, this will be the first part of it. | **Required** — Your Discord webhook token, it's the second part of the url. |


#### ❓ Need more help ? [See this post on DEV](https://dev.to/mrrobot/follow-your-repository-from-discord-52ge) 

[![Badge forked from](https://img.shields.io/badge/Forked-from%20Slimefun%2Fdiscordwebhook-black?logo=GitHub&style=for-the-badge)](https://github.com/Slimefun/discord-webhook)
