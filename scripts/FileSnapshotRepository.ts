import {ISnapshotRepository, Snapshot} from "prettygoat";
import {injectable} from "inversify";

@injectable()
class FileSnapshotRepository implements ISnapshotRepository {

    getSnapshot<T>(streamId: string): Promise<Snapshot<T>> {
        return Promise.resolve(null);
    }

    saveSnapshot<T>(streamId: string, snapshot: Snapshot<T>): Promise<void> {
        return Promise.resolve();
    }

    deleteSnapshot(streamId: string): Promise<void> {
        return Promise.resolve();
    }

}

export default FileSnapshotRepository
