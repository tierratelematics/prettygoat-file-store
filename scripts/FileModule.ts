import {IModule, IProjectionRegistry, IServiceLocator, IStreamFactory, ISnapshotRepository} from "prettygoat";
import {interfaces} from "inversify";
import FileSnapshotRepository from "./FileSnapshotRepository";
import FileStreamFactory from "./FileStreamFactory";
import {IDirectoryScanner, DirectoryScanner} from "./DirectoryScanner";

class FileModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.bind<ISnapshotRepository>("ISnapshotRepository").to(FileSnapshotRepository).inSingletonScope();
        container.bind<IStreamFactory>("IStreamFactory").to(FileStreamFactory).inSingletonScope();
        container.bind<IDirectoryScanner>("IDirectoryScanner").to(DirectoryScanner).inSingletonScope();
    };

    register(registry: IProjectionRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {
    }

}

export default FileModule