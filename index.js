import { readdir, readFile } from "fs/promises";
import { lstatSync } from "fs";
import { prompt } from "inquirer";
import { positional } from "yargs";
import { join } from "path";

let currentDirectory = process.cwd();
const options = positional("d", {
  describe: "Path to directory",
  default: process.cwd(),
}).positional("p", {
  describe: "Pattern",
  default: "",
}).argv;
console.log(options);

class ListItem {
  constructor(path, fileName) {
    this.path = path;
    this.fileName = fileName;
  }

  get isDir() {
    return lstatSync(this.path).isDirectory();
  }
}

const run = async () => {
  const list = await readdir(currentDirectory);
  const items = list.map(
    (fileName) => new ListItem(join(currentDirectory, fileName), fileName)
  );

  const item = await prompt([
    {
      name: "fileName",
      type: "list",
      message: `Choose: ${currentDirectory}`,
      choices: items.map((item) => ({ name: item.fileName, value: item })),
    },
  ]).then((answer) => answer.fileName);

  if (item.isDir) {
    currentDirectory = item.path;
    return await run();
  } else {
    const data = await readFile(item.path, "utf-8");

    if (options.p == null) console.log(data);
    else {
      const regExp = new RegExp(options.p, "igm");
      console.log(data.match(regExp));
    }
  }
};

run();
