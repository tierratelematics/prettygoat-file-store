import {IModule, IProjectionRegistry, IServiceLocator} from "prettygoat";

export class FileModule implements IModule {
    register(registry: IProjectionRegistry, serviceLocator?: IServiceLocator, overrides?: any): void;
}