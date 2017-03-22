import {IStreamFactory, IWhen, Event} from "prettygoat";
import {Observable} from "rx";
import {inject, injectable} from "inversify";
import {IDirectoryScanner} from "./DirectoryScanner";

@injectable()
class FileStreamFactory implements IStreamFactory {

    constructor(@inject("IDirectoryScanner") private directoryScanner: IDirectoryScanner) {

    }

    from(lastEvent: Date, completions?: Observable<string>, definition?: IWhen<any>): Observable<Event> {
        return undefined;
    }

}

export default FileStreamFactory