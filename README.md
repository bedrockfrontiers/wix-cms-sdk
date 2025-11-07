# Wix CMS SDK

[![npm](https://img.shields.io/npm/v/@bedrockfrontiers/wix-cms-sdk)](https://www.npmjs.com/package/@bedrockfrontiers/wix-cms-sdk)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/license/apache-2-0)
[![Node.js](https://img.shields.io/badge/Node-%3E%3D%2018.0-brightgreen.svg)](https://nodejs.org/)
[![Downloads (monthly)](https://img.shields.io/npm/dm/@bedrockfrontiers/wix-cms-sdk)](https://www.npmjs.com/package/@bedrockfrontiers/wix-cms-sdk)
[![Bundle Size (min+gz)](https://img.shields.io/bundlephobia/minzip/@bedrockfrontiers/wix-cms-sdk)](https://bundlephobia.com/package/@bedrockfrontiers/wix-cms-sdk)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/bedrockfrontiers/wix-cms-sdk/pulls)
[![GitHub stars](https://img.shields.io/github/stars/bedrockfrontiers/wix-cms-sdk?style=social)](https://github.com/bedrockfrontiers/wix-cms-sdk/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/bedrockfrontiers/wix-cms-sdk?style=social)](https://github.com/bedrockfrontiers/wix-cms-sdk/network/members)

A lightweight and modular SDK for interacting with the Wix Headless CMS API. This library simplifies content management operations such as retrieving, creating, updating, and deleting CMS items, making it easier to integrate Wix CMS into your projects.

## Features

- **Fluent Query Builder**: Easily construct complex queries with a chainable API.
- **CRUD Operations**: Perform create, read, update, and delete operations on CMS collections.
- **Error Handling**: Built-in error handling and logging for robust integration.
- **Modular Design**: Lightweight and easy to integrate into any project.
- **Comprehensive Documentation**: Detailed docstrings and examples for all methods.

## Installation

Install the SDK using npm:

```bash
npm install @bedrockfrontiers/wix-cms-sdk
```

## Creating the HTTP Functions on Your Wix Site

Before using the SDK, you need to set up an HTTP endpoint inside your Wix site that bridges requests between your external application and the Wix backend.

To allow your external app (Node.js, backend, or site) to communicate securely with the **Wix Headless CMS**, you need to create a backend file on your Wix site.  
This file acts as a **bridge (proxy)** between the SDK and your Wix CMS collections through the `wix-data` API.

### 1. Enable Developer Mode

In your Wix Editor:

1. Go to the **Dev Mode** tab.
2. Click **Turn on Dev Mode** — this will enable the backend file system.
3. After enabling, you will see a new folder called `backend/` in your site files panel.

### 2. Create a backend file

Create a new backend file in your Wix project at:

```bash
backend/http-functions.js
```

> This file will handle HTTP requests from your external application (the one using `wix-cms-sdk`).

### 3. Copy the server-side code

Copy the HTTP handler code provided in this repository (see [`http-functions.js`](/http-functions.js)) into the file you just created on Wix.
This code defines HTTP endpoints that the SDK will call when performing CMS operations.

### 4. Configure your secret token

Find the following line in the code:
```js
const SECRET_TOKEN = "YOUR_SECRET_TOKEN_HERE";
```

Replace "YOUR_SECRET_TOKEN_HERE" with a strong, unique secret token of your choice.

> This ensures only authorized requests from your application can access your Wix CMS.

> [!WARNING]
> #### Security Notice:
> - Never commit this token to version control (e.g., GitHub).
> - Do not include it in client-side JavaScript or anywhere it could be exposed publicly.
> - Store it securely (e.g., in environment variables or a server-side configuration file).
> - Treat it with the same level of security as an API key or database password.
> - Unauthorized access to this token could allow third parties to read, modify, or delete your CMS data.

### 5. Publish your site

After saving the http-functions.js file:

- Click **Publish Site** in Wix.
- Your new HTTP endpoints will automatically become available under your site’s public URL (e.g., `https://yourusername.wixsite.com/yoursite/_functions/`).

### 6. How the connection works

The SDK (`wix-cms-sdk`) sends JSON requests to these endpoints.

Example payload for querying items:

```json
{
  "token": "YOUR_SECRET_TOKEN_HERE",
  "collection": "Posts",
  "conditions": [
    { "operator": "eq", "field": "status", "value": "published" },
    { "operator": "limit", "value": 10 }
  ]
}
```

Each exported function (e.g. `post_query`, `post_insertQuery`, etc.) handles a different CMS operation through the Wix `wix-data` API:

- `post_query` → Performs queries using conditions and filters.
- `post_insertQuery` → Inserts one or multiple items.
- `post_saveQuery` → Saves (inserts or updates) one or more items.
- `post_updateQuery` → Updates existing items.
- `post_removeQuery` → Removes one or more items.
- `post_truncateQuery` → Clears all items in a collection.

All responses are returned as JSON objects with the structure:

```jsonc
{
  "status": "success",
  "result": { /* ... */ }
}
```

or, in case of error:

```json
{
  "status": "failed",
  "error": "unauthorized"
}
```

## Using the SDK

After setting up your Wix site backend, you can connect and interact with your CMS directly from Node.js or any JavaScript environment.

### 1. Initialize

```js
import { WixCMS } from "@bedrockfrontiers/wix-cms-sdk";

const cms = new WixCMS(
  "username",      // Wix Username
  "my-site-name",  // Site ID or name
  "my-secret-token" // The same token configured in your http-functions.js
); // Reference URL → https://username.wixsite.com/my-site-name
```

### 2. Querying Data

The SDK provides a **fluent query builder** for constructing complex queries.

```js
const result = await cms
  .query("Posts")
  .eq("status", "published")
  .gt("views", 100)
  .ascending("title")
  .limit(10)
  .find();

console.log(result);
```

### 3. Inserting a New Item

```js
await cms
  .query("Posts")
  .insert({
    title: "New Article",
    author: "Jane Doe",
    status: "published",
  });
```

### 4. Updating an Existing Item

```js
await cms
  .query("Posts")
  .update({
    _id: "123abc",
    title: "Updated Title",
  });
```

### 5. Removing an Item

```js
await cms
  .query("Posts")
  .remove("123abc");
```

### 6. Truncating a Collection

```js
await cms
  .query("Logs")
  .truncate();
```

## Example in One Go

```js
import { WixCMS } from "@bedrockfrontiers/wix-cms-sdk";

const cms = new WixCMS("user123", "my-site", "super-secure-token");

// Querying data
const posts = await cms.query("Posts")
  .eq("status", "published")
  .limit(5)
  .find();

console.log(posts);

// Inserting a new record
await cms.query("Posts").insert({
  title: "New Post",
  author: "John Doe",
});
```

## Security Recommendations

- Always use **HTTPS** when sending requests.
- Keep your secret token private — never expose it in client-side code.
- Regenerate tokens periodically.
- Optionally, restrict requests to known IPs or origins in your `http-functions.js`.
