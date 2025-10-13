# Pesapal Error Troubleshooting

## Error: "internal error; reference = o66smttn319a07e1h6mnkcpt"

This error typically indicates an issue with the API request format or credentials.

### Common Causes

1. **Missing or Invalid IPN ID**
   - The `notification_id` field is required when submitting orders
   - Check `.env` file has `VITE_PESAPAL_IPN_ID` set
   - Verify the IPN is registered with Pesapal

2. **Invalid Credentials**
   - Check `VITE_PESAPAL_CONSUMER_KEY` and `VITE_PESAPAL_CONSUMER_SECRET`
   - Ensure credentials match your Pesapal dashboard

3. **Currency Mismatch**
   - Currently using USD in booking form
   - Consider using UGX for Uganda-based transactions

4. **Environment Variables Not Loading**
   - Server functions need environment variables accessible server-side
   - Added helper function to handle both `VITE_` prefixed and non-prefixed vars

### Recent Changes

Added environment variable helper that works in both contexts:
```typescript
const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== "undefined") {
    return process.env?.[key] || process.env?.[`VITE_${key}`];
  }
  return import.meta.env[`VITE_${key}`] as string | undefined;
};
```

### Debugging Steps

1. **Check Server Logs**
   ```bash
   # Look for console.log output showing:
   # - "Requesting Pesapal token from: ..."
   # - "Submitting order to Pesapal: ..."
   # - "Pesapal order response: ..."
   ```

2. **Verify IPN Registration**
   ```typescript
   // Call getRegisteredIPNs() to check if IPN is registered
   const ipns = await getRegisteredIPNs();
   console.log(ipns);
   ```

3. **Test Token Retrieval**
   ```typescript
   // Verify credentials work
   const token = await getPesapalToken();
   console.log("Token received:", token.substring(0, 20) + "...");
   ```

4. **Check Order Data Format**
   - Ensure all required fields are present
   - Verify phone number format (should include country code)
   - Confirm email is valid
   - Check amount is a number, not a string

### Expected Order Format

```typescript
{
  id: "BK-1234567890-ABC",           // Unique merchant reference
  currency: "UGX",                    // Or USD
  amount: 150000,                     // Number, not string
  description: "Car Rental: ...",
  callback_url: "https://yourdomain.com/booking/callback",
  notification_id: "your-ipn-id",     // REQUIRED - from Pesapal dashboard
  billing_address: {
    email_address: "user@example.com",
    phone_number: "+256700000000",    // Include country code
    country_code: "UG",
    first_name: "John",
    last_name: "Doe",
    city: "Kampala"                   // Optional but recommended
  }
}
```

### Quick Fix Checklist

- [ ] IPN registered and ID added to `.env`
- [ ] Environment variables accessible in server context
- [ ] Currency matches your business requirements
- [ ] Phone number includes country code (+256 for Uganda)
- [ ] Amount is a number, not string
- [ ] Callback URL is accessible (HTTPS in production)
- [ ] Pesapal credentials are correct (sandbox vs live)

### Testing

1. Open browser console
2. Try booking
3. Check server terminal for console.log output
4. Look for the specific error message
5. Verify which API call is failing (token, order submit, etc.)

### Next Steps

If error persists:
1. Check server console logs for detailed error info
2. Verify IPN is registered by calling `getRegisteredIPNs()`
3. Test credentials by calling `getPesapalToken()`
4. Review Pesapal dashboard for any account issues
