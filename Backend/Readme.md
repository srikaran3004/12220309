# URL Shortener Microservice

A production-grade URL shortener microservice built with **Node.js**, **Express**, and **MongoDB**.  
Includes robust logging to a test server, clean project structure, and environment-based configuration.

---

## Features

- **Shorten URLs** with unique or custom shortcodes
- **Redirect** to original URLs via shortcodes
- **View statistics** for each shortened URL
- **Robust logging**: All requests and errors are logged to a remote test server (with authentication)
- **MongoDB** for persistent storage
- **Rate limiting** and CORS support
- Clean, modular codebase

---

## Project Structure

```
Backend/
  src/
    controllers/      # Route handlers
    routes/           # Express route definitions
    models/           # Mongoose schemas
    middleware/       # Express middleware (logging, error handling, etc.)
    utils/            # Utility modules (logger, etc.)
    config/           # Configuration loader
    database/         # Database connection logic
    app.js            # Express app setup
    server.js         # Server entry point
  .env                # Environment variables (not committed)
  package.json
  package-lock.json
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Afford\ Med\ Assessment/Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `Backend/` directory with the following fields:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/urlshortener
AUTH_EMAIL=your_email@example.com
AUTH_NAME=Your Name
AUTH_ROLL_NO=YourRollNo
AUTH_ACCESS_CODE=YourAccessCode
AUTH_CLIENT_ID=your_client_id
AUTH_CLIENT_SECRET=your_client_secret
CORS_ORIGIN=*
```

> **Note:** Use the credentials provided by the assessment/test server.

### 4. Start the Server

```bash
npm run dev
```

The server will run at [http://localhost:5000](http://localhost:5000).

---

## API Endpoints

### Shorten a URL

**POST** `/api/shorten`

```json
{
  "originalUrl": "https://example.com",
  "customCode": "optional-custom-code"
}
```

**Response:**
```json
{
  "shortUrl": "http://localhost:5000/<shortcode>"
}
```

---

### Redirect

**GET** `/:shortcode`

Redirects to the original URL.

---

### Get URL Statistics

**GET** `/api/stats/:shortcode`

Returns usage statistics for the given shortcode.

---

## Logging

- All requests and errors are logged to the test server using a Bearer token obtained via authentication.
- Logging is handled automatically; no manual action is required.

---

## Notes

- Ensure MongoDB is running locally or update `MONGODB_URI` for a remote/cloud instance.
- If the test server is down, logging will fail gracefully and will not affect core API functionality.

---

## License

This project is for assessment purposes. 