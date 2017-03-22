import {Dictionary} from "prettygoat";
const requireDir = require("require-dir");

export type Scan = Dictionary<any>;

export interface IDirectoryScanner {
    scan(folder: string): Promise<Scan>;
}

export class DirectoryScanner implements IDirectoryScanner {

    scan(folder: string): Promise<Scan> {
        return Promise.resolve(requireDir(folder));
    }

}