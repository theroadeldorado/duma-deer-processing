## Option 1: Init repository using the `App Router`

1. Click `Use this template` to clone the repo

## Option 2: Init repository using the `Pages Router`

1. Click `Use this template` to clone the repo
2. Check the box that says `Include all branches`
3. After initializing the repo, go to the repo settings, and under the `Default Branch` area, click the double arrows to switch the default branch to the `pages-router` branch
4. Delete the `main` branch and rename the `pages-router` branch to main

## Getting Started

2. Replace `__MY_APP__` in https://github.com/skycatchfire/mongo-app-starter/blob/main/config/index.ts
3. Duplicate `.env.example` and rename to `.env`
4. Create new MongoDB Atlas account and enter `MONGO_URI` in `.env` file
5. Create new Sendgrid account and enter credentials in `.env` file
6. Create new Firebase project and enter app details in `.env` file. Note that the `FIREBASE_PRIVATE_KEY` comes from the `Firebase Admin SDK` under Project Settings -> Service Accounts
7. Activate user/email auth in Firebase project
8. Activate storage in firebase project (required for csv exporting)
9. Run `npm install`
10. Run `npm run create-admin` and follow the prompts to create an admin user
11. Run `npm run dev`
12. Use the [Compass](https://www.mongodb.com/products/compass) app to import the following entries to the `emailtemplates` MongoDB collection (Note: `__MY_APP__` should be replaced with the name of your app)

```
[{
  "key": "resetPassword",
  "name": "Reset password",
  "description": "Sent to any admin or user when they request a password reset",
  "subject": "Reset your password for __MY_APP__",
  "body": "Hi #recipient_name#,\n\nFollow this link to reset your password.\n\n#reset_password_link#\n\nIf you did not ask to reset your password, you can ignore this email.\n\nThanks,\nThe __MY_APP__ Team",
  "vars": [
    "recipientName",
    "resetPasswordLink"
  ],
  "updatedAt": {
    "$date": "2023-07-18T20:28:24.229Z"
  }
},
{
  "key": "inviteEmail",
  "name": "Invite to set password",
  "description": "Sent to users when an admin adds them to the system",
  "subject": "__MY_APP__ Invite",
  "body": "Hi #recipient_name#,\n\nYou have been invited to join the __MY_APP__. Please click the link below to set your password.\n\n#set_password_link#\n\nIf you did not request this invite, please ignore this email.\n\nThanks,\nThe __MY_APP__ Team",
  "vars": [
    "recipientName",
    "setPasswordLink"
  ],
  "updatedAt": {
    "$date": "2023-07-18T20:28:51.349Z"
  }
}]
```
