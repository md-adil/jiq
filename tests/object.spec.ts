import { expect } from "chai";
import moment from "moment";
import { cast, type } from "../src/object";
import File from "../src/file";
import FileList from "../src/file-list";

describe("object", () => {
    describe("#type", () => {
        it("array type", () => {
            expect(type([])).equal("array");
        });

        it("file type", () => {
            expect(type(new File('.'))).equal("File");
        });

        it("file list type", () => {
            expect(type(new FileList)).equal("FileList");
        });

        it("object type", () => {
            expect(type({})).equal("object");
        });

        it("string type", () => {
            expect(type("string")).equal("string");
        });

        it("number type", () => {
            expect(type(1234)).equal("number");
        });

        it("date type", () => {
            expect(type(moment())).equal("date");
        });
    });

    describe("#cast", () => {
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
    })
})