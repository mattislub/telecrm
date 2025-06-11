telecrm

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
