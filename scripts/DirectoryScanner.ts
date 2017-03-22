export type Scan = Dictionary<any>;

export interface IDirectoryScanner {
    scan(folder: string): Promise<Scan>;
}

export class DirectoryScanner implements IDirectoryScanner {

    constructor() {

    }

    scan(folder: string): Promise<Scan> {
        return undefined;
    }

}