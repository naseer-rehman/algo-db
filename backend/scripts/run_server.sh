#!/bin/bash
docker run -d \
  --name algodb_server \
  -e PORT=8000 \
  -p 3000:8000 \
  algodbdev
