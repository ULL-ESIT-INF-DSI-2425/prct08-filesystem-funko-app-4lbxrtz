import fs from "fs";
import { Funko } from "./funko.js";
import { FunkoCollection } from "./funkoCollection.js";
import path from "path";

export class UserManager {
  private _collections: Map<string, FunkoCollection> = new Map();

  constructor(private dataPath: string = path.join(__dirname, "..", "data")) {
    fs.mkdir(this.dataPath, { recursive: true }, (error) => {
      if (error) console.error(`Couldn't create the directory: `, error);
    });
  }

  private getUserDir(username: string): string {
    return path.join(this.dataPath, username);
  }

  private saveFunkos(collection: FunkoCollection, userDir: string): void {
    const funkos = collection.getFunkos();
    if (funkos.length === 0) return;
    let funkosNum: number = 0;
    funkos.forEach((funko) => {
      const filePath = path.join(userDir, `${funko}.json`);
      fs.writeFile(filePath, JSON.stringify(funko, null, 2), (error) => {
        funkosNum++;
        if (error) console.error("Couldn't save the funko:", error);
        if (funkos.length === funkosNum) return;
      });
    });
  }

  private saveUserCollection(username: string): void {
    const collection = this._collections.get(username);
    if (!collection) return;
    const userDir = this.getUserDir(username);
    fs.mkdir(userDir, { recursive: true }, (error) => {
      if (error) console.error("Couldn't create user directory", error);
      fs.readdir(userDir, (error, files) => {
        if (error) console.error("Couldn't read user directory: ", error);
        if (files.length === 0) {
          this.saveFunkos(collection, userDir);
          return;
        }
        let deletedFiles: number = 0;
        files.forEach((file) => {
          fs.unlink(path.join(userDir, file), (error) => {
            deletedFiles++;
            if (error) console.error("Couldn't remove file: ", error);
            if (deletedFiles === files.length)
              this.saveFunkos(collection, userDir);
          });
        });
      });
    });
  }

  private loadUserCollection(username: string): void {
    const userDir = this.getUserDir(username);

    fs.readdir(userDir, (error, files) => {
      if (error) console.error("Couldn't read user directory: ", error);
      const collection = new FunkoCollection(username);
      let processedFiles: number = 0;
      if (files.length === 0) {
        this._collections.set(username, collection);
        return;
      }
      files.forEach((file) => {
        if (file.endsWith(".json")) {
          fs.readFile(path.join(userDir, file), "utf-8", (error, data) => {
            processedFiles++;
            if (error) {
              console.error(
                "Couldn't read file while loading collection: ",
                error,
              );
            }
            const funko = JSON.parse(data) as Funko;
            collection.addFunko(funko);
            if (processedFiles === files.length) {
              this._collections.set(username, collection);
            }
          });
        } else {
          processedFiles++;
        }
      });
    });
  }
}
