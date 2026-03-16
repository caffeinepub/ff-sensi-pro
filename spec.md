# FF Sensi Pro

## Current State
The app is a free PC sensitivity generator. Users enter PC specs and instantly get sensitivity settings. Admin panel at /admin requires only username/password (zeeshan18/788). No payment or user access control.

## Requested Changes (Diff)

### Add
- Pack selection page (home): 3 packs (Rs 50, Rs 250, Rs 500) with feature lists
- UPI payment instructions page: shows Google Pay/PhonePay, UPI number 9103007881, user submits name + UPI transaction ID
- User login page (/login): username + password form
- Admin can create users with username, password, and assigned pack level
- After login, user enters PC details and gets sensitivity settings appropriate for their pack
- Pack 1 features: sensitivity settings + 50% headshot rate badge + lag reduce tips
- Pack 2 features: all Pack 1 + 70% headshot rate badge + device optimization tips
- Pack 3 features: all Pack 2 + 100% headshot rate badge + game booster + DPI setting
- Backend: store users (username, hashed password, pack level), payment requests (name, UPI txn ID, requested pack)
- Admin panel: view payment requests, create user accounts with credentials

### Modify
- Home page now shows pack selection instead of the direct PC form
- Admin panel now includes user management and payment request review
- Results page shows pack-gated features

### Remove
- Free direct access to sensitivity settings without login

## Implementation Plan
1. Update backend to support: user creation (admin), user login, payment request submission, list payment requests (admin)
2. New frontend pages: PackSelectionPage (home), PaymentSubmitPage, LoginPage
3. Update ResultsPage to show pack-appropriate features
4. Update AdminPage to show payment requests and create users
5. Add routing for /login page
6. Sensitivity calculation stays in browser; pack level stored in session after login
