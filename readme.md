# Javascript Inline Query (jiq)
#### JSON querying with javascript and lodash

## Installation

    npm -g install jiq

or

    yarn global add jiq

> Concept: use existing javascript knowledge to query or mutate data


## Let's start

    jiq '.dependencies' package.json
    jiq '.scripts|keys|.filter(v => /^test/.test(v))' package.json
    ls | jiq '.map(v => v.uppercase)' --save list.txt
    curl https://api.github.com/users | jiq --json '.map(x => x.login)'

### Use Case

We have a file

    package.json

```json
{
    "name": "jiq",
    "version": "0.0.2",
    "description": "Use existing javascript knowledge to query or mutate data",
    "keywords": ["javascript inline query", "json query", "json inline query", "json", "yaml", "query"],
    "main": "build/index.js",
    "author": {
        "name": "Adil",
        "email": "adil.sudo@gmail.com",
        "url": "https://md-adil.github.io"
    },
    "homepage": "https://md-adil.github.io/jiq/",
    "repository": {
        "url": "https://md-adil.github.io/jiq/",
        "type": "git"
    },
    "license": "MIT",
    "scripts": {
        "watch": "tsc -w",
        "build": "tsc",
        "start": "node ./build"
    },
    "devDependencies": {
        "@types/lodash": "^4.14.165",
        "@types/node": "^14.14.6"
    },
    "dependencies": {
        "commander": "^6.2.0",
        "lodash": "^4.17.20",
        "yaml": "^1.10.0"
    },
    "bin": "./build/index.js"
}
```

Getting name property

    jiq '.name' package.json

output

    jiq

Getting all dependencies

    jiq '.dependencies' package.json

output

```json
{
    "commander": "^6.2.0",
    "lodash": "^4.17.20",
    "yaml": "^1.10.0"
}
```

Getting keys of dependencies object as an array with the help of pipes

    jiq '.dependencies|keys' package.json

output

    commander
    lodash
    yaml

Chain with native javascript array functions on output array

    jiq '.dependencies|keys|.map(v => v.uppercase)' package.json

output 

    COMMANDER
    LODASH
    YAML

Save output to a file

    jiq '.dependencies|keys|.map(v => v.uppercase)' package.json --save deps.json

or

    jiq '.dependencies|keys|.map(v => v.uppercase)' package.json --save deps.yaml

> data will be converted according to file extension 

Some built in helper function for array and string

Getting 2 items from top

    jiq '.keywords.head(2)' package.json

output

    javascript inline query
    json query

### Using `$`

`$` hold current parsed value object

    jiq '$' package.json --save package.yaml

Successfully converted json to yaml

## Working on remote files using

    curl https://api.github.com/users | jiq --json '.map(x => x.login)'

### explained:

* `curl <url>` to get data from remote
* `jiq --json` to tell jiq the file content is json
* `'.map(x => x.login)'` iterate over array, get the login key and build a new array on top of that.

## Query with lodash

Use `_` as global variable

    curl https://api.github.com/users | jiq --json '.map(x => x.login).map(_.upperFirst)'

## Supported data types

* YAML
* JSON
* TEXT

### Pipes

* keys
* values

### Globals

* $ (passed data)
* _ (lodash)

### String functions

* uppercase
    `'.map(v => v.uppercase)'`
* lowercase `.map(v => v.lowercase)`
* camelcase `.map(v => v.camelcase)`
* upperfirst `.map(v => v.upperfirst)`
* capitalize `.map(v => v.capitalize)`
* kebabcase `.map(v => v.kebabcase)`
* snakecase
* limit `.map(v => v.limit(10))` return max 10 chars
* words

### Array functions

* first
* last
* head(x) get x values from top
* tail(x) get x values from bottom
* nth(x) get x position eg: nth(-2) second last item

Read full [documentation](https://md-adil.github.io/jiq/) here.
