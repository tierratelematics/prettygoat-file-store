import {IStreamFactory, ProjectionQuery, IIdempotenceFilter, Event} from "prettygoat";
import {Observable} from "rxjs";
import {inject, injectable, optional} from "inversify";
import {IDirectoryScanner} from "./DirectoryScanner";
import {IFileConfig, DefaultFileConfig} from "./FileConfig";
import * as _ from "lodash";

@injectable()
class FileStreamFactory implements IStreamFactory {

    constructor(@inject("IDirectoryScanner") private directoryScanner: IDirectoryScanner,
                @inject("IFileConfig") @optional() private config: IFileConfig = new DefaultFileConfig()) {

    }

    from(query?: ProjectionQuery, idempotence?: IIdempotenceFilter, backpressureGate?: Observable<string>): Observable<Event> {
        return Observable.from(this.directoryScanner.scan(this.config.directory))
            .map<any, Event[]>(scan => _(scan).flatten().map((event: any) => {
                if (_.isString(event.timestamp))
                    event.timestamp = new Date(event.timestamp);
                if (isNaN(event.timestamp))
                    throw new Error("An invalid date has been supplied to an event: could be new Date(0) or a bad format");
                return event;
            }).sortBy(event => event.timestamp).valueOf())
            .flatMap(events => Observable.from(events));
    }

}

export default FileStreamFactory
