# 🤖 BOTPRESS INBOX ✉️

This inbox dashboard can be used for managing conversations and users of your Botpress bot. It uses the official API (in Beta still) and Typescript client.

## ✳️ Features

-   List conversations
-   List messages of a conversation
-   List users of a conversation
-   Show details of conversation (tags and created/updated dates)
-   Send a new message to conversation
-   Delete conversation

## 💬 How to use

1. Download this project folder
2. Create a .env file in the root folder
3. Add the following variables to the .env file
 ```
   VITE_BOTPRESS_TOKEN=<your token>
   VITE_BOTPRESS_BOT_ID=<your bot id>
   VITE_BOTPRESS_WORKSPACE_ID=<your workspace id>
   VITE_BOTPRESS_BOT_ID_AS_USER=<your bot id as a user>
```
4. Go to Botpress Dashboard, click your icon, and go to Personal Access Tokens
5. Create a new token named 'inbox-dashboard' for example, and paste it in the .env file
6. Still in the dashboard, open your bot and you will see the workspace and bot ids in the url. The workspace id is the string right after /workspaces/ and the bot id is right after /chatbots/. Copy and paste them in the .env file
7. Start the project with `npm run dev` and open it in the browser
8. To figure out your bot id as a user, open any conversation and go to the developer console. You will see a `MESSAGES: [...]` log. Open the list and look for the first message sent by the bot. Grab its userId and paste it in the .env file. This will be used for sending messages and for differentiating the bot from other users.
9. You're done!
10. EXTRA - You could use this project on your localhost only (it works perfectly), or you could use host it for free on platform like Vercel, in which case you would need some form of authentication to restrict access.

## 👀 How it looks like
![image](https://github.com/devguilhermy/botpress-inbox/assets/55157846/9a108c39-9d76-4787-be50-f86b8b21e21a)

## ⚙️ Libraries

This project makes use of the following libraries:

-   React.js v18 - app structure
-   Vite.js v2 - app build
-   Botpress Client v0.1.1 - requests to the botpress API
-   Date-fns v2.30 - date formatting
-   Typescript v4.8 - typings and interfaces
-   TailwindCSS v3.1.8 - styling
-   React Router Dom v6 - routing

## ✅ To do

-   [ ] Create conversation
-   [ ] Sort conversations by last message
-   [ ] Show user name in the conversation list
-   [ ] Delete user
-   [ ] Better styling
-   [ ] Responsive style for mobile
-   [ ] Authentication

## 👥 Contribution

We welcome contributions from the community, so feel free to create issues and open pull requests. As an open-source project, we value your help and feedback in making this project better.

## 📃 License

This project is licensed under the MIT License. You are free to use, modify, and distribute it as per the terms of the license. You can also fork the project and customize it to suit your specific use case, whether you choose to keep it open source or not.

## ⚠️ Disclaimer

This project is an independent effort and is not affiliated with Botpress in any way. It utilizes the public API provided by the platform to list and manage conversations. Any misuse of this application is solely the responsibility of the user. The creators and contributors of this project disclaim any liability for any damages or issues arising from the use or misuse of this project.

I appreciate your support and collaboration in improving this Inbox. Happy contributing and bot-building! ☺️
