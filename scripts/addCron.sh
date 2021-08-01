#!/usr/bin/env bash

projectDir=~/WebstormProjects/tinyERP-Desktop

crontab -l > synccron
echo "*/1 * * * *     $projectDir/scripts/sync.sh" >> synccron
echo "*/5 * * * *    $projectDir/scripts/addToSync.sh" >> synccron
crontab synccron
rm synccron

chmod +x "$projectDir/scripts/sync.sh"
chmod +x "$projectDir/scripts/addToSync.sh"
