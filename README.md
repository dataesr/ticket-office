# ReadMe# Guichet

# Eslint

To ensure a more comfortable coding experience, it is advisable to use the Prettier extension. However, please remember to disable it when working on other projects.

### CLIENT

created a .env.local with :
BASE_API_URL="https://ticket-office.staging.dataesr.ovh"
VITE_TICKET_OFFICE_API_AUTHORIZATION (ask me)

### SERVER

created a .env.local (ask me mine)

# run Ticket-office

`bun i`
`bun start`

## deploy

`bun run deploy --level=[patch|minor|major]`

# Issues

you might have issues with imap server if you start localy (especialy on work wifi), if needed, disable the function called : "fetchEmails"

# Links

https://ticket-office.dataesr.ovh/
https://ticket-office.staging.dataesr.ovh/
API DOC : https://ticket-office.dataesr.ovh/swagger
