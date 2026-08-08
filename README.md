# Appwrite Node.js secrets function

This is a minimal Node.js Appwrite Function. It reads three environment variables and reports whether they are configured without returning their values.

## Variables to create in Appwrite Studio

Create these variables under the function's **Settings → Environment variables** section. Mark each one as **Secret**:

```env
USERNAME=demo-user
PASSWORD=change-this-password
API_KEY=change-this-api-key
```

The values above are safe examples for testing. Replace them with your own values in Appwrite Studio. Do not commit real values or put them in `.env` files tracked by Git.

## Deploy from a repository

Create an Appwrite Function and configure:

- Runtime: Node.js 22
- Entrypoint: `index.js`
- Root directory: the repository root
- Build command: `npm install`

Connect this repository through Appwrite's Git deployment settings, then deploy after creating or changing the variables. Appwrite applies environment-variable changes on the next deployment.

## Deploy manually

From this directory, create an archive without dependencies:

```bash
tar --exclude code.tar.gz -czf code.tar.gz .
```

Upload `code.tar.gz` in the function's **Create deployment → Manual** flow and use `index.js` as the entrypoint.

## Test locally

```bash
npm test
```

The function response only includes each variable's configured status and value length; secret values are never returned.
