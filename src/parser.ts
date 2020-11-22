import { EOL } from "os";
import YAML from "yaml";
import csvParse from "csv-parse/lib/sync";
import type { FileType } from "./io";
import csvStringify from "csv-stringify/lib/sync";
import XML from "fast-xml-parser";
import File from "./file";

import FileList from "./file-list";

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
            return require("./html").default(content);
        }
        case "file":
            const paths = content.split(EOL);
            if (paths.length === 1) {
                return new FileList(new File(paths[0]));
            }
            const fileList = new FileList();
            paths.forEach(p => {
                fileList.push(new File(p));
            })
            return fileList;
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
