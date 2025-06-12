telecrm


## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your database connection details:
   ```
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_DATABASE=your_db
   # Frontend requests will default to this API base
   VITE_API_BASE_URL=http://localhost:3001
   ```
   By default the frontend will send API requests to `http://localhost:3001`.

3. Start the server (for example on port `3001`):
   ```bash
   PORT=3001 npm run start
   ```

4. In a separate terminal start the development server:
   ```bash
   npm run dev
   ```
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
