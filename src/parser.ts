import { EOL } from "os";
import YAML from "yaml";
import csvParse from "csv-parse/lib/sync";
import type { FileType } from "./io";
import csvStringify from "csv-stringify/lib/sync";
import XML from "fast-xml-parser";
import * as cheerio from "cheerio";
import File from "./file";

const bindHTMLFunctions = ($ : cheerio.Root) => {
    const getElementData = (root: any, query: string) => {
        const [ selector, attr ] = query.split(":");
        const el = selector ? root.find(selector) : root;
        if (!attr || attr === "text") {
            return el.text()?.replace(/[\n\t\r]/g," ").trim();
        }
        if (attr === "html") {
            return el.html();
        }
        return el.attr(attr);
    }
    $.prototype.pick = function pick(...args: any) {
        return this.map(function(i: number, el: cheerio.Root) {
            const item: any = {};
            if (typeof args[0] === "string") {
                for (const arg of args) {
                    item[arg] = getElementData($(el), arg);
                }
                return item;
            }
            for (const name in args[0]) {
                const selector = args[0][name];
                item[name] = getElementData($(el), selector);
            }
            return item;
        }).toArray();
    }
}

export const parse = (content: string, fileType: FileType) => {
    switch(fileType) {
        case "json":
            return JSON.parse(content);
        case "yaml":
            return YAML.parse(content);
        case "csv":
            return csvParse(content, {
                columns: true,
                bom: true,
                skipEmptyLines: true,
            });
        case "xml":
            return XML.parse(content, { ignoreAttributes: false });
        case "txt":
            return content.split(EOL);
        case "html": {
            const $ = cheerio.load(content);
            bindHTMLFunctions($);
            return $;
        }
        case "file":
            const paths = content.split(EOL);
            if (paths.length === 1) {
                return new File(paths[0]);
            }
            return paths.map((p: string) => new File(p));
    }
};


export const stringify = (data: any, fileType: FileType) => {
    switch(fileType) {
        case "json":
            return JSON.stringify(data, null, 4);
        case "yaml":
            return YAML.stringify(data);
        case "csv":
            return csvStringify(data, {
                header: true
            });
        case "xml": {
            const parser = new XML.j2xParser({ignoreAttributes: false});
            return parser.parse(data);
        }
        case "txt":
            return data.join(EOL);
        default:
            return JSON.stringify(data, null, 4);
    }
}
