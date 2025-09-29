## Conventions 
TODO: create contributing.md

- yourname/feature for branches
- every branch needs an e2e test if its new functionanlity and unit tests and component tests
- if you fix a bug, add a test for it
- make sure you have prettier extension installed and configured as default
- PR names should follow [convential commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)

## Setup

After cloning the repo, setup your database:

```sh
cd tasken

docker compose up

npm run db:migrate:run
```

And setup your env file:

```sh
cp .env.example .env
```

## Developing

Install dependencies with `npm install` and start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment

TBA
