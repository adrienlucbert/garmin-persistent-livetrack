#!/bin/sh

: | tee logs/salmon.log logs/salmon.out logs/salmon.err
salmon start --no-daemon &
tail -f /app/logs/salmon.log
