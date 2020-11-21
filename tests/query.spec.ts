import { expect } from "chai";
import * as query from "../src/query";
describe("query", () => {
    describe("build", () => {
        it("prefix with $", () => {
            expect(query.build(".").startsWith("$")).to.be.true
            expect(query.build("[1]")).to.be.eq("$[1]")
        });

        it("pipe wrapping", () => {
            expect(query.build("name|hello|world")).be.equal("world(hello(name))");
        });

        it("index with single argument", () => {
            expect(query.build("[1]")).be.equal("$[1]");
        });

        it("index with range argument", () => {
            expect(query.build("[1:2]")).be.equal("$.at('1:2')");
        });

        it("index with multiple argument", () => {
            expect(query.build("[1,2,4]")).be.equal("$.at(1,2,4)");
        });

        it("index with variable name string", () => {
            expect(query.build("[name]")).be.eq("$[name]");
        });
    });
});
