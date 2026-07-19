declare module "better-sqlite3" {
  namespace Database {
    interface RunResult {
      changes: number;
      lastInsertRowid: number | bigint;
    }

    interface Statement {
      all(...params: unknown[]): unknown[];
      get(...params: unknown[]): unknown;
      run(...params: unknown[]): RunResult;
    }

    interface Database {
      exec(source: string): this;
      prepare(source: string): Statement;
    }

    interface DatabaseConstructor {
      new (filename: string): Database;
    }
  }

  const Database: Database.DatabaseConstructor;
  export = Database;
}