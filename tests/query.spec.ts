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
    });
});
