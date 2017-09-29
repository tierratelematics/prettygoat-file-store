import {IStreamFactory, Event, IProjection, Snapshot, SpecialEvents} from "prettygoat";
import {injectable, inject, optional} from "inversify";
import {Observable} from "rxjs";
import {DefaultPollToPushConfig, IPollToPushConfig} from "./PollToPushConfig";

@injectable()
class PollToPushStreamFactory implements IStreamFactory {

    constructor(@inject("StreamFactory") private streamFactory: IStreamFactory,
                @inject("IPollToPushConfig") @optional() private config: IPollToPushConfig = new DefaultPollToPushConfig()) {

    }

    generate(projection: IProjection, snapshot: Snapshot<any>, completions: Observable<string>): Observable<Event> {
        return this.streamFactory
            .generate(projection, snapshot, completions)
            .concat(Observable.of({
                type: SpecialEvents.REALTIME,
                payload: null,
                timestamp: null,
                splitKey: null
            }))
            .concat(
                Observable
                    .interval(this.config.interval)
                    .flatMap(_ => this.streamFactory.generate(projection, snapshot, completions))
            )
            .filter(event => !event.timestamp ? true : event.timestamp > snapshot.lastEvent)
            .do(event => {
                if (event.timestamp)
                    snapshot.lastEvent = event.timestamp;
            });
    }
}

export default PollToPushStreamFactory
