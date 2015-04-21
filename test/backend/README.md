# Info

Some info about the NodeJS backend tests.

We hardcode localhost:3000 as we are only interested in testing non-production environments.

All tests here are chained so, for example, the 2nd one depends on the 1st one data and so on. So,
in order to test the full app functionality we have the following steps.
- Create a user
- Update a user
- Create a group
- Join a group
- List group members
- List dishes
- Add a dish
- Edit a dish
- Book a dish
