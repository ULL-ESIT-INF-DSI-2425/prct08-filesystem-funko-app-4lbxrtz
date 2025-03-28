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

  private saveFunkos(collection: FunkoCollection, userDir: string): void {
    const funkos = collection.getFunkos();
    if (funkos.length === 0) return;
    let funkosNum: number = 0;
    funkos.forEach((funko) => {
      const filePath = path.join(userDir, `${funko}.json`);
      fs.writeFile(filePath, JSON.stringify(funko, null, 2), (error) => {
        funkosNum++;
        if (error) console.error(chalk.red("Couldn't save the funko:"), error);
        if (funkos.length === funkosNum) return;
      });
    });
  }

  private saveUserCollection(username: string): void {
    const collection = this._collections.get(username);
    if (!collection) return;
    const userDir = this.getUserDir(username);
    fs.mkdir(userDir, { recursive: true }, (error) => {
      if (error)
        console.error(chalk.red("Couldn't create user directory"), error);
      fs.readdir(userDir, (error, files) => {
        if (error) {
          if (error.code !== "ENOENT") {
            console.error(chalk.red("Couldn't read user directory:"), error);
          }
          this.saveFunkos(collection, userDir);
          return;
        }
        if (files.length === 0) {
          this.saveFunkos(collection, userDir);
          return;
        }
        let deletedFiles: number = 0;
        files.forEach((file) => {
          fs.unlink(path.join(userDir, file), (error) => {
            deletedFiles++;
            if (error) console.error(chalk.red("Couldn't remove file:"), error);
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
      if (error) {
        if (error.code === "ENOENT") {
          this._collections.set(username, new FunkoCollection(username));
          return;
        }
        console.error(chalk.red("Couldn't read user directory:"), error);
        return;
      }
      const collection = new FunkoCollection(username);
      let processedFiles: number = 0;
      if (!files || files.length === 0) {
        this._collections.set(username, collection);
        return;
      }
      files.forEach((file) => {
        if (file.endsWith(".json")) {
          fs.readFile(path.join(userDir, file), "utf-8", (error, data) => {
            processedFiles++;
            if (error) {
              console.error(chalk.red("Couldn't read file:"), error);
            } else {
              try {
                const funko = JSON.parse(data) as Funko;
                collection.addFunko(funko);
              } catch (parseError) {
                console.error(chalk.red("Couldn't parse funko:"), parseError);
              }
            }
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

  public addFunkoToUser(username: string, funko: Funko): boolean {
    if (!this._collections.has(username)) {
      this._collections.set(username, new FunkoCollection(username));
      this.loadUserCollection(username);
    }
    const collection = this._collections.get(username);
    if (!collection) return false;
    const result = collection.addFunko(funko);
    if (result) {
      this.saveUserCollection(username);
      console.log(chalk.green(`Funko added to ${username}'s collection`));
      return true;
    } else {
      console.log(chalk.red(`Funko with ID ${funko.id} already exists`));
      return false;
    }
  }

  public updateFunkoInUser(username: string, funko: Funko): boolean {
    if (!this._collections.has(username)) {
      this.loadUserCollection(username);
    }
    const collection = this._collections.get(username);
    if (!collection) return false;
    const result = collection.updateFunko(funko);
    if (result) {
      this.saveUserCollection(username);
      console.log(chalk.green(`Funko updated in ${username}'s collection`));
      return true;
    } else {
      console.log(chalk.red(`Funko with ID ${funko.id} not found`));
      return false;
    }
  }

  public removeFunkoFromUser(username: string, id: string): boolean {
    if (!this._collections.has(username)) {
      this.loadUserCollection(username);
    }
    const collection = this._collections.get(username);
    if (!collection) return false;
    const result = collection.removeFunko(id);
    if (result) {
      this.saveUserCollection(username);
      console.log(chalk.green(`Funko removed from ${username}'s collection`));
      return true;
    } else {
      console.log(chalk.red(`Funko with ID ${id} not found`));
      return false;
    }
  }

  public listUserFunkos(username: string): Funko[] | undefined {
    if (!this._collections.has(username)) {
      this.loadUserCollection(username);
    }
    const collection = this._collections.get(username);
    if (!collection) return undefined;
    const funkos = collection.getFunkos();
    if (funkos.length === 0) {
      console.log(
        chalk.yellow(`${username} has no funkos in their collection`),
      );
      return undefined;
    }
    return funkos;
  }

  public getFunkoFromUser(username: string, id: string): boolean {
    if (!this._collections.has(username)) {
      this.loadUserCollection(username);
    }
    const collection = this._collections.get(username);
    if (!collection) return false;
    collection.showFunkoInfo(id);
    return true;
  }
}
