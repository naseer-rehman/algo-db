# Backend Documentation

### Folder structure
Separation of concerns between folders:

* `routes`: defines the API structure of the application
* `controller`: deals with the function of each API endpoint
* `models`: define and interact with the database
* `services`: centralize business logic
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
* I need  to figure out how to deploy this database eventually...