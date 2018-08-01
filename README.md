## Description

 Transfer txt to mp3,use [Nest](https://github.com/nestjs/nest) .
 Start or debug this project and add text in `/txt/test.txt`,then location to `http://localhost:3000/voice`.Transfered MP3 file will be download Immediately.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
npm run start:prod
```

## Debug in vscode
Just run with launch.json,or add following things in your own launch.json:

```
"program": "${workspaceFolder}\\dist\\main.js",
"preLaunchTask": "tsc: build - tsconfig.json",
"outFiles": [
    "${workspaceFolder}/dist/**/*.js"
]
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

  TxtToAudio is [MIT licensed](LICENSE).
