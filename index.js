import { createServer } from "http";
import { join } from "path";
import {
  lstatSync,
  existsSync,
  createReadStream,
  readdirSync,
  readFileSync,
} from "fs";

(async () => {
  const isFile = (path) => lstatSync(path).isFile();

  createServer((req, res) => {
    const fullPath = join(process.cwd(), req.url);
    console.log(fullPath);
    if (!existsSync(fullPath)) return res.end("File or directory not found");

    if (isFile(fullPath)) {
      return createReadStream(fullPath).pipe(res);
    }

    let linksList = "";

    const urlParams = req.url.match(/[\d\w\.]+/gi);

    if (urlParams) {
      urlParams.pop();
      const prevUrl = urlParams.join("/");
      linksList = urlParams.length
        ? `<li><a href="/${prevUrl}">..</a></li>`
        : '<li><a href="/">..</a></li>';
    }
    //

    readdirSync(fullPath).forEach((fileName) => {
      const filePath = join(req.url, fileName);
      linksList += `<li><a href="${filePath}">${fileName}</a></li>`;
    });
    const HTML = readFileSync(join(__dirname, "index.html"), "utf-8").replace(
      "##links",
      linksList
    );
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    return res.end(HTML);
  }).listen(5555);
})();
