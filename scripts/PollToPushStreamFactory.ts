import {IStreamFactory, Event, IWhen} from "prettygoat";
import {injectable, inject} from "inversify";
import {Observable} from "rx";

@injectable()
class PollToPushStreamFactory implements IStreamFactory {

    constructor(@inject("StreamFactory") private streamFactory: IStreamFactory) {

    }

    from(lastEvent: Date, completions?: Observable<string>, definition?: IWhen<any>): Observable<Event> {
        return this.streamFactory
            .from(lastEvent, completions, definition)
            .concat(Observable.just({
                type: "__prettygoat_internal_realtime",
                payload: null,
                timestamp: null,
                splitKey: null
            }))
            .concat(
                Observable
                    .interval(5000)
                    .flatMap(_ => this.streamFactory.from(lastEvent, completions, definition))
            )
            .filter(event => event.timestamp > lastEvent)
            .do(event => {
                if (event.timestamp)
                    lastEvent = event.timestamp
            });
    }
}

export default PollToPushStreamFactory