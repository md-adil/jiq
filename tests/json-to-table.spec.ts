import { expect } from "chai";
import { flatObject } from "../src/json-to-table";

describe("json-to-table", () => {
    describe("flatObject", () => {
        it("nested object", () => {
            expect(flatObject({user: { name: "adil" }})).to.deep.equal({"user.name": "adil"});
        });

        it("nested object", () => {
            expect(flatObject({ user: [ { name: "adil" } ]})).to.deep.equal({"user.0.name": "adil"});
        });

        it("printable array", () => {
            expect(flatObject({ user: [ "adil", "Ali", "Sahil" ]})).to.deep.equal({"user": "adil, Ali, Sahil"});
        });
    });
});