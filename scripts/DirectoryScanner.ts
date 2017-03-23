import {injectable} from "inversify";
const requireUncached = require("require-uncached");
import {files} from "node-dir";
import {join} from "path";
import {map} from "lodash";

export type Scan = any[];

export interface IDirectoryScanner {
    scan(folder: string): Promise<Scan>;
}

@injectable()
export class DirectoryScanner implements IDirectoryScanner {

    scan(folder: string): Promise<Scan> {
        let path = join(process.cwd(), folder);
        return new Promise((resolve, reject) => {
            files(path, (error, list) => {
                if (error) reject(error);
                resolve(map(list, file => requireUncached(file)));
            });
        });
    }

}