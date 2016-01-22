# Bullshit Generator

Command line tool which reads sentences from file, generates random sentences with all those words and reads it out.

_Currently is under construction_

## Install

`npm i -g bullshit-generator`

## Usage

`bullshit-generator [OPTION]...` to use it with defalut text file

`bullshit-generator` to use it with defalut text file

`bullshit-generator --file my-text-file.txt` to use your own text file

### Flags

```
-h --help         # To see readme
-s --stats        # Show words statistics for used file

-f --file         # Use own text file
-m --max          # Maximum clean words between commas or endings
-c --comma        # Chance to set word with comma (1-9)
```
