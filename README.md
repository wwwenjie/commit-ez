# commit-ez

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/wwwenjie/commit-ez/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/commit-ez.svg?style=flat-square)](https://www.npmjs.com/package/commit-ez) [![npm downloads](https://img.shields.io/npm/dm/commit-ez.svg?style=flat-square)](https://www.npmjs.com/package/commit-ez)

## About

A git commit cli help git users to write git commit messages easily.

## Install

```
npm install -g commit-ez
```

## Usage

add all files to stage and commit

```
commit
```

more options and commands `commit -h`

```
Usage: commit [options] [command]

A git commit cli help git users to write git commit messages easily.

Options:
  -V, --version        output the version number
  -p, --push           run git pull -r and git push after committing (default: false)
  -s, --scope          add scope to commit message (default: false)
  --staged             only commit staged files (default: false)
  -d, --deep <length>  length of cards for selecting (default: 5)
  -h, --help           display help for command

Commands:
  redo [options]       commit again with last message
  undo                 undo last commit
  ls [options]         output commit message history
  clear                clear all config and history
  config               inspect and modify the config
```
