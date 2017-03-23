import {IModule, IProjectionRegistry, IServiceLocator, IStreamFactory, ISnapshotRepository} from "prettygoat";
import {interfaces} from "inversify";
import FileSnapshotRepository from "./FileSnapshotRepository";
import FileStreamFactory from "./FileStreamFactory";
import {IDirectoryScanner, DirectoryScanner} from "./DirectoryScanner";
import PollToPushStreamFactory from "./PollToPushStreamFactory";

class FileModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.bind<ISnapshotRepository>("ISnapshotRepository").to(FileSnapshotRepository).inSingletonScope();
        container.bind<IStreamFactory>("StreamFactory").to(FileStreamFactory).inSingletonScope().whenInjectedInto(PollToPushStreamFactory);
        container.bind<IStreamFactory>("IStreamFactory").to(PollToPushStreamFactory).inSingletonScope();
        container.bind<IDirectoryScanner>("IDirectoryScanner").to(DirectoryScanner).inSingletonScope();
    };

    register(registry: IProjectionRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {
    }

}

export default FileModule