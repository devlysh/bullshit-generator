# Bullshit Generator

Command line tool which reads sentences from file, generates random sentences with all those words and reads it out.

_Currently is under construction_

## Install

`npm i -g bullshit-generator`

## Usage


`bullshit-generator` use it with defalut text file

`bullshit-generator [OPTION]...` use it with defalut text file with options

`bullshit-generator --file my-text-file.txt` use your own text file

### Options

```
-h --help         # See readme
-s --stats        # Show words statistics for used file

-f --file         # Use own text file
-m --max          # Maximum clean words between commas or endings
-c --comma        # Chance to set word with comma (1-9)
```
