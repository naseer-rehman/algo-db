# Backend Documentation

### Folder structure
Reference: [Decoding Backend Architecture: Crafting Effective Folder Structures](https://dev.to/mahabubr/decoding-backend-architecture-crafting-effective-folder-structures-in7)

Separation of concerns between folders:
* `routes`: defines the API structure of the application
  * > Routing mechanisms define the mapping between incoming requests and corresponding controller actions. A centralized folder for routes streamlines request handling and promotes a clear separation of concerns.
* `controller`: deals with the function of each API endpoint. Should mediate between HTTP request and deeper logic and manipulation of data.
  * > Controllers serve as intermediaries between incoming requests and backend logic, handling data manipulation, business logic, and response generation. Organizing controllers into a separate folder promotes modularity and enhances code maintainability.
* `models`: define and interact with the database
  * > Models represent the data structures and business entities manipulated by the backend. Whether dealing with users, products, or transactions, housing models within a designated folder fosters clarity and facilitates database interactions.
* `services`: centralize business logic
  * > Auxiliary functions and services, such as authentication, validation, logging, and error handling, find their home within this folder. Centralizing common functionalities enhances code reuse and accelerates development cycles.
* `middleware`: performs pre/post processing on requests and responses. e.g. logging, authentication
* `utils`: helper functions and shared utilities

### Postgres Docker Container
List of commands and their purpose:

* `docker exec -it postgres_box bash`
  To interact with the container in the terminal
* `docker container logs postgres_box`
  View logs from the postgres container
* `./run_db.sh`
  Starts the postgres container
  * Note: no longer necessary with docker compose

Other information:
* `db-init` contains an SQL script that gets copied to the postgres container to initialize the table data on first load (if data isn't already present).
  * I will be adding some CSV files to populate the DB with test data.
* `db-data` is attached to the container and contains the application data. If the data already exists, the initialization script is not run.
* I need to figure out how to deploy this database eventually...

Notes:
* idk

### Server Routes

* `app/login` => redirect to github authentication
* `app/` => landing page
* `app/api/...` => the primary interface the server and client operates on
* `app/api/integrations/...` => handles interaction with external resources
* `app/api/integrations/github/oauth2/` => redirects to github authorization endpoint
* `app/api/integrations/github/oauth2/callback` => handles redirect from github after user authenticates with oauth service
* `app/api/integrations/leetcode/...` => where I scrape leetcode 
* `app/api/user/...` => all user-related operations
  * Create user
  * View user profile
  * View other user profiles
  * Change user settings
* `app/api/posts/...` => landing page for posts: trending, most popular, categories, etc.
* ...

### Github OAuth Flow, including session-based authentication
1. User clicks the login button, directing them to `/login`, then redirected to `/api/integrations/github/oauth2`, which redirects to github's authorization endpoint.
   1. This is where a `state` token is also created, to prevent CSRF.
   2. The `state` token is stored in the user's cookies.
   3. It will be verified later in the callback by comparing Github's token and the one stored in the user's cookies.
2. Github redirects the user back to `/api/integrations/github/oauth2/callback`, github provides the authorization code in query params.
3. Server requests authorization token from github.
   1. At this point, how do I store/authenticate the user's session on the app?
4. User information is inserted into database
5. Provide a user with a cookie for their session

Some things to consider:
- I considered refresh tokens, but found out they aren't applicapable to github oauth. They apply to Github Apps, which is way more complicated than this flow.
- Do I want to use `cookie-parser` or `express-session`?
  - The answer is to use both: `express-session` is used primarily for storing user sessions in a database on the server-side and the user's cookies on the client-side, while `cookie-parser` is a general-purpose cookie parsing middleware.
  - Note: that is until I get to using better-auth
- I will need to go back to the Github dashboard to modify the URL of my app

### Authenticating User Requests
1. Check user cookie against db session table
2. If not found, redirect to `/login`?
   1. Should there be multiple sessions for the same user? Should I limit to only 1 session per user? 

### My Notes
- maybe try using Zod [done]
- implement session-based authentication [wip]
- start using HTTPS in development to prepare for deployment
  - kind of an annoying step, I'll do this after
- look into using some logging middleware
- use rate limiter for github
- implement some global error handler?
- implement some kinda rate limiter for my own API
  - `express-rate-limit`?
- use `helmet` [done]
- use `cors` [done]
- look into `tRPC`, might be useful since this is a typescript monorepo
- ...

