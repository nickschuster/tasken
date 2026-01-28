# Playwright E2E Tests

You will need playwright browsers installed.

The Playwright configuration will automatically start the required web server when you run the tests; you do not need to start a dev server manually.

`npm run test:e2e` for running the test suite. Optionally add `-- --ui` for debugging.

During debugging, before doing anything, run the setup test.

If you get into a bad state with the dev user (not able to authenticate or delete), delete it from your db and re run the setup.

## CI Environment

In CI environments, the authentication bypass automatically grants premium access to test users, completely bypassing Stripe integration for reliable test execution.
