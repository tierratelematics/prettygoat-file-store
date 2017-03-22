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
        return Observable.create<Event>(observer => {
            this.directoryScanner.scan(this.config.directory)
                .then(scan => {
                    let events = _(scan).map(json => json).concat().flatten().map((event: any) => {
                        if (_.isString(event.timestamp))
                            event.timestamp = new Date(event.timestamp);
                        return event;
                    }).valueOf();
                    _.forEach(events, event => observer.onNext(event));
                    observer.onCompleted();
                })
                .catch(error => observer.onError(error));
        });
    }
}

export default FileStreamFactory