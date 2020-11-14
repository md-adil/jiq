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

