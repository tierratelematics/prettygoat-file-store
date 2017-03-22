import {ISnapshotRepository} from "prettygoat";
import {Observable} from "rx";

class FileSnapshotRepository implements ISnapshotRepository {

    initialize(): Observable<void> {
        return undefined;
    }

    getSnapshots(): Observable<Dictionary<Snapshot<any>>> {
        return undefined;
    }

    getSnapshot<T>(streamId: string): Observable<Snapshot<T>> {
        return undefined;
    }

    saveSnapshot<T>(streamId: string, snapshot: Snapshot<T>): Observable<void> {
        return undefined;
    }

    deleteSnapshot(streamId: string): Observable<void> {
        return undefined;
    }

}

export default FileSnapshotRepository