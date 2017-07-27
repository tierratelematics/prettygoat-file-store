export interface IFileConfig {
    directory: string;
}

export class DefaultFileConfig implements IFileConfig {
    directory = "events";
}
