import fs from "fs";
import { commit } from "./commit.js";
import path from "path";
import process from "process";

export function watchMonitor(watchDir: string): void {
  const absolutePath = path.join(process.cwd(), watchDir);
  console.log(`"the absolute path to be watched is: ${absolutePath}`);
  fs.access(absolutePath, (error) => {
    if (error) {
      throw error;
    } else {
      fs.watch(absolutePath, { recursive: true }, (eventType, filename) => {
        if (error) {
          throw error;
        } else {
          if (filename) {
            const modifiedFile = path.join(absolutePath, filename);
            console.log(`The final file to be changed is: ${modifiedFile}`);
            commit(modifiedFile);
          }
        }
      });
    }
  });
}
