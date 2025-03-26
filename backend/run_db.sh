#!/bin/bash
docker run -d \
	--name postgres_box \
	-e POSTGRES_PASSWORD=test \
  -e POSTGRES_DB=algodb \
  -p 5432:5432 \
  -v ./db-data:/var/lib/postgresql/data \
  -v ./db-init:/docker-entrypoint-initdb.d \
  postgres
  # -e POSTGRES_USER=postgres \
# docker exec -it postgres_box bash
# docker container logs postgres_box -> command for obtaining logs for postgres
# psql -U postgres
# \c algodb