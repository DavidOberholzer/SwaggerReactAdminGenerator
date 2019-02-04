#!/bin/bash
# A script to run prettier on all generated admin js files before melding.

FILES=`find ./demo -type f -name '*.js'`
for file in $FILES
do
yarn prettier --write --single-quote --tab-width 4 --print-width 100 "$file"
done