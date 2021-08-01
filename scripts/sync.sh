#!/usr/bin/env bash

host=http://localhost
port=8089
now=$(date)
projectDir=~/WebstormProjects/tinyERP-Desktop

echo ">>>>>> sync $now" >> "$projectDir/cron.txt"

curl -X GET $host:$port/sync