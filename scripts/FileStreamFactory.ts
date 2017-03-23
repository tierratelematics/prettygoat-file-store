import {IStreamFactory, IWhen, Event} from "prettygoat";
import {Observable} from "rx";
import {inject, injectable, optional} from "inversify";
import {IDirectoryScanner, Scan} from "./DirectoryScanner";
import {IFileConfig, DefaultFileConfig} from "./FileConfig";
import * as _ from "lodash";

@injectable()
class FileStreamFactory implements IStreamFactory {

    constructor(@inject("IDirectoryScanner") private directoryScanner: IDirectoryScanner,
                @inject("IFileConfig") @optional() private config: IFileConfig = new DefaultFileConfig()) {

    }

    from(lastEvent: Date, completions?: Observable<string>, definition?: IWhen<any>): Observable<Event> {
        return Observable.fromPromise<Scan>(this.directoryScanner.scan(this.config.directory))
            .map<Event[]>(scan => _(scan).flatten().map((event: any) => {
                if (_.isString(event.timestamp))
                    event.timestamp = new Date(event.timestamp);
                return event;
            }).sortBy(event => event.timestamp).valueOf())
            .flatMap(events => Observable.from(events));
    }

}

export default FileStreamFactory