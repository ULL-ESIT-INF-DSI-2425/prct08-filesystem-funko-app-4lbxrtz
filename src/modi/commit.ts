import fs from "fs";
import path from "path";
import process from "process";

export function commit(modifiedFile: string): void {
  fs.lstat(modifiedFile, (error, stats) => {
    if (error) {
      console.log(
        `Error: lstat didnt work as intended. Backup path: ${modifiedFile}`,
      );
    } else {
      const modifiedFileName = path.basename(modifiedFile);
      let backupPath = path.join(process.cwd(), "versions", modifiedFileName);
      backupPath += stats.mtime.toString() + ".bak";
      fs.cp(modifiedFile, backupPath, (err) => {
        if (err) throw err;
      });
    }
  });
}
