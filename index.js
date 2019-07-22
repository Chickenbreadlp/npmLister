const fs = require('fs');
const getDirectories = source => fs.readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
const array = true;

var allPackages;

if (array) {
  allPackages = []
}
else {
  allPackages = {}
}

// Returns the contents of the package.json
function readPackageData(modulePath) {
  var rawdata = fs.readFileSync('./node_modules/' + modulePath + '/package.json');
  var package = JSON.parse(rawdata);

  return package;
}
// Returns the contents of the license file
function readLicenseFile(modulePath) {
  if (fs.existsSync('./node_modules/' + modulePath + '/LICENSE')) {
    var licenseText = fs.readFileSync('./node_modules/' + modulePath + '/LICENSE', { encoding: 'utf8'});
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

if (fs.existsSync('./node_modules')) {
  // Gets an Array of all node_modules
  var allDirs = getDirectories('./node_modules');

  for (var i = 0; i < allDirs.length; i++) {
    // Only if the folder isn't a "hidden" one, check if it's a module collection or not
    if (allDirs[i].indexOf('.') !== 0) {
      if (allDirs[i].indexOf('@') === 0) {
        // go through all the modules within a module collection
        var tmpDirs = getDirectories('./node_modules/' + allDirs[i])
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
  console.log(JSON.stringify(allPackages));
}
