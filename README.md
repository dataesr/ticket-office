# Guichet numérique // Ticket office

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

## Deploy

`bun run deploy --level=[patch|minor|major]`

## Issues

- You might have issues with imap server if you start locally (especialy on wifi). If needed, disable the function called : "fetchEmails".
- You also might have issues if you install a new dependency. Check if all dependencies are in package.json (especially in server).
If you have and 503 issue, check error on pod :

`kubectl get pods -n ticket-office`

`kubectl logs ticket-office-xxxxxxx-yyyyyy -n ticket-office`
