"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function filesystem() {
    Object.defineProperties(fs_1.default, {
        exists: {
            value(name) {
                return fs_1.default.existsSync(name);
            }
        },
        mkdir: {
            value(name) {
                fs_1.default.mkdirSync(name);
            }
        },
        read: {
            value(name) {
                return fs_1.default.readFileSync(name, "utf-8");
            }
        },
        write: {
            value(name, content) {
                if (!content) {
                    this.touch(name);
                    return "";
                }
                fs_1.default.writeFileSync(path_1.default.resolve(name), content);
            }
        },
        touch: {
            value(name) {
                const time = new Date();
                try {
                    fs_1.default.utimesSync(name, time, time);
                }
                catch (err) {
                    fs_1.default.closeSync(fs_1.default.openSync(name, 'w'));
                }
                return true;
            }
        },
        delete: {
            value(name) {
                fs_1.default.unlinkSync(name);
            }
        }
    });
    return fs_1.default;
}
exports.default = filesystem;
