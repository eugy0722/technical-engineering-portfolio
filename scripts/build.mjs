import fs from "node:fs/promises";
import path from "node:path";
import { minify as minifyHTML } from "html-minifier-terser";
import CleanCSS from "clean-css";
import { minify as minifyJS } from "terser";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");

const ignoredDirectories = new Set([
    ".git",
    ".github",
    "node_modules",
    "dist",
    "scripts"
]);

const ignoredFiles = new Set([
    "README.md",
    "package.json",
    "package-lock.json",
    ".gitignore"
]);

async function getFiles(directory) {
    const entries = await fs.readdir(directory, {
        withFileTypes: true
    });

    const files = [];

    for (const entry of entries) {
        if (
            entry.isDirectory() &&
            ignoredDirectories.has(entry.name)
        ) {
            continue;
        }

        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...await getFiles(fullPath));
        } else {
            files.push(fullPath);
        }
    }

    return files;
}

async function build() {
    await fs.rm(DIST, {
        recursive: true,
        force: true
    });

    await fs.mkdir(DIST, {
        recursive: true
    });

    const files = await getFiles(ROOT);

    for (const file of files) {
        const relativePath = path.relative(ROOT, file);
        const extension = path.extname(file).toLowerCase();

        const destination = path.join(DIST, relativePath);

        await fs.mkdir(path.dirname(destination), {
            recursive: true
        });

        const content = await fs.readFile(file);

        if (extension === ".html") {
            const output = await minifyHTML(
                content.toString("utf8"),
                {
                    collapseWhitespace: true,
                    removeComments: true,
                    minifyCSS: true,
                    minifyJS: true
                }
            );

            await fs.writeFile(destination, output);
        } else if (extension === ".css") {
            const output = new CleanCSS({
                level: 2
            }).minify(content.toString("utf8"));

            if (output.errors.length > 0) {
                throw new Error(
                    `CSS error in ${relativePath}: ${output.errors.join("; ")}`
                );
            }

            await fs.writeFile(destination, output.styles);
        } else if (extension === ".js") {
            const output = await minifyJS(
                content.toString("utf8")
            );

            if (output.error) {
                throw output.error;
            }

            await fs.writeFile(destination, output.code);
        } else if (extension === ".json") {
            const parsed = JSON.parse(content.toString("utf8"));

            await fs.writeFile(
                destination,
                JSON.stringify(parsed)
            );
        } else {
            await fs.copyFile(file, destination);
        }
    }

    console.log("Production build completed successfully.");
    console.log(`Output directory: ${DIST}`);
}

build().catch((error) => {
    console.error("Production build failed:", error);
    process.exit(1);
});