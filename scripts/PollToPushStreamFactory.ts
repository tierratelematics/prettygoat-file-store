import {IStreamFactory, Event, ProjectionQuery, IIdempotenceFilter, SpecialEvents} from "prettygoat";
import {injectable, inject, optional} from "inversify";
import {Observable} from "rxjs";
import {DefaultPollToPushConfig, IPollToPushConfig} from "./PollToPushConfig";

@injectable()
class PollToPushStreamFactory implements IStreamFactory {

    constructor(@inject("StreamFactory") private streamFactory: IStreamFactory,
                @inject("IPollToPushConfig") @optional() private config: IPollToPushConfig = new DefaultPollToPushConfig()) {

    }

    from(query?: ProjectionQuery, idempotence?: IIdempotenceFilter, backpressureGate?: Observable<string>): Observable<Event> {
        let scanPointer = null;
        return this.streamFactory
            .from(query, idempotence, backpressureGate)
            .concat(Observable.of({
                type: SpecialEvents.REALTIME,
                payload: null,
                timestamp: null,
                splitKey: null
            }))
            .concat(
                Observable
                    .interval(this.config.interval)
                    .flatMap(_ => this.streamFactory.from(query, idempotence, backpressureGate))
            )
            .filter(event => !event.timestamp ? true : event.timestamp > scanPointer)
            .do(event => {
                if (event.timestamp)
                    scanPointer = event.timestamp;
            });
    }
}

export default PollToPushStreamFactory
