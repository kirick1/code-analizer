import * as path from "path";
import * as fs from "fs";

export class Input {
  text: string[] = [];
  files: any[] = [];
  directories: any;

  constructor(sources: string[]) {
    this.directories = sources.map((source) => ({ path: source }));
    this.readAllFiles();
    this.getAllText();
  }

  readAllFiles() {
    const regex = /\.js$/;
    while (this.directories.length) {
      const dir_arr = [...this.directories];
      this.directories = [];
      dir_arr.map((item: { path: string }) => {
        fs.readdirSync(item.path).forEach((file: string) => {
          if (fs.lstatSync(path.resolve(item.path, file)).isDirectory()) {
            this.directories.push({ path: path.resolve(item.path, file) });
          } else if (file.match(regex)) {
            this.files.push({ path: path.resolve(item.path, file) });
          }
        });
      });
    }
  }

  getAllText() {
    this.files.map((item: { path: string }) => {
      this.text = this.text.concat(
        fs.readFileSync(item.path, "utf8").split("\n")
      );
    });
  }
}
