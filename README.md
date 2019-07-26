![npm version](https://img.shields.io/npm/v/npmlister.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/npmlister.svg)
![npm license](https://img.shields.io/npm/l/npmlister.svg)
# npmLister
Outputs all npm Packages as well as Dependencies within a Node.JS Project as JSON.

# How to use
Run `npx npmlister` on your project to run once.  
Or run `npm i npmlister -g` to install and then use `npmlister` in your project to run.

## Arguments
`-?`  
Shows Help  
`-obj`  
Outputs Packagedata as an Object instead of an Array. Keys are the Package names  
`-pp`  
Pretty-Prints the Output  
`-p [PATH]`  
Specifies the Path of the project from which you want to get the Package Listed. If this is not given, the current path will be used  
`-o [PATH]`  
Specifies the Path of where you want the JSON to be saved. If this is not given, the JSON will be printed to the Console.
