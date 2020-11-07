# JSON querying with javascript and lodash

## Let's start

    jiq '.dependencies' package.json
    jiq '.scripts|keys|.filter(v => /^test/.test(v))' package.json

### Pipes
    keys
    values

### Globals
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
    uppercase
    lowercase
    camelcase
    upperfirst
    capitalize
    kebabcase
    snakecase
    limit
    words