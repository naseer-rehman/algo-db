#!/bin/bash
docker run -d \
	--name postgres-test \
	-e POSTGRES_PASSWORD=test \
  -e POSTGRES_DB=algodb \
  -p 5432:5432 \
  postgres
  # -e POSTGRES_USER=postgres \
  # -v /db-init/init.sql:/docker-entrypoint-initdb.d/init.sql \
# docker exec -it postgres-test bash
# psql -U postgres
# \c algodb