[![](https://img.shields.io/badge/-Github_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/marketplace/actions/classic-discord-webhook) [![Twitter Follow](https://img.shields.io/twitter/follow/Thomasbnt_?color=%231DA1F2&label=Follow%20me&logo=Twitter&style=for-the-badge)](https://twitter.com/Thomasbnt_) [![Follow me on DEV](https://img.shields.io/badge/dev.to-%2308090A.svg?&style=for-the-badge&logo=dev.to&logoColor=white&alt=devto)](https://dev.to/thomasbnt)

# Discord Webhook
This GitHub Action can produce fancy and **more meaningful Discord messages for your commits**.

## Screenshots
The standard webhook from GitHub to Discord just dumps the commit messages right into your chat, this is fine but sometimes you just want some extra information. Did the commit introduce any new issues? Did it even compile successfully? That's what this Action is for.

| Standard Webhook | New and improved Webhook |
|:-----------:|:----------------------------------------------------------:|
| ![Old webhook interface](https://user-images.githubusercontent.com/14293805/90334058-11e81900-dfcb-11ea-8de0-f01a7591254d.png) | ![New webhook interface](https://user-images.githubusercontent.com/14293805/164105728-89678a3a-1e5c-4e9b-bd35-0508c2c4f0ee.png) |

## Donate
Feel free to help [me](https://github.com/thomasbnt) for the maintenance of this project !
Thanks to all **Sponsors on GitHub** !

[![Github Sponsors](https://cdn.jsdelivr.net/gh/thomasbnt/sponsors@1.0/sponsors.svg)](https://github.com/sponsors/thomasbnt)

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor%20me-%23EA54AE.svg?&style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/thomasbnt) [![Support me on Buy Me a Coffee](https://img.shields.io/badge/Support%20me-on%20Buy%20Me%20a%20Coffee-%23FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white)](https://www.buymeacoffee.com/thomasbnt?via=thomasbnt)


## Setup
Setup this code on your repository's `.github/workflows/` in a file like `discord-push.yml` and push the changes:

```yml
name: Discord Webhook
on: [push]
jobs:
  Discord_notification:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    - name: Run Discord Webhook
      uses: Mist3r-Robot/classic-discord-webhook@main
      with:
        id: ${{ secrets.DISCORD_WEBHOOK_ID }}
        token: ${{ secrets.DISCORD_WEBHOOK_TOKEN }}
```

You can see the example file at [/.github/workflows/discord-push.yml](/.github/workflows/discord-push.yml)
## Inputs

| `id` | `token` | `in_thread`|
|:-----------:|:----------------------------------------------------------:|:----------------------------------------------------------:|
| **Required** — This is the id of your Discord webhook, if you copy the webhook url, this will be the first part of it. | **Required** — Your Discord webhook token, it's the second part of the url. | Not required — if you want to send the message in a thread, you can specify the thread id here. |


> **Note**
>
> Need more help ? [See this post on DEV](https://dev.to/mrrobot/follow-your-repository-from-discord-52ge) or [this post on my blog in French](https://thomasbnt.dev/blog/robot-discord-basique/).
> [![follow your repository from Discord - Post on DEV](https://user-images.githubusercontent.com/14293805/198847774-bd7b38e7-5b61-4723-99a1-e767babac3a5.png)](https://dev.to/mrrobot/follow-your-repository-from-discord-52ge)

### Notable documentations

[How to get Commits on GitHub](https://docs.github.com/en/rest/reference/commits#get-a-commit)
