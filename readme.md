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

## Query with lodash
Use `_` as global variable

    curl https://api.github.com/users | jiq --json '.map(x => x.login).map(_.upperFirsst)'

## Supported data types
* YAML
* JSON
* TEXT

### Pipes
    keys
    values

### Globals
    $ (passed data)
    _ (lodash)

### String functions
    uppercase
    lowercase
    camelcase
    upperfirst
    capitalize
    kebabcase
    snakecase
    limit
    words

### Array functions
    first
    last
    head
    tail
    nth