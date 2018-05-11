const fs = require("fs");
const path = require("path");
const _ = require("underscore");

const findPackageJSONRoot = function(appName)
{
    let currentLocation = path.dirname(module.parent.filename);
    while(currentLocation !== path.resolve(currentLocation, ".."))
    {
        if (fs.lstatSync(currentLocation).isDirectory())
        {
            const folderContents = fs.readdirSync(currentLocation);
            const packageJSONPathExists = ( folderContents.indexOf("package.json") > -1 );
            const pathPackageJSON = path.join(currentLocation, "package.json");

            if (packageJSONPathExists)
            {
                try
                {
                    let packageJSON = require(pathPackageJSON);
                    if (packageJSON.name === appName)
                    {
                        return currentLocation;
                    }
                }
                catch (e)
                {
                }
            }
        }

        currentLocation = path.resolve(currentLocation, "..");
    }
    return null;
};

const RootRequire = function(appName, relativePath, forceRescan)
{
    let rootLocation;
    if(forceRescan)
    {
        rootLocation = RootRequire._location[appName] = findPackageJSONRoot(appName);
    }
    else
    {
        if(RootRequire._location[appName])
        {
            rootLocation = RootRequire._location[appName];
        }
        else
        {
            rootLocation = findPackageJSONRoot(appName);
            RootRequire._location[appName] = rootLocation;
        }
    }


    if(rootLocation)
    {
        const pathToBeRequired = path.resolve(rootLocation, relativePath);
        return require(pathToBeRequired);
    }
    else
    {
        throw new Error("Unable to find root path of app " + appName);
    }
};

RootRequire._location = {};

module.exports = RootRequire;

