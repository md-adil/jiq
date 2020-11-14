import { Readable } from "stream";
import { EOL } from "os";
import YAML from "yaml";
import util from "util";
import type { FileType } from "./io";
import XML from "fast-xml-parser";
import { table, getBorderCharacters }from "table";
import File from "./file";
import chalk from "chalk";
import FileList from "./file-list";
import cheerio from "cheerio";
import _ from "lodash";
import { build } from "./query";

const validPrinters = [ "json", "table", "txt", "yaml", "xml" ] as const;
export type PrinterTypes = typeof validPrinters[number];

export function print(data: any, fileType: FileType, printer?: PrinterTypes): void {
    if (printer && !validPrinters.includes(printer)) {
        throw new Error(`${printer} is invalid printer, valid printers are ( ${validPrinters.join(' / ')} )`);
    }
    switch(printer) {
        case "table":
            return console.table(data);
        case "json":
            return printJSON(data);
        case "yaml":
            process.stdout.write(YAML.stringify(data));
            process.stdout.write(EOL);
            return;
        case "xml":
            return printXML(data);
        case "txt":
            return writeToStdout(data);
    }

    switch(fileType) {
        case "csv":
            return console.table(data);
        case "json":
            return printJSON(data);
        case "txt":
            return writeToStdout(data);
        case "file":
            return printFile(data);
        case "html":
            return printHTML(data);
    }
    console.log(data);
}

const printJSON = (data: any) => {
    if (data.toJSON && typeof data.toJSON === "function") {
        data = data.toJSON();
    }
    process.stdout.write(util.inspect(data, false, null, true));
    process.stdout.write(EOL);
    return;
}

const printFile = (data: FileList | File) => {
    if (data instanceof File) {
        data = new FileList(data);
    }
    if (!(data instanceof FileList)) {
        return console.table(data);
    }
    console.log(
        table(data.toTable(), {
            border: getBorderCharacters("norc"),
            drawHorizontalLine(x, size) {
                return x == 0 || x === 1 || x == size;
            }
        })
    )
    return;
}

const printHTML = (data: cheerio.Cheerio) => {
    if (!(data instanceof cheerio)) {
        return console.log(data);
    }
    if (!data.length) {
        return;
    }
    let headers: string[] = [];

    if (data.prop('tagName').toLowerCase() === 'a') {
        headers = [ 'id', 'text', 'class', 'href', 'parent' ];
    } else {
        headers = [
            'text', 'id', 'class', 'parent'
        ];
    }
    const rows: string[][] = [];
    for (let i = 0; i < data.length; i++ ) {
        const row: string[] = [];
        const el = data.eq(i);
        for (const header of headers) {
            switch(header) {
                case "text":
                    row.push(chalk.blue(santizeText(el.text())));
                    break;
                case "parent":
                    row.push(chalk.yellow(buildTag(el.parent())))
                    break;
                case "class":
                    row.push(chalk.dim(buildClassName(el)));
                    break;
                case "href":
                    row.push(chalk.green(el.attr("href")));
                    break;
                default:
                    row.push(
                        el.attr(header) ?? ''
                    )
            }
        }
        rows.push(row);
    }
    const out = table([headers, ...rows], {
        border: getBorderCharacters("norc"),
        drawHorizontalLine(x, size) {
            return x == 0 || x === 1 || x == size;
        }
    });
    console.log(out);
}

const santizeText = (txt: string) => {
    txt = txt.replace(/[\s+\t+\n+]/g, " ");
    return _.truncate(txt, {
        length: 50,
    })
}

const buildTag = (el: cheerio.Cheerio) => {
    if (el.length === 0) {
        return '';
    }
    let name = el.prop('tagName').toLowerCase();
    const id = el.attr('id');
    if (id) {
        name += '#' + id;
    }
    let cls = buildClassName(el);
    if (cls) {
        name += '.' + cls;
    }
    return name;
}

const buildClassName = (el: cheerio.Cheerio) => {
    let cls = el.prop('class');
    if (!cls) {
        return '';
    }
    return _.truncate(cls.split(' ').join('.'), {length: 20});
}

const printXML = (data: any) => {
    const parser = new XML.j2xParser({ ignoreAttributes: false, format: true });
    console.log(parser.parse(data));
}

function writeToStdout(items: string | (string | number)[]) {
    if (Array.isArray(items)) {
        const stream = new Readable({
            read(bits) {
                if (!items.length) {
                    return this.push(null);
                }
                this.push(items.shift() + EOL);
            },
        });
        stream.on("error", (err) => {
            console.log(err.message);
        });
        stream.pipe(process.stdout).on("error", (e) => {
            console.log(e.message);
        });
        return;
    }
    console.log(items);
}
