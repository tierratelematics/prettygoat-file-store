import {IStreamFactory, Event, WhenBlock, SpecialEvents} from "prettygoat";
import {injectable, inject, optional} from "inversify";
import {Observable} from "rxjs";
import {DefaultPollToPushConfig, IPollToPushConfig} from "./PollToPushConfig";

@injectable()
class PollToPushStreamFactory implements IStreamFactory {

    constructor(@inject("StreamFactory") private streamFactory: IStreamFactory,
                @inject("IPollToPushConfig") @optional() private config: IPollToPushConfig = new DefaultPollToPushConfig()) {

    }

    from(lastEvent: Date, completions?: Observable<string>, definition?: WhenBlock<any>): Observable<Event> {
        return this.streamFactory
            .from(lastEvent, completions, definition)
            .concat(Observable.just({
                type: SpecialEvents.REALTIME,
                payload: null,
                timestamp: null,
                splitKey: null
            }))
            .concat(
                Observable
                    .interval(this.config.interval)
                    .flatMap(_ => this.streamFactory.from(lastEvent, completions, definition))
            )
            .filter(event => !event.timestamp ? true : event.timestamp > lastEvent)
            .do(event => {
                if (event.timestamp)
                    lastEvent = event.timestamp;
            });
    }
}

export default PollToPushStreamFactory
