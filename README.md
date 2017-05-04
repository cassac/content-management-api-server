# Content Management Server

An express server with API endpoints for users and their files. Authentication includes restricted and admin only endpoints complete with unit tests. Created to bundle with [Content Management Client](https://github.com/cassac/content-management-client).

To get started:

1. Execute `npm install` to install dependencies
2. Install [MongoDB](https://docs.mongodb.com/manual/installation/)
3. Execute `mongod` to start MongoDB server
4. Execute `npm run dev` to start application server
5. Prepare [client-side application](https://github.com/cassac/content-management-client) 
6. Visit http://localhost:3000/dashboard/

To run tests:
1. Execute `npm test`