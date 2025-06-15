telecrm


## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and adjust if necessary. By default the
   frontend will send API requests to `http://localhost:3001`.
   If you want the backend to serve over HTTPS, set `SSL_KEY` and `SSL_CERT`
   in the `.env` file to the paths of your TLS key and certificate files.

3. Start the server (for example on port `3001`):
   ```bash
   PORT=3001 npm run start
   ```

4. In a separate terminal start the development server:
   ```bash
   npm run dev
   ```

5. For a production build, generate the static files:
   ```bash
   npm run build
   ```
   The server will automatically serve the contents of the `dist/` directory.
## Verification Call Example

Use the following cURL command to trigger a verification call via the API:

```bash
curl --location 'https://telephone.drive-it.co.il/call.php' \
--header 'Content-Type: application/json' \
--data '{
  "phonenumber": "1234567890",
  "callerid": "1234456789",
  "calltype": "missedcall",
  "verificationcode": "123456",
  "ringtimeout": "60"
}'
```

Make sure the field is named `verificationcode` (with an "a") when issuing the request.
