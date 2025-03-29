import fs from "fs";
import { Funko } from "./funko.js";
import { FunkoCollection } from "./funkoCollection.js";
import path, { dirname } from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class UserManager {
  private _collections: Map<string, FunkoCollection> = new Map();

  constructor(private dataPath: string = path.join(__dirname, "..", "data")) {
    fs.mkdir(this.dataPath, { recursive: true }, (error) => {
      if (error)
        console.error(chalk.red(`Couldn't create the directory: `), error);
    });
  }

  private getUserDir(username: string): string {
    return path.join(this.dataPath, username);
  }

  private ensureUserCollection(
    username: string,
    callback: (collection: FunkoCollection) => void,
  ): void {
    if (this._collections.has(username)) {
      callback(this._collections.get(username)!);
      return;
    }
    this.loadUserCollection(username, (loadedCollection) => {
      this._collections.set(username, loadedCollection);
      callback(loadedCollection);
    });
  }

  private saveFunkos(
    collection: FunkoCollection,
    userDir: string,
    callback: () => void,
  ): void {
    const funkos = collection.getFunkos();
    if (funkos.length === 0) {
      callback();
      return;
    }
    let savedCount = 0;
    funkos.forEach((funko) => {
      const filePath = path.join(userDir, `${funko.id}.json`); // Changed from name to id
      fs.writeFile(filePath, JSON.stringify(funko, null, 2), (error) => {
        savedCount++;
        if (error) console.error(chalk.red("Couldn't save the funko:"), error);
        if (savedCount === funkos.length) {
          callback();
        }
      });
    });
  }

  private saveUserCollection(username: string, callback: () => void): void {
    const collection = this._collections.get(username);
    if (!collection) {
      callback();
      return;
    }
    const userDir = this.getUserDir(username);
    console.log("Saving to:", userDir);
    fs.mkdir(userDir, { recursive: true }, (error) => {
      if (error) {
        console.error(chalk.red("Couldn't create user directory"), error);
        callback();
        return;
      }
      fs.readdir(userDir, (error, files) => {
        if (error && error.code !== "ENOENT") {
          console.error(chalk.red("Couldn't read user directory:"), error);
          callback();
          return;
        }
        const filesToDelete = files || [];
        if (filesToDelete.length === 0) {
          this.saveFunkos(collection, userDir, callback);
          return;
        }
        let deletedCount = 0;
        filesToDelete.forEach((file) => {
          fs.unlink(path.join(userDir, file), (error) => {
            deletedCount++;
            if (error) console.error(chalk.red("Couldn't remove file:"), error);
            if (deletedCount === filesToDelete.length) {
              this.saveFunkos(collection, userDir, callback);
            }
          });
        });
      });
    });
  }

  private loadUserCollection(
    username: string,
    callback: (collection: FunkoCollection) => void,
  ): void {
    const userDir = this.getUserDir(username);
    fs.readdir(userDir, (error, files) => {
      const collection = new FunkoCollection(username);
      if (error) {
        if (error.code === "ENOENT") {
          console.log("No existing directory - starting fresh collection");
          callback(collection);
          return;
        }
        console.error(chalk.red("Couldn't read user directory:"), error);
        callback(collection);
        return;
      }
      if (!files || files.length === 0) {
        callback(collection);
        return;
      }
      let processedFiles = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let hasError = false;
      files.forEach((file) => {
        if (file.endsWith(".json")) {
          fs.readFile(path.join(userDir, file), "utf-8", (error, data) => {
            processedFiles++;
            if (error) {
              console.error(chalk.red("Couldn't read file:"), error);
              hasError = true;
            } else {
              try {
                const funko = JSON.parse(data) as Funko;
                collection.addFunko(funko);
              } catch (parseError) {
                console.error(chalk.red("Couldn't parse funko:"), parseError);
                hasError = true;
              }
            }
            if (processedFiles === files.length) {
              callback(collection);
            }
          });
        } else {
          processedFiles++;
          if (processedFiles === files.length) {
            callback(collection);
          }
        }
      });
    });
  }

  public addFunkoToUser(
    username: string,
    funko: Funko,
    callback: (success: boolean) => void,
  ): void {
    this.ensureUserCollection(username, (collection) => {
      const result = collection.addFunko(funko);
      if (result) {
        this.saveUserCollection(username, () => {
          callback(true);
        });
      } else {
        callback(false);
      }
    });
  }

  public updateFunkoInUser(
    username: string,
    funko: Funko,
    callback: (success: boolean) => void,
  ): void {
    this.ensureUserCollection(username, (collection) => {
      const result = collection.updateFunko(funko);
      if (result) {
        this.saveUserCollection(username, () => {
          callback(true);
        });
      } else {
        callback(false);
      }
    });
  }

  public removeFunkoFromUser(
    username: string,
    id: string,
    callback: (success: boolean) => void,
  ): void {
    this.ensureUserCollection(username, (collection) => {
      const result = collection.removeFunko(id);
      if (result) {
        this.saveUserCollection(username, () => {
          callback(true);
        });
      } else {
        callback(false);
      }
    });
  }

  public listUserFunkos(
    username: string,
    callback: (hasFunkos: boolean) => void,
  ): void {
    this.ensureUserCollection(username, (collection) => {
      const funkos = collection.getFunkos();
      if (funkos.length === 0) {
        console.log(
          chalk.yellow(`${username} has no funkos in their collection`),
        );
        callback(false);
        return;
      }
      console.log(chalk.blue.bold(`${username} Funko Pop collection`));
      console.log(chalk.blue("-".repeat(40)));
      collection.listFunkos();
      callback(true);
    });
  }

  public getFunkoFromUser(
    username: string,
    id: string,
    callback: (exists: boolean) => void,
  ): void {
    this.ensureUserCollection(username, (collection) => {
      const funko = collection.getFunko(id);
      if (!funko) {
        callback(false);
        return;
      }
      collection.showFunkoInfo(id);
      callback(true);
    });
  }
}
