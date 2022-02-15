import { createReadStream, createWriteStream } from "fs";
import { createInterface } from "readline";

const readStream = createReadStream("../access.log", "utf8");
const writeStream1 = createWriteStream("../89.123.1.41_requests.log");
const writeStream2 = createWriteStream("../34.48.240.111_requests.log");

let numStr = 0;

const rl = createInterface({
  input: readStream,
  terminal: true,
});

rl.on("line", (line) => {
  if (line.includes("89.123.1.41")) {
    writeStream1.write(line + "\n");
  }

  if (line.includes("34.48.240.111")) {
    writeStream2.write(line + "\n");
  }

  console.log(++numStr);
});
