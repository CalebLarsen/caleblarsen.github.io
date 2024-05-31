#!/bin/bash

fd .html | xargs 'cat' | aspell -H -p ~/.aspell.en_US.pws list
