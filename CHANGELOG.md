# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.1](https://github.com/wwwenjie/commit-ez/compare/v2.0.0...v2.0.1) (2022-09-28)


### Bug Fixes

* card name doesnt save when select from history ([f819652](https://github.com/wwwenjie/commit-ez/commit/f819652d6aaae3f5b91031454a16c6c9c6cc9c79))

## [2.0.0](https://github.com/wwwenjie/commit-ez/compare/v1.5.0...v2.0.0) (2022-08-16)


### ⚠ BREAKING CHANGES

* change card description to card name, add formats
* add -s --scope option, move -s --staged to --staged

### Features

* add -s --scope option, move -s --staged to --staged ([0092ebd](https://github.com/wwwenjie/commit-ez/commit/0092ebdbd49451c67b911b73182f785e309d79b9))
* add push option to redo, add deep option to ls ([44d839d](https://github.com/wwwenjie/commit-ez/commit/44d839db6e7e3d1b0715fb856fa0b5bae37c234f))
* change card description to card name, add formats ([9b67ad4](https://github.com/wwwenjie/commit-ez/commit/9b67ad4419f4fda8378a6ebd11d594976abfa9d0))
* config with select, add config for integrations ([90a61ec](https://github.com/wwwenjie/commit-ez/commit/90a61ecb9abc3b97fffbcecf90af551bef4b6987))
* move description after card in prompts ([07fdadd](https://github.com/wwwenjie/commit-ez/commit/07fdaddc8fa4405bb890562f6badafc91598586f))


### Bug Fixes

* ora showing when set trello token ([16c650b](https://github.com/wwwenjie/commit-ez/commit/16c650bc46c77eb365335d8c06d3bd22df993a68))

## [1.5.0](https://github.com/wwwenjie/commit-ez/compare/v1.4.0...v1.5.0) (2022-06-09)


### Features

* add -p --push tag to run git push after committing ([ffc294a](https://github.com/wwwenjie/commit-ez/commit/ffc294adb7d5df65d4de94629c3c8cedccd93f2c))
* add promots for invalid argument when call single commit command ([5eba1de](https://github.com/wwwenjie/commit-ez/commit/5eba1de11782fc45066b88845a564d5a4777f9ec))
* add spinner when fetch cards remote ([744e3cf](https://github.com/wwwenjie/commit-ez/commit/744e3cfe71f95c28071e6a0e11e855caf3f4ee8c))
* handle 401 when fetch trello cards ([f4a4f2b](https://github.com/wwwenjie/commit-ez/commit/f4a4f2ba0772c154195a4fea90c93a8620804d6e))
* trello integration ([581777e](https://github.com/wwwenjie/commit-ez/commit/581777eca7558b463adb84b881b0dbceb5e9d70c))
* use password type when input key and token ([c9de8bc](https://github.com/wwwenjie/commit-ez/commit/c9de8bc0bef24cb0714d86fc0fc4cfa2b6307d67))


### Bug Fixes

* handle string input in --deep option ([a3efd96](https://github.com/wwwenjie/commit-ez/commit/a3efd96d68361f11aeaf0478b3af7a0b692b5333))

## [1.4.0](https://github.com/wwwenjie/commit-ez/compare/v1.3.2...v1.4.0) (2022-05-13)


### Features

* add commit message when redo ([84f972c](https://github.com/wwwenjie/commit-ez/commit/84f972cb8c0e26414bf717dfd309cf83755bbb0d))


### Bug Fixes

* add git add in redo command ([2e98158](https://github.com/wwwenjie/commit-ez/commit/2e981585fb6971be1ba4ec7a261381d2dd103c52))

### [1.3.2](https://github.com/wwwenjie/commit-ez/compare/v1.3.1...v1.3.2) (2022-04-19)


### Bug Fixes

* move card description prompt to last ([f5258e1](https://github.com/wwwenjie/commit-ez/commit/f5258e1d8f398bfb4f2d81ebf670c875e5c993c9))

### [1.3.1](https://github.com/wwwenjie/commit-ez/compare/v1.3.0...v1.3.1) (2022-04-18)


### Bug Fixes

* history order when redo and output json ([9a9babc](https://github.com/wwwenjie/commit-ez/commit/9a9babce31afe135a70a15cea2365fbe28c9804f))

## [1.3.0](https://github.com/wwwenjie/commit-ez/compare/v1.2.1...v1.3.0) (2022-04-16)


### Features

* add redo and undo command ([17e0d5e](https://github.com/wwwenjie/commit-ez/commit/17e0d5e3eb25ba6d49d86cb789d457dd02df2814))
* check update ([3b8b79d](https://github.com/wwwenjie/commit-ez/commit/3b8b79d8274b837de3c80ccdd97d3865cfecfeac))
* show infinity depth when config --json ([d3925e3](https://github.com/wwwenjie/commit-ez/commit/d3925e307656e616dd951701b3001c340518ac29))


### Bug Fixes

* avoid console git error message again ([4975a30](https://github.com/wwwenjie/commit-ez/commit/4975a30243dbb6e3557a14cd124e2d910c548379))
* card description missing when select from options ([9d80ad1](https://github.com/wwwenjie/commit-ez/commit/9d80ad1da9fd05c326874dabce5786c2e4273220))

### [1.2.1](https://github.com/wwwenjie/commit-ez/compare/v1.2.0...v1.2.1) (2022-04-12)


### Bug Fixes

* check node version ([0c6359e](https://github.com/wwwenjie/commit-ez/commit/0c6359effe8b763341fbcb41c416034ae67412d1))

## [1.2.0](https://github.com/wwwenjie/commit-ez/compare/v1.1.2...v1.2.0) (2022-04-12)


### Features

* add card description ([73e38c0](https://github.com/wwwenjie/commit-ez/commit/73e38c0e91696930efed5a5da7c34593dcd5d0f2))
* add commander and several new options ([56e8554](https://github.com/wwwenjie/commit-ez/commit/56e85549acb5cde1f6594422abea19b98511e90f))
* add pkg in utils ([beff705](https://github.com/wwwenjie/commit-ez/commit/beff70577dedbb636983ed8879b5f2fe4b071af9))
* set execa stdio to inherit ([9a38ff4](https://github.com/wwwenjie/commit-ez/commit/9a38ff4cc77ea76b21b1bd89a0dbd24c876f78d5))
* show history and double confirm when clear data ([cf789c1](https://github.com/wwwenjie/commit-ez/commit/cf789c1c97eaa1248f780a2c499aa149f1b7cac9))

### [1.1.2](https://github.com/wwwenjie/commit-ez/compare/v1.1.1...v1.1.2) (2022-04-11)


### Bug Fixes

* publish on new tags ([7021e3c](https://github.com/wwwenjie/commit-ez/commit/7021e3c693205880725d9296862f4655f15c999f))

### [1.1.1](https://github.com/wwwenjie/commit-ez/compare/v1.1.0...v1.1.1) (2022-04-11)


### Bug Fixes

* publish workflow use yarn ([46ac4be](https://github.com/wwwenjie/commit-ez/commit/46ac4be2cd96bb3b5c371ae53c17339b649778b0))

## 1.1.0 (2022-04-11)


### Features

* add format select ([07b3c17](https://github.com/wwwenjie/commit-ez/commit/07b3c17bbe520c7eeaa856b7f0de475c344b5071))
* init project ([e8d41b7](https://github.com/wwwenjie/commit-ez/commit/e8d41b7ebcf61c6a327e32a8e29244d3b19460c4))


### Bug Fixes

* typo ([3d05d9c](https://github.com/wwwenjie/commit-ez/commit/3d05d9cdd6184b1530832b0dd0cd1fe76db445cb))
