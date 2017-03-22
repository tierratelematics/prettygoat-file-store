import {IModule, IProjectionRegistry, IServiceLocator, IStreamFactory, ISnapshotRepository} from "prettygoat";
import {interfaces} from "inversify";
import FileSnapshotRepository from "./FileSnapshotRepository";
import FileStreamFactory from "./FileStreamFactory";

class FileModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.bind<ISnapshotRepository>("ISnapshotRepository").to(FileSnapshotRepository).inSingletonScope();
        container.bind<IStreamFactory>("IStreamFactory").to(FileStreamFactory).inSingletonScope();
    };

    register(registry: IProjectionRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {
    }

}

export default FileModule