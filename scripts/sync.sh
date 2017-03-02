#!/usr/bin/env bash

host=http://localhost
port=8089
now=$(date)
projectDir=~/path_to_project/EasyERP_open_source

echo ">>>>>> sync $now" >> "$projectDir/cron.txt"

curl -X GET $host:$port/sync