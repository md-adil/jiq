import { assert, expect } from "chai";
import { picker, at } from "../src/array";

describe("array", () => {
    describe("picker", () => {

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
    });

    describe("#at", () => {

        it("index", () => {
            expect(at([1,3,4], 2)).equal(4);
        });
        
        it("multiple index", () => {
            expect(at([1,3,4], 2, 1)).to.eql([4, 3]);
        })

        it("range index", () => {
            expect(at([1,3, 4, 9, 2], '1:3')).to.eql([3, 4, 9]);
        });

        it("multiple range index", () => {
            expect(at([1, 3, 4, 9, 2, 3, 64], '1:3', 6)).to.eql([3, 4, 9, 64]);
        });

        it("head", () => {
            expect(at([1, 3, 4, 9, 2, 3, 64], ':3')).to.eql([1, 3, 4, 9]);
        });

        it("tail", () => {
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
    });
});
