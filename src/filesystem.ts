import fs from "fs";
import path from "path";


export default function filesystem() {
    Object.defineProperties(fs, {
        exists: {
            value(name: string) {
                return fs.existsSync(name);
            }
        },
        mkdir: {
            value(name: string) {
                fs.mkdirSync(name);
            }
        },
        read: {
            value(name: string) {
                return fs.readFileSync(name, "utf-8");
            }
        },
        write: {
            value(name: string, content?: string) {
                if (!content) {
                    this.touch(name);
                    return "";
                }
                fs.writeFileSync(path.resolve(name), content);
            }
        },
        copy: {
            value(src: string, dest: string, flags?: number) {
                fs.copyFileSync(src, dest, flags)
            }
        },
        touch: {
            value(name: string) {
                const time = new Date();
                try {
                    fs.utimesSync(name, time, time);
                  } catch (err) {
                    fs.closeSync(fs.openSync(name, 'w'));
                  }
                return true;
            }
        },
        delete: {
            value(name: string) {
                fs.unlinkSync(name);
            }
        }
    });
    return fs;
}
