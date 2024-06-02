#!/bin/bash

PERSONAL_DICT_FILE=/home/caleb/.aspell.en_US.pws

if [ -z "$1" ]; then
  echo -n "What word do you want to add? "
  read -r word
  echo "$word" >> "$PERSONAL_DICT_FILE"
  exit 0
fi

echo "$1" >> "$PERSONAL_DICT_FILE"
