#!/bin/bash

# Check if the parameter for the library has been provided
if [ -z "$4" ]; then
  # If no library is provided, execute the command without the --library option
  node dist/index.js --file $1 --output $2 --language $3
else
  # If a library is provided, execute the command with the --library option
  node dist/index.js --file $1 --output $2 --language $3 --library $4
fi
