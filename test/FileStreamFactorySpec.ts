import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock} from "typemoq";
import FileStreamFactory from "../scripts/FileStreamFactory";
import {IDirectoryScanner} from "../scripts/DirectoryScanner";
import eventsTimestamp from "./fixtures/eventsTimestamp";

describe("Given a file stream factory", () => {
    let subject: FileStreamFactory;
    let scanner: IMock<IDirectoryScanner>;

    beforeEach(() => {
        scanner = Mock.ofType<IDirectoryScanner>();
        subject = new FileStreamFactory(scanner.object);
    });

    context("when a stream is requested", () => {
        context("and a list with timestamps as string", () => {
            beforeEach(() => {
                const events = require("./fixtures/events.json");
                scanner.setup(s => s.scan("./events")).returns(() => Promise.resolve(events));
            });
            it("should use a list of json files as events", () => {
                let notifications = subject.from(null).subscribe(event => notifications.push(event));

                expect(notifications).to.have.length(3);
                expect(notifications[0]).to.eql({
                    "type": "test_event",
                    "payload": {
                        "id": "78390023"
                    },
                    "timestamp": new Date(2)
                });
                expect(notifications[2]).to.eql({
                    "type": "FooRegistered",
                    "payload": {
                        "bar": "test"
                    },
                    "timestamp": new Date(10)
                });
            });
        });

        context("and a list with timestamps as object is used", () => {
            beforeEach(() => {
                scanner.setup(s => s.scan("./events")).returns(() => Promise.resolve(eventsTimestamp));
            });
            it("should not be transformed", () => {
                let notifications = subject.from(null).subscribe(event => notifications.push(event));

                expect(notifications).to.have.length(3);
                expect(notifications[0]).to.eql({
                    "type": "test_event",
                    "payload": {
                        "id": "78390023"
                    },
                    "timestamp": new Date(2)
                });
                expect(notifications[2]).to.eql({
                    "type": "FooRegistered",
                    "payload": {
                        "bar": "test"
                    },
                    "timestamp": new Date(10)
                });
            });
        });
    });
});