# Book Tracker
### It's a thing for tracking books you've read

## Overview
Book tracker is a super simple way to build a psuedo-library of books and record your progress through them. Every book you add is sorted into one of three columns (wishlist, owned, and read), and is associated with a date range and a set of notes. All that to say, you can track the books you have, the ones you want, when you've read the ones you've read, and what you thought about them.

It's built on Next.js and uses Clerk for auth and DynamoDB as a database.

If you're trying to keep track of your reading and want a purpose built tool that's as simple as keeping a list in Apple Notes but with marginally more functionality, you'll probably dig this. :)

## Installation
I haven't built a docker image for this yet, so the easiest way to deploy an instance is likely to fork/clone the repo, make any changes you'd like, and deploy to Vercel (or build to Docker yourself, etc).

You need a Clerk account as well as an AWS account and table in DynamoDB to get started. Both of those have pretty generous free tiers so you should be able to deploy at no cost. I've put most database and auth settings in enviornment variables so you'll need to specify:

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- AWS_KEY
- AWS_KEY_ID
- AWS_REGION
- AWS_TABLE
- PROD_ID
- DEV_ID

Those last two are your Clerk userId's for your development and production deployments. They're used to secure the server actions that interact with the database. You can either [get them through Clerk's Auth component](https://clerk.com/docs/references/nextjs/auth#use-auth-to-retrieve-user-id) or just go into your dashboard and under "Users", click your user, and copy your ID. If you do the latter, I'd reccomend enabling the restricted sign-up mode while you're there (configure -> restrictions -> sign-up mode) to prevent other people from accessing your instance. Shouldn't be needed since the Server Actions are secured via userId, but better safe than sorry.