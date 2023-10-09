const fs = require('fs');
const path = require('path');
const fPath = "resources/";
const { execFile  } = require('child_process');
const chalk = require("chalk");

const getFileList = (dirName) => {
    const files = fs.readdirSync(dirName);
    return files;
};

const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        
        if (!fs.existsSync(path.join("compiled/", dirPath, "/", file))){
            fs.mkdirSync(path.join("compiled/", dirPath, "/", file), {recursive: true});
        }
      } else {
        arrayOfFiles.push(path.join(dirPath, "/", file))
      }
    })
  
    return arrayOfFiles
  }

function getDirectories(fpath) {
    return fs.readdirSync(fpath).filter(function (file) {
        console.log("\n\n\n==========================");
        console.log("Compiling script: "+file);
        console.log("==========================");
        let files = getAllFiles(fpath+file)
        files.forEach((element) => {
            if(path.extname(element) == ".lua") {
                console.log(chalk.red("Compiling .lua file: ")+chalk.cyan(element));
                const filePath = element;
                const finishPath = "compiled/"+element+"c";
                execFile("luac_mta", ["-e3", "-s", "-o", finishPath ,filePath]);
            }else if(element.includes("meta.xml")){
                console.log(chalk.yellow("Compiling meta.xml file"));
                const filePath = element;
                const finishPath = "compiled/"+element;
                const data = fs.readFileSync(filePath, 'utf8');
                const compiledData = data.replace(/.lua/g, '.luac');
                var writeStream = fs.createWriteStream(finishPath);
                writeStream.write(compiledData);
                writeStream.end();
            }else if (path.extname(element) == ".dff"){
                console.log("Compiling .dff file: "+element);
            }else {
                const filePath = element;
                const finishPath = "compiled/"+element;
                console.log("Moving other file: "+element);
                fs.copyFile(filePath, finishPath,fs.constants.COPYFILE_FICLONE, (err) => { if (err) throw err;});
            }
        })
    });
}

getDirectories(fPath);
