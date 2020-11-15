import { assert } from "chai";
import { picker } from "../src/array";

describe("util", () => {
    describe("#picker", () => {
        it("list of fields", () => {
            const data = picker("name", "age");
            assert.equal(data.name({ name: "hello" }), "hello");
            assert.equal(data.age({ age: 10 }), 10);
        });

        it("string object", () => {
            const data = picker({ name: "base", age: "old" });
            assert.equal(data.name({ base: "awesome" }), "awesome");
            assert.equal(data.age({ old: 23 }), 23);
        })

        it("function object", () => {
            const data = picker({ name: (x: any) => x.base, age: "old" });
            assert.equal(data.name({ base: "awesome" }), "awesome");
            assert.equal(data.age({ old: 23 }), 23);
        })

        it("nested object", () => {
            const data = picker({ name: "user.name" });
            assert.equal(data.name({ user : { name: "Adil" } }), "Adil");
        });

        it("pick with index", () => {
            const data = picker(["name"]);
            assert.equal(data.name(["Adil"]), "Adil");
        });
    })
})