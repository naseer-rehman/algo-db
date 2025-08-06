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

Other information:
* `db-init` contains an SQL script that gets copied to the postgres container to initialize the table data on first load (if data isn't already present).
  * I will be adding some CSV files to populate the DB with test data.
* `db-data` is attached to the container and contains the application data. If the data already exists, the initialization script is not run.
* I need to figure out how to deploy this database eventually...

Notes:
* Use docker compose for running the services for development. Just to be fancy.
* idk
