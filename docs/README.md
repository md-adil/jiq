# Introduction
### Javascript Inline Query (jiq) a command line tool.
Use existing javascript knowledge to query or mutate almost any type data, files and directory.

# Installation

    npm -g install jiq

or

    yarn global add jiq


# Let's start


    jiq

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

filter directory only

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

goto [File](api?id=file), [File List](api?id=filelist) [Array](api?id=array)

let say we have a `package.json` file

    jiq package.json .script

```json
{
    "start": "node index.js"
}
```

see [JSON](modules?id=json)

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

see [printer](output?id=print)

with json output

    jiq https://reqres.in/api/users '.data.head(3).pick({email: "email", name: (x) => x.first_name + " " + x.last_name })'

see all available array functions [array](?id=array), and [JSON](?id=json)

output

    [
        { email: 'george.bluth@reqres.in', name: 'George Bluth' },
        { email: 'janet.weaver@reqres.in', name: 'Janet Weaver' },
        { email: 'emma.wong@reqres.in', name: 'Emma Wong' }
    ]

Read full [documentation](https://md-adil.github.io/jiq/) here.
