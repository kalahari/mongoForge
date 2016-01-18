// Type definitions for promised-mongo
// Project: https://github.com/gordonmleigh/promised-mongo/
// Definitions by: kalahari <https://kalahari.github.io>
// Definitions: https://github.com/kalahari/DefinitelyTyped

/// <reference path="../typings/tsd.d.ts" />

declare module PromisedMongo {
    interface PMongo {
        (uri: string, collections?: string[]): Database;
        compatible(): PMongo;
    }
    
    interface Database {
        server: Promise<MongoDb.Server>;
        
        addUser(user: Object): Promise<Object>;
        close(): void;
        collection(name: string): Collection;
        connect(): void;
        createCollection(name: string, options: Object): Promise<void>;
        createUser(user: Object): Promise<Object>;
        dropDatabase(): Promise<Object>;
        dropUser(userName: string): Promise<Object>;
        getCollectionNames(): Promise<string[]>;
        getLastError(): Promise<Object>;
        getLastErrorObj(): Promise<Object>;
        removeUser(userName: string): Promise<Object>;
        getSiblingDb(dbName: string, collections?: string[]): Database;
        runCommand(options: Object): Promise<Object>;
        runCommandCursor(command: string, options: Object): Cursor;
        stats(scale: Number): Promise<Object>;
        toString(): string;
    }
    
    interface Collection {
        aggregate(...pipeline: Object[]): Promise<Object>;
        aggregateCursor(...pipeline: Object[]): Cursor;
        count(query: Object): Promise<number>;
        createIndex(index: Object, options: Object): Promise<Object>;
        distinct(key: Object, query: Object): Promise<Object>;
        drop(): Promise<boolean>;
        dropIndex(index: Object): Promise<Object>;
        dropIndexes(): Promise<Object>;
        ensureIndex(index: Object, options: Object): Promise<Object>;
        find(query: Object, projection: Object, options: Object): Cursor;
        findAndModify(options: Object): Promise<Object>;
        findOne(query: Object, projection: Object): Promise<Object>;
        getIndexes(): Promise<Object[]>;
        group(doc: Object): Promise<Object>;
        initializeOrderedBulkOp(): Bulk;
        initializeUnorderedBulkOp(): Bulk;
        insert(docs: Object): Promise<Object>;
        isCapped(): Promise<boolean>;
        mapReduce(map: Object, reduce: Object, options: Object): Promise<Object>;
        reIndex(): Promise<Object>;
        remove(query: Object, justOne: boolean): Promise<Object>;
        runCommand(command: string, options: Object): Promise<Object>;
        save(doc): Promise<Object>;
        stats(): Promise<Object>;
        toString(): string;
        update(query: Object, update: Object, options: Object): Promise<Object>;
    }
    
    interface Cursor {
        batchSize(n): Cursor;
        connect(): Promise<Object>;
        count(): Promise<number>;
        destroy(): Promise<Object>;
        explain(): Promise<Object>;
        forEach(action: (item: Object) => void): Promise<Object>;
        forEachAsync(action: (item: Object) => Promise<void>): Promise<Object>;
        limit(n): Cursor;
        map(action: (item: Object) => Object): Promise<Object[]>;
        next(): Promise<Object>;
        rewind(): Promise<Object>;
        size(): Promise<number>;
        skip(n: number): Cursor;
        sort(sort: Object): Cursor;
        then(resolved: Function, rejected: Function): Promise<Object>;
        toArray(): Promise<Object[]>;
    }
    
    interface Bulk {
        
    }
}

declare module 'promised-mongo' {
	var pmongo: PromisedMongo.PMongo;
	export = pmongo;
}

interface NodeRequireFunction {
	(id: 'promised-mongo'): PromisedMongo.PMongo;
}
