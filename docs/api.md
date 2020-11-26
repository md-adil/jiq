# API

List of apis and methods

# FileList

FileList class extends [Array](api?id=array).

## append

print / save  more information about file list in console

* Arguments
    * `values (...string)` name of fields to append
* Return
    * `this`

```js
append("owner") // print all information including owner
```
all properties in [File](api?id=file)

## pick
* Argumnets
    * string ...
* Return
    * this

```js
    pick({ create: file => x.create.format("YYYY") })
```

will pick create and modify field


will build create field from file

    pick({fileName: "name"}})

will alias name to file name


and all other methods and properties of array

# File

## Properties

* `isHidden (boolean)` is file is hidden, or starts with `.`
* `isReadable (boolean)` if file can be read by read command
* `isEmpty (boolean)` file is empty
* `base (string)`  full path reletive to current directory
* `name (string)`   filename with extension
* `ext (string)`  extension of file
* `location (string)`  full absolute path
* `date (Date)`  created date (Date)
* `created (Date)`  created date same as date (Date)
* `modified (Date)`  modified date (Date)
* `accessed (Date)`  accessed date (Date)

    see all [Date](api?id=date)

* `user (string)`  user of file (linux / mac only)
* `group (string)`  group of file (linux / mac only)
* `owner (string)`  user/group (linux / mac only) 
* `read (string)` // contents of file (strin
* `delete (boolean)` // delete file and return `true` 

## rename
* Argunments
    * filename (string)
* Return
    * filename (string)

```js
file.rename("users.js")
```

# date
date extends moment you can refer moment.js official docs for more informatation.

## Properties

* `isYeterday (boolean)` check if then date is yesterday 
* `isToday (boolean)` check if date is today
* `isWithinAWeek (boolean)` same name suggest
* `isThisWeek (boolean)`
* `isTwoWeeksOrMore (boolean)`

# Array
Array supports all native operations.

## Properties

* `first` first element same as `items[0]`
* `last` last element same as `items[items.length - 1]`

And all native properties of javascript array like `length`

## at
* Arguments
    * `[values] ( number | ...numbers | ...number:number )` indecies
* Return
    * `(value | value[])` value or array of values

Test cases
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

## head
* Arguments
    * `lenght (number)`
* Return
    * `(value[])`

```js
.head(10) // 10 elements from top
```

## tail
* Arguments
    * `length (number)`
* Return
    * `(value[])`

```js
.tail(10) // 10 elements from bottom
```

## pick

* Arguments
    * `[value] (...string | string[] | {[key: string]: string} | { [key: string]: (value) => value } )`
* Return
    * `(value[])`

iterate over array get key from array

    pick({fullname: "name"});

Alias name key as fullname

    pick({fullname: (item) => item.firstName + item.lastName })

Build your own key alias using callback

    pick

Test cases
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

## except
* Arguments
    * `[key] (...string)`
* Return
    * `(value[])`

name and age property will be removed from array of object.

## pluck
* Arguments
    * `[key] (string)`
    * `[value] (string)`
* Return
    *  `values (string[] | { [key: string]: value })`

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


## filter

* Arguments
    * `filter (string | number | RegExp | (value) => any )`
    * `[value] (string | number | RegExp)`
* Return
    * `this`

## cast

pass all string function to cast on string data.
* Arguments
    * `property (castTo | { [ field:string ]: castTo } | { [field: string]: (value) => value })`
    * `[castTo] (string | (value) => value)`
* Return
    * `this`

```js
let items = ["Hello", "World"];
// all items in the array will be converted to lowercase.
items.cast("lowercase")
// output ["hello", "world"]

let items = [ {user: { age: "20" }} ];
// iterate over items find user.age and make them number set it back.
items.cast("user.age", "number")
//output [ { user: { age: 20 } } ]

let items = [ { name: "John Doe" } ];
// iterate over array call the callback with argument name property of element of array and set it's return back to name property.
items.cast({ name: (name) => name.lowercase})
// output [{ name: "john doe" }] 
```
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


# string

added some flavour to string.

## Properties

`let v = "Hello World"`;

* `uppercase (string)` "HELLO WORLD"
* `lowercase (string)` "hello world"

* `camelcase (string)` "helloWorld"

* `upperfirst (string)` "Hello world"

* `capitalize (string)` "Hello World"

* `kebabcase (string)` "hello-world"

* `snakecase (string)` "hello_world"

* `words (string[])` [ "Hello", "World" ]

* `lines (string[])` split by new line

## limit
* Arguments
    * `lenght (number)` number of char to limits
* Return
    * `value (string)`

```js
let v = "Hello Worlds";
v.limit(8))//  output "Hello..."
```

# Pipes

## keys
* Argument
    * `value (object|array)`
* Return
    * `keys (string[])`

```js
let user = {
    name: "Robert",
    role: "developer"
}

user|keys
// will be converted into
keys(user) // [ "name", "role" ] (string[])

```

## values
* Argument
    * `value (object|array)`
* Return
    * `keys (string[])`

```js
let user = {
    name: "Robert",
    role: "developer"
}

user|values
// will be converted into
values(user) // [ "Robert", "developer" ] (string[])

```

# Globals

## $

* Type
    * `value (any)` parsed from input

## _

lodash, yes you can query data using lodash too
```js
_.upperCase($[0].name)
```

## fs
native nodejs `fs` module.
```js
fs.readFileSync(name) // read the content from file
fs.touch(filename) // create a file change time

// there are some shortcuts, since we don't require async code in our inline javascript, I have replaced some of it's functions
fs.read == fs.readFileSync
fs.write == fs.writeFileSync
fs.copy == fs.copyFileSync
fs.delete == fs.unlinkSync
fs.exists == fs.existsSync
fs.mkdir == fs.mkdirSync
```
