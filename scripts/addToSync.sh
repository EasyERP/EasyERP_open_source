#!/usr/bin/env bash

host=http://localhost
port=8089
now=$(date)
projectDir=~/WebstormProjects/EasyErp-Desktop

echo ">>>>>> addToSync $now" >> "$projectDir/cron.txt"

curl -X GET $host:$port/addToSync