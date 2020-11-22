## File

get all hidden files

    jiq . '.filter(x => x.hidden)'

root is [FileList](api?id=filelist) object which is child of Array, so any array function will be available.

x is [File](api?id=file) object

output

    ┌────────────┬───────────┬──────┐
    │ base       │ type      │ size │
    ├────────────┼───────────┼──────┤
    │ .git       │ directory │ --   │
    │ .gitignore │ false     │ 50 B │
    │ .npmignore │ false     │ 91 B │
    │ .vscode    │ directory │ --   │
    └────────────┴───────────┴──────┘


## Text

    ls | jiq '$'

output

    a.txt
    b.txt
    c.txt


## JSON

    jiq package.json '.dependencies'


output

```json
{
    "commander": "^6.2.0",
    "lodash": "^4.17.20",
    "yaml": "^1.10.0"
}
```

Getting keys of dependencies object as an array with the help of pipes

    jiq package.json '.dependencies|keys'

output

    commander
    lodash
    yaml

Chain with native javascript array functions on output array

    jiq package.json '.dependencies|keys|.map(v => v.uppercase)'

output 

    COMMANDER
    LODASH
    YAML

Save output to a file

    jiq package.json '.dependencies|keys|.map(v => v.uppercase)' --save deps.json

or

    jiq package.json '.dependencies|keys|.map(v => v.uppercase)' --save deps.yaml

> data will be converted according to file extension 

Some built in helper function for array and string

Getting 2 items from top

    jiq package.json '.keywords.head(2)'

output

    javascript inline query
    json query

Printing in table format

    jiq package.json '.keywords' --print table

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


`$` hold current parsed value object

    jiq package.json '$' --save package.yaml

Successfully converted json to yaml

## HTML

you can use jQuery selector and rest is yours

    jiq hello.html '$("a").map((i, x) => ({ value: $(x).html(), text: $(x).attr("href") }))'
    jiq hello.html '$("a").pick(":href", ":text")'

output
```json
[
    {
        ":href": "http://xxx.com/...",
        ":text": "hello world"
    }
]
```

    jiq hello.html '$("a").pick({link: ":href", name: ":text"})'

output
output

    [
        {
            "link": "http://xxx.com/...",
            "name": "hello world"
        }
    ]



Working with remote files using

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

explained:

* `curl <url>` to get data from remote
* `jiq --json` to tell jiq the file content is json
* `'.pick("login", "id")'` iterate over array, get the login, id key and build a new array on top of that.
* `'.head(10)'` take 10 items from top of the array

or

    jiq https://api.github.com/users '$.head(10)'

output
    
    json output from response and take 10 records from top

## CSV

example.csv

    id,name,amount,type,description
    1,Projector,2000,fixed,Projection with audio and video to enhance your classroom/ seminar experience.
    2,Snacks,120,person,"Quick bites like Veg. Sandwich, Burgers are available on request."
    3,Bisleri Water Bottle,20,person,We also serve Bisleri Bottled water if special request billed per person.
    4,CCD Coffee,25,person,CCD Roasted coffee can be served on request payable per person.
    5,CCD Coffee,25,person,"CCD Roasted Coffee is available on request, billable per person to the space."
    6,Audio Conferencing,0,fixed,Host audio meetings with full control
    
Printing in table format

    jiq example.csv

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

    jiq example.csv '.pick("name", "amount", "type")'

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

    jiq example.csv '.pick("name", "amount", "type").filter(x => x.amount >= 25)'

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

    jiq example.csv '.pick("name", "amount", "type").filter(x => x.amount >= 25).cast("amount", "number")'

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

    jiq example.csv '.pick("name", "amount", "type").filter(x => x.amount >= 25).cast("amount", "number")' --print json

output

    [
        { name: 'Projector', amount: 2000, type: 'fixed' },
        { name: 'Snacks', amount: 120, type: 'person' },
        { name: 'CCD Coffee', amount: 25, type: 'person' },
        { name: 'CCD Coffee', amount: 25, type: 'person' }
    ]

Save as json

    jiq .example.csv '.pick("name", "amount", "type").filter(x => x.amount >= 25).cast("amount", "number")' --save example.json
