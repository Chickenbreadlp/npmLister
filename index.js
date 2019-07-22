const fs = require('fs');
const path = require('path');
const getDirectories = source => fs.readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
let array = true;
let runPath = process.cwd();

// Checks for given arguments
/*
** -?         -> Help
** -obj       -> Packagelist as Object rather than Array
** -p [PATH]  -> Specifies runpath
** -o [PATH]  -> Outputfile instead of Console-Output
*/
if (process.argv.indexOf('-?') >= 0) {
  console.log('Lists all installed npm packages and dependencies in JSON.\n' +
    'The packages are listed with their full-name, author, description, homepage, version, license and license text.\n\n' +
    'Arguments:\n' +
    '\t-?\t\tDisplays this text\n\n' +
    '\t-obj\t\tReturns the List of Packages as an Object rather than an array.\n' +
    '\t  \t\tThe package-names make up the keys.\n\n' +
    '\t-p [PATH]\tSpecifies a custom location to run from\n\n' +
    '\t-o [PATH]\tSpecifies a file-output'
  );
}
if (process.argv.indexOf('-obj') >= 0) {
  array = false;
}
if (process.argv.indexOf('-p') >= 0 && process.argv.indexOf('-p') + 1 < process.argv.length) {
  runPath = process.argv[process.argv.indexOf('-p') + 1]
}

var allPackages;

if (array) {
  allPackages = []
}
else {
  allPackages = {}
}

// Returns the contents of the package.json
function readPackageData(modulePath) {
  var rawdata = fs.readFileSync(path.resolve(runPath, 'node_modules', modulePath, 'package.json'));
  var package = JSON.parse(rawdata);

  return package;
}
// Returns the contents of the license file
function readLicenseFile(modulePath) {
  if (fs.existsSync(path.resolve(runPath, 'node_modules', modulePath, 'LICENSE'))) {
    var licenseText = fs.readFileSync(path.resolve(runPath, 'node_modules', modulePath, 'LICENSE'), { encoding: 'utf8'});
    return licenseText
  }
  else {
    return ''
  }
}

// Adds a package with it's license to the allPackages object
function addPackage(modulePath) {
  // Gets the package.json and the license
  var package = readPackageData(modulePath);
  var license = readLicenseFile(modulePath);

  if (typeof package.author !== 'object') {
    package.author = {
      name: '',
      email: ''
    }
  }

  // Adds it all to the AllPackages Object
  if (array) {
    allPackages.push({
      name: package.name,
      author: package.author,
      description: package.description,
      license: package.license,
      licenseText: license,
      homepage: package.homepage,
      version: package.version
    });
  }
  else {
    allPackages[package.name] = {
      author: package.author,
      description: package.description,
      license: package.license,
      licenseText: license,
      homepage: package.homepage,
      version: package.version
    };
  }
}

if (fs.existsSync(path.resolve(runPath, 'node_modules'))) {
  // Gets an Array of all node_modules
  var allDirs = getDirectories(path.resolve(runPath, 'node_modules'));

  for (var i = 0; i < allDirs.length; i++) {
    // Only if the folder isn't a "hidden" one, check if it's a module collection or not
    if (allDirs[i].indexOf('.') !== 0) {
      if (allDirs[i].indexOf('@') === 0) {
        // go through all the modules within a module collection
        var tmpDirs = getDirectories(path.resolve(runPath, 'node_modules', allDirs[i]))
        for (var j = 0; j < tmpDirs.length; j++) {
          if (tmpDirs[j].indexOf('.') !== 0 && tmpDirs[j].indexOf('@') !== 0) {
            addPackage(allDirs[i] + '/' + tmpDirs[j]);
          }
        }
      }
      else {
        // add the module
        addPackage(allDirs[i]);
      }
    }
  }

  // output the allPackages Object
  // Checks wether the OutputFile Arg is given
  if (process.argv.indexOf('-o') >= 0 && process.argv.indexOf('-o') + 1 < process.argv.length) {
    // Writes Packagedata to specified file
    var outputFile = process.argv[process.argv.indexOf('-o') + 1];
    fs.writeFileSync(outputFile, JSON.stringify(allPackages), { encoding: 'utf8' });
    console.log('File written: ' + path.resolve(outputFile));
  }
  else {
    // Outputs Packagedata to Console (Useful for pipes)
    console.log(JSON.stringify(allPackages));
  }
}
