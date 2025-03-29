import { Funko } from "./funko.js";
import chalk from "chalk";

export class FunkoCollection {
  private _funkos: Map<string, Funko> = new Map();

  constructor(private username: string) {}

  getFunkos(): Funko[] {
    return Array.from(this._funkos.values());
  }

  public getFunko(id: string): Funko | undefined {
    return this._funkos.get(id);
  }

  addFunko(funko: Funko): boolean {
    if (this._funkos.has(funko.id)) {
      console.log();
      return false;
    }
    this._funkos.set(funko.id, funko);
    return true;
  }

  updateFunko(funko: Funko): boolean {
    if (!this._funkos.has(funko.id)) {
      return false;
    }
    this._funkos.set(funko.id, funko);
    return true;
  }

  removeFunko(id: string): boolean {
    const funko = this._funkos.get(id);
    if (!funko) {
      return false;
    }
    this._funkos.delete(id);
    return true;
  }

  showFunkoInfo(id: string): void {
    const funko = this._funkos.get(id);
    if (!funko) {
      return;
    }
    this.printFunkoInfo(funko);
  }

  listFunkos(): void {
    if (this._funkos.size === 0) return;
    this._funkos.forEach((funko) => {
      this.printFunkoInfo(funko);
    });
  }

  private getMarketValueColor(value: number): typeof chalk {
    if (value >= 1000) return chalk.greenBright.bold;
    if (value >= 500) return chalk.green;
    if (value >= 200) return chalk.yellow;
    if (value >= 100) return chalk.magenta;
    return chalk.red;
  }

  private printFunkoInfo(funko: Funko): void {
    const marketValueColor = this.getMarketValueColor(funko.marketValue);

    console.log(chalk.cyan.bold(`\nFunko Information:`));
    console.log(chalk.cyan(`Name: ${funko.name}`));
    console.log(`ID: ${funko.id}`);
    console.log(`Description: ${funko.description}`);
    console.log(`Type: ${funko.type}`);
    console.log(`Genre: ${funko.genre}`);
    console.log(`Franchise: ${funko.franchise}`);
    console.log(`Number: ${funko.number}`);
    console.log(`Exclusive: ${funko.exclusive ? "Yes" : "No"}`);
    console.log(`Special Features: ${funko.specialFeatures}`);
    console.log(
      `Market Value: ${marketValueColor(`$${funko.marketValue.toFixed(2)}`)}`,
    );
  }
}
