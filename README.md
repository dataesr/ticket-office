# Guichet numérique // Ticket office

## Automated background tasks

The API runs two background jobs that operate independently of user requests:

- Email polling — every 4 hours, the server checks the configured mailbox for new incoming messages via IMAP and processes them automatically.
  SSL certificate monitoring.
- Every day at 8:00 AM, the server checks the SSL certificate expiry date of all monitored sites. If a certificate is close to expiring (20 days or 10 days left), an alert is sent once to the team's Mattermost channel.

Both tasks only run in the production and staging environments; they are disabled in development to avoid unnecessary noise.

## Eslint

To ensure a more comfortable coding experience, it is advisable to use the Prettier extension. However, please remember to disable it when working on other projects.

## Client

Create a `.env.local` under the `/client` folder with :

```sh
BASE_API_URL="https://ticket-office.staging.dataesr.ovh"
VITE_TICKET_OFFICE_API_AUTHORIZATION (ask me)
```

## Server

Create a .env.local (ask me mine) under the `/server` folder.

## Run

`bun i`
`bun start`

Server is started at http://localhost:3000.
Client is started at http://localhost:5173.

## Deployment

The version number follows [semver](https://semver.org/).

To deploy in production, simply run this command from your staging branch :

`bun run deploy:[patch|minor|major]`

⚠️ Obviously, only members of the [dataesr organization](https://github.com/dataesr/) have rights to push on the repo.


## Issues

- You might have issues with imap server if you start locally (especialy on wifi). If needed, disable the function called : "fetchEmails".
- You also might have issues if you install a new dependency. Check if all dependencies are in package.json (especially in server).
  If you have and 503 issue, check error on pod :

`kubectl get pods -n ticket-office`

`kubectl logs ticket-office-xxxxxxx-yyyyyy -n ticket-office`
