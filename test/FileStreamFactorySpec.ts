import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock} from "typemoq";
import FileStreamFactory from "../scripts/FileStreamFactory";
import {IDirectoryScanner} from "../scripts/DirectoryScanner";
import eventsTimestamp from "./fixtures/eventsTimestamp";
import unorderdEvents from "./fixtures/unorderdEvents";

describe("Given a file stream factory", () => {
    let subject: FileStreamFactory;
    let scanner: IMock<IDirectoryScanner>;

    beforeEach(() => {
        scanner = Mock.ofType<IDirectoryScanner>();
        subject = new FileStreamFactory(scanner.object);
    });

    context("when a stream is requested", () => {
        context("when a list with timestamps as string is used", () => {
            beforeEach(() => {
                const events = require("./fixtures/events.json");
                scanner.setup(s => s.scan("events")).returns(() => Promise.resolve(events));
            });
            it("should use a list of json files as events", (done) => {
                let notifications = [];
                subject.from().subscribe(event => notifications.push(event), null, () => {
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
                    done();
                });
            });
        });

        context("when a list with timestamps as object is used", () => {
            beforeEach(() => {
                scanner.setup(s => s.scan("events")).returns(() => Promise.resolve(eventsTimestamp));
            });
            it("should not be transformed", (done) => {
                let notifications = [];
                subject.from().subscribe(event => notifications.push(event), null, () => {
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
                    done();
                });
            });
        });

        context("when a list of events with unordered timestamps is used", () => {
            beforeEach(() => {
                scanner.setup(s => s.scan("events")).returns(() => Promise.resolve(unorderdEvents));
            });
            it("should order them", (done) => {
                let notifications = [];
                subject.from().subscribe(event => notifications.push(event), null, () => {
                    expect(notifications[0].timestamp).to.eql(new Date(2));
                    expect(notifications[1].timestamp).to.eql(new Date(4));
                    expect(notifications[2].timestamp).to.eql(new Date(10));
                    done();
                });
            });
        });

        context("when a bad date is provided", () => {
            beforeEach(() => {
                const events = require("./fixtures/badInit.json");
                scanner.setup(s => s.scan("events")).returns(() => Promise.resolve(events));
            });
            it("should warn the user about the bad date", (done) => {
                subject.from().subscribe(null, error => {
                    expect(error.message).to.be("An invalid date has been supplied to an event: could be new Date(0) or a bad format");
                    done();
                });
            });
        });
    });
});
