# Javascript Inline Query (jiq)

## Installation

    npm -g install jiq

or

    yarn global add jiq

> Concept: use existing javascript knowledge to query or mutate almost data


## Let's start

    jiq '.dependencies' package.json
    jiq '.scripts|keys|.filter(v => /^test/.test(v))' package.json
    ls | jiq '.map(v => v.uppercase)' --save list.txt
    curl https://api.github.com/users | jiq --json '.map(x => x.login)'
    jiq '.pick("login", "id")' https://api.github.com/users --print table

## Working with json files

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

Printing in table format

    jiq '.keywords' package.json --print table

output

    ┌─────────┬───────────────────────────┐
    │ (index) │          Values           │
    ├─────────┼───────────────────────────┤
    │    0    │ 'javascript inline query' │
    │    1    │       'json query'        │
    │    2    │    'json inline query'    │
    │    3    │          'json'           │
    │    4    │          'yaml'           │
    │    5    │          'query'          │
    └─────────┴───────────────────────────┘

### Using `$`

`$` hold current parsed value object

    jiq '$' package.json --save package.yaml

Successfully converted json to yaml

## Working with HTML

you can use jQuery selector and rest is yours

    jiq '$("a").map((i, x) => ({ value: $(x).html(), text: $(x).attr("href") }))' hello.html
    jiq '$("a").pick(":href", ":text")' hello.html

output

    [
        {
            ":href": "http://xxx.com/...",
            ":text": "hello world"
        }
    ]

##

    jiq '$("a").pick({link: ":href", name: ":text"})' hello.html

output
output

    [
        {
            "link": "http://xxx.com/...",
            "name": "hello world"
        }
    ]



## Working with remote files using

    curl https://api.github.com/users -q | jiq --json '.pick("login", "id")' --print table

output

    ┌─────────┬────────────┬────┐
    │ (index) │   login    │ id │
    ├─────────┼────────────┼────┤
    │    0    │ 'mojombo'  │ 1  │
    │    1    │ 'defunkt'  │ 2  │
    │    2    │ 'pjhyett'  │ 3  │
    │    3    │  'wycats'  │ 4  │
    │    4    │ 'ezmobius' │ 5  │
    └─────────┴────────────┴────┘

### explained:

* `curl <url>` to get data from remote
* `jiq --json` to tell jiq the file content is json
* `'.pick("login", "id")'` iterate over array, get the login, id key and build a new array on top of that.
* `'.head(10)'` take 10 items from top of the array

or

    jiq '$.head(10)' https://api.github.com/users

output
    
    json output from response and take 10 records from top

## Working with csv

example.csv

    id,name,amount,type,description
    1,Projector,2000,fixed,Projection with audio and video to enhance your classroom/ seminar experience.
    2,Snacks,120,person,"Quick bites like Veg. Sandwich, Burgers are available on request."
    3,Bisleri Water Bottle,20,person,We also serve Bisleri Bottled water if special request billed per person.
    4,CCD Coffee,25,person,CCD Roasted coffee can be served on request payable per person.
    5,CCD Coffee,25,person,"CCD Roasted Coffee is available on request, billable per person to the space."
    6,Audio Conferencing,0,fixed,Host audio meetings with full control
    
###

    jiq '$' example.csv

`$` is javascript array of example.csv file, and default printer is set to table

output

    ┌─────────┬─────┬────────────────────────┬────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────┐
    │ (index) │ id  │          name          │ amount │   type   │                                   description                                    │
    ├─────────┼─────┼────────────────────────┼────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────┤
    │    0    │ '1' │      'Projector'       │ '2000' │ 'fixed'  │ 'Projection with audio and video to enhance your classroom/ seminar experience.' │
    │    1    │ '2' │        'Snacks'        │ '120'  │ 'person' │       'Quick bites like Veg. Sandwich, Burgers are available on request.'        │
    │    2    │ '3' │ 'Bisleri Water Bottle' │  '20'  │ 'person' │   'We also serve Bisleri Bottled water if special request billed per person.'    │
    │    3    │ '4' │      'CCD Coffee'      │  '25'  │ 'person' │        'CCD Roasted coffee can be served on request payable per person.'         │
    │    4    │ '5' │      'CCD Coffee'      │  '25'  │ 'person' │ 'CCD Roasted Coffee is available on request, billable per person to the space.'  │
    │    5    │ '6' │  'Audio Conferencing'  │  '0'   │ 'fixed'  │                     'Host audio meetings with full control'                      │
    └─────────┴─────┴────────────────────────┴────────┴──────────┴──────────────────────────────────────────────────────────────────────────────────┘

picking name, amount and type

    jiq '.pick("name", "amount", "type")' .example.csv

output

    ┌─────────┬────────────────────────┬────────┬──────────┐
    │ (index) │          name          │ amount │   type   │
    ├─────────┼────────────────────────┼────────┼──────────┤
    │    0    │      'Projector'       │ '2000' │ 'fixed'  │
    │    1    │        'Snacks'        │ '120'  │ 'person' │
    │    2    │ 'Bisleri Water Bottle' │  '20'  │ 'person' │
    │    3    │      'CCD Coffee'      │  '25'  │ 'person' │
    │    4    │      'CCD Coffee'      │  '25'  │ 'person' │
    │    5    │  'Audio Conferencing'  │  '0'   │ 'fixed'  │
    └─────────┴────────────────────────┴────────┴──────────┘


Filter records with native javascript functions

    jiq '.pick("name", "amount", "type").filter(x => x.amount >= 25)' .example.csv

output

    ┌─────────┬──────────────┬────────┬──────────┐
    │ (index) │     name     │ amount │   type   │
    ├─────────┼──────────────┼────────┼──────────┤
    │    0    │ 'Projector'  │ '2000' │ 'fixed'  │
    │    1    │   'Snacks'   │ '120'  │ 'person' │
    │    2    │ 'CCD Coffee' │  '25'  │ 'person' │
    │    3    │ 'CCD Coffee' │  '25'  │ 'person' │
    └─────────┴──────────────┴────────┴──────────┘

Cast amount field as number

    jiq '.pick("name", "amount", "type").filter(x => x.amount >= 25).cast("amount", "number")' .example.csv

output

    ┌─────────┬──────────────┬────────┬──────────┐
    │ (index) │     name     │ amount │   type   │
    ├─────────┼──────────────┼────────┼──────────┤
    │    0    │ 'Projector'  │  2000  │ 'fixed'  │
    │    1    │   'Snacks'   │  120   │ 'person' │
    │    2    │ 'CCD Coffee' │   25   │ 'person' │
    │    3    │ 'CCD Coffee' │   25   │ 'person' │
    └─────────┴──────────────┴────────┴──────────┘

print as json

    jiq '.pick("name", "amount", "type").filter(x => x.amount >= 25).cast("amount", "number")' .example.csv --print json

output

    [
        { name: 'Projector', amount: 2000, type: 'fixed' },
        { name: 'Snacks', amount: 120, type: 'person' },
        { name: 'CCD Coffee', amount: 25, type: 'person' },
        { name: 'CCD Coffee', amount: 25, type: 'person' }
    ]

Save as json

    jiq '.pick("name", "amount", "type").filter(x => x.amount >= 25).cast("amount", "number")' .example.csv --save example.json

## Query with lodash

Use `_` as global variable

    curl https://api.github.com/users | jiq --json '.map(x => x.login).map(_.upperFirst)'

## Supported data types

* yaml
* json
* text
* xml
* html

### Pipes

* keys
* values

### Globals

* $ (passed data)
* _ (lodash)

### String functions

where `var v = "Hello World"`.

* `v.uppercase` output `"HELLO WORLD"`
* `v.lowercase`  output `"hello world"`
* `v.camelcase`  output `"helloWorld"`
* `v.upperfirst`  output `"Hello world"`
* `v.capitalize`  output `"Hello World"`
* `v.kebabcase`  output `"hello-world"`
* `v.snakecase`  output `"hello_world"`
* `v.limit(8))` output `"Hello..."`
* `v.words` split by words

### Array functions

* first
* last
* head(x) get x values from top
* tail(x) get x values from bottom
* nth(x) get x position eg: nth(-2) second last item
* pick(a, b, ...) iterate over array get key from array
* except(a, b, ...) reverse of pick
* pluck("key") or pluck("key", "val")
* cast("field", "cast to")

Read full [documentation](https://md-adil.github.io/jiq/) here.
