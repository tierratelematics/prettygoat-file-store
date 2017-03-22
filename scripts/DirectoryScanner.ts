import {Dictionary} from "prettygoat";
import {injectable} from "inversify";
const requireDir = require("require-dir");
import {join} from "path";

export type Scan = Dictionary<any>;

export interface IDirectoryScanner {
    scan(folder: string): Promise<Scan>;
}

@injectable()
export class DirectoryScanner implements IDirectoryScanner {

    scan(folder: string): Promise<Scan> {
        return Promise.resolve(requireDir(join(process.cwd(), folder)));
    }

}