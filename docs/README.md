# Introduction
use existing javascript knowledge to query or mutate almost any type data, files and directory.

# Installation

    npm -g install jiq

or

    yarn global add jiq


# Let's start

files and directory

    jiq . '.filter(x => x.isDirectory)'

output

    ┌──────────────┬───────────┬──────┐
    │ base         │ type      │ size │
    ├──────────────┼───────────┼──────┤
    │ .git         │ directory │ --   │
    │ .vscode      │ directory │ --   │
    │ assets       │ directory │ --   │
    │ build        │ directory │ --   │
    │ docs         │ directory │ --   │
    │ node_modules │ directory │ --   │
    │ src          │ directory │ --   │
    │ stubs        │ directory │ --   │
    └──────────────┴───────────┴──────┘

rename js to ts file

    jiq . '.filter(x => x.ext === "js").each(x => x.rename(x.name + ".ts"))'


output
    
    rename all js files to ts on specified directory

goto [File](?id=file) section

get json from url and print as table.

    jiq https://reqres.in/api/users '.data' --print table

output

    ┌─────────┬────┬────────────────────────────┬────────────┬───────────┬───────────────────────────────────────────────────────────────────────┐
    │ (index) │ id │           email            │ first_name │ last_name │                                avatar                                 │
    ├─────────┼────┼────────────────────────────┼────────────┼───────────┼───────────────────────────────────────────────────────────────────────┤
    │    0    │ 1  │  'george.bluth@reqres.in'  │  'George'  │  'Bluth'  │  'https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg'  │
    │    1    │ 2  │  'janet.weaver@reqres.in'  │  'Janet'   │ 'Weaver'  │ 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg'  │
    │    2    │ 3  │   'emma.wong@reqres.in'    │   'Emma'   │  'Wong'   │ 'https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg' │
    │    3    │ 4  │    'eve.holt@reqres.in'    │   'Eve'    │  'Holt'   │ 'https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg' │
    │    4    │ 5  │ 'charles.morris@reqres.in' │ 'Charles'  │ 'Morris'  │ 'https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg'  │
    │    5    │ 6  │  'tracey.ramos@reqres.in'  │  'Tracey'  │  'Ramos'  │  'https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg'   │
    └─────────┴────┴────────────────────────────┴────────────┴───────────┴───────────────────────────────────────────────────────────────────────┘

see [printer](?id=print)

with json output

    jiq https://reqres.in/api/users '.data.head(3).pick({email: "email", name: (x) => x.first_name + " " + x.last_name })'

see all available array functions [array](?id=array), and [JSON](?id=json)

output

    [
        { email: 'george.bluth@reqres.in', name: 'George Bluth' },
        { email: 'janet.weaver@reqres.in', name: 'Janet Weaver' },
        { email: 'emma.wong@reqres.in', name: 'Emma Wong' }
    ]


# Modules

## File

get all hidden files

    jiq . '.filter(x => x.hidden)'

root is [FileList](?id=filelist) object which is child of Array, so any array function will be available.

x is [File](?id=file-1) object

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

    jiq example.csv '$'

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

# API
## FileList

FileList class extends Array.

    pick("modified", "create")

will pick create and modify field

    pick({create: file => x.create.format("YYYY") })

will build create field from file

    pick({fileName: "name"}})

will alias name to file name

    append(fields: string[])

add more fields to print


and all other methods and properties of array

## File

#### "File" Properties

    name

filename without extension

    base

filename with extension

    ext

file extension

    location

complete file path

    date

see all [date](?id=date)

type Moment instance

    created

type Moment instance

    modified

type Moment instance

    accessed

type Moment instance

    hidden

if filename stars with .

    empty

file empty or not `(type boolean)`

    read

contents of file `(type string)`

    isDirectory

if file is directory


    delete

will delete path and return true / false


#### "File" Methods

    rename(filename: string)

rename the file.

## date

date extends moment you can refer moment.js official docs for more informatation.

    isYeterday

type boolean

    isToday

type boolean

    isWithinAWeek

type boolean

## array

#### "Array" index

    $[1]

Get item from index 1

    $[1,2]

Get array of items at index 1, 2

    [1:4]

Get array of items from index 1 to index 4

    [-4:]

Get last 4 item

    [:-4]

Get all items except last 4

    [-4:-2]

Get last 4 to last 2 items
behind the scene it usage [at](?id=at) function.


#### "Array" Properties

    first

first element of an array

*Returns*:

`Element` single element

    last

last element

*Returns*:

`Element` single element

And all native properties of javascript array like `length`

#### "Array" Methods

    head(length: number)

get `length` elements from top

*Arguments*:

* `length (number)`

*Return*:

* `element[] (array)`


    tail(length: number)

get number of items from bottom

*Arguments*:
    `length (number)`

*Return*:
* `element[] (array)`


    pick(a, b, ...)

iterate over array get key from array

    pick({fullname: "name"});

Alias name key as fullname

    pick({fullname: (item) => item.firstName + item.lastName })

Build your own key alias using callback

    pick

```js
it("list of fields", () => {
    const data = pick("name", "age");
    assert.equal(data.name({ name: "hello" }), "hello");
    assert.equal(data.age({ age: 10 }), 10);
});

it("string object", () => {
    const data = pick({ name: "base", age: "old" });
    assert.equal(data.name({ base: "awesome" }), "awesome");
    assert.equal(data.age({ old: 23 }), 23);
})

it("function object", () => {
    const data = pick({ name: (x: any) => x.base, age: "old" });
    assert.equal(data.name({ base: "awesome" }), "awesome");
    assert.equal(data.age({ old: 23 }), 23);
})

it("nested object", () => {
    const data = pick({ name: "user.name" });
    assert.equal(data.name({ user : { name: "Adil" } }), "Adil");
});

it("pick with index", () => {
    const data = pick(["name"]);
    assert.equal(data.name(["Adil"]), "Adil");
});
```


    except("name", "age")

name and age property will be removed from array of object.

    pluck("name")

array of name property

    pluck("name", "age")

return an object where key will name property and value will be age

ex:
    
input data

    [
        {
            name: "John",
            age: 30
        }
    ]

query

    .pluck("name", "age")

output

    {
        "John": 30
    }

_


    cast("name", "uppercase")

pass all string function to cast on string data.

we have an array of string

    cast("lowercase")

all string will be casted to lower cast

    cast("user.age", "number")

age propert of user object will be casted to number.

    cast({name: (name) => name.lowercase})

use callback to cast data accordingly

    cast

```js
it("string to number", () => {
    expect(cast("123", "number")).equal(123);
})

it("string[] to number[]", () => {
    expect(cast(["123"], "number")).to.eql([123]);
});

it("{[ key: string]: string } to {[key: string: number}", () => {
    expect(cast({ amount: "1000" }, "amount", "number" )).to.eql({ amount: 1000 });
    expect(cast({ amount: "1000" }, { amount: "number" })).to.eql({ amount: 1000 });
    expect(cast({ amount: "1000" } as any, { "amount": x => parseInt(x) })).to.eql({ amount: 1000 });
});

it("{[ key: string]: string } to {[key: string: number}", () => {
    expect(cast([{ amount: "1000" }], "amount", "number" )).to.eql([{ amount: 1000 }]);
    expect(cast([{ amount: "1000" }], { amount: "number" })).to.eql([{ amount: 1000 }]);
    expect(cast({ amount: "1000" } as any, { "amount": x => parseInt(x) })).to.eql({ amount: 1000 });
});

it("nested object", () => {
    expect(cast([{ product: { amount: "1000" } }] as any, "product.amount", "number" )).to.eql([{ product: { amount: 1000 } }]);
    expect(cast([{ product: { amount: "1000" } }] as any, { "product.amount": "number"} )).to.eql([{ product: { amount: 1000 } }]);
});
```


    at

```js
it("get value at index 2", () => {
    expect(at([1,3,4], 2)).equal(4);
});

it("get values multiple index", () => {
    expect(at([1,3,4], 2, 1)).to.eql([4, 3]);
})

it("range index", () => {
    expect(at([1,3, 4, 9, 2], '1:3')).to.eql([3, 4, 9]);
});

it("multiple range index", () => {
    expect(at([1, 3, 4, 9, 2, 3, 64], '1:3', 6)).to.eql([3, 4, 9, 64]);
});

it("get # values from top", () => {
    expect(at([1, 3, 4, 9, 2, 3, 64], ':3')).to.eql([1, 3, 4, 9]);
});

it("get # values from bottom", () => {
    expect(at([1, 3, 4, 9, 2, 3, 64], '3:')).to.eql([ 9, 2, 3, 64 ]);
});

it("negative index", () => {
    expect(at([32, 4, 12, 40], -1)).equal(40);
    expect(at([32, 4, 12, 40], -2)).equal(12);
});

it("range with negative index ", () => {
    expect(at([32, 4, 12, 40], '-2:-1')).to.eql([ 12, 40 ]);
    expect(at([12, 17, 32, 4, 12, 40], '-4:-2')).to.eql([ 32, 4, 12]);
});

it("negative head", () => {
    expect(at([32, 4, 12, 40], '-2:')).to.eql([12, 40]);
    expect(at([32, 4, 12, 40, 11, 18], '-4:')).to.eql([12, 40, 11, 18]);
});

it("negative tail", () => {
    expect(at([32, 4, 12, 40], ':-2')).to.eql([32, 4, 12]);
    expect(at([32, 4, 12, 40, 11, 18], ':-4')).to.eql([32, 4, 12]);
});
```

## string

#### "String" Properties

where `var v = "Hello World"`.

### uppercase
    `v.uppercase` output `"HELLO WORLD"`
### lowercase
    `v.lowercase`  output `"hello world"`
### camelcase
    `v.camelcase`  output `"helloWorld"`
### upperfirst
    `v.upperfirst`  output `"Hello world"`
### capitalize
    `v.capitalize`  output `"Hello World"`
### kebabcase
    `v.kebabcase`  output `"hello-world"`
### snakecase
    `v.snakecase`  output `"hello_world"`
### limit
    `v.limit(8))` output `"Hello..."`
### words
    `v.words` split by words
    curl https://api.github.com/users | jiq --json '.map(x => x.login).map(_.upperFirst)'


## Pipes

    $|keys

`$` is an object then return array keys


    $|values

`$` is an object then return array of values


## Globals

    $

root object or array

    _

lodash, yes you can query data using lodash too

ex:

    _.upperCase($[0].name)

uppercase of name

    keys($)

get all keys root object

    values($)

get values of root object

    cast($, "name", "lowercase")

cast `name` property of `$` array in lowercase


## print

usage

    --print <format>

available formats

* json
* yaml
* table
* txt
* xml


## save

usage

    --save <filename>.<ext>

save output, data will be cast automatically

Ex:

    --save users.json

data will be cast to json

    --save users.csv

data will be cast to csv


Read full [documentation](https://md-adil.github.io/jiq/) here.
