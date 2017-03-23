# Prettygoat-file-store

Filesystem as event store for [prettygoat](https://github.com/tierratelematics/prettygoat).

## Installation

`
$ npm install prettygoat-file-store
`

Add this code to the boostrapper.

```typescript
import {FileModule} from "prettygoat-file-store";

engine.register(new FileModule());
```

Optionally you can configure a different folder for your events (the default one is called "events);

```typescript
import {IFileConfig} from "prettygoat-file-store";

container.bind<IFileConfig>("IFileConfig").toConstantValue({ 
    directory: "your_directory"
});
```

Disable nodemon on the events folder by modifying your smildfile.

```javascript
module.exports = {
    "projectType": "nodejs",
    "nodemon": {
        "ignore": ["events/**/*"]
    }
};
```

## Usage

Simply put a list of prettygoat events in your events folder and run the engine. An event file is a JSON (or a js) that looks like this:

```javascript
module.exports = [
    {
        "type": "myevent",
        "payload": "mypayload",
        "timestamp": new Date(1)
    }
];
```

## License

Copyright 2016 Tierra SpA

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
