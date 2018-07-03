"use strict";
const fs = require("fs");
const path = require("path");

let RelativeRequire;

const findPackageJSONRoot = function (appName)
{
    let currentLocation = path.dirname(module.parent.parent.filename);
    while (currentLocation !== path.resolve(currentLocation, ".."))
    {
        if (fs.lstatSync(currentLocation).isDirectory())
        {
            const folderContents = fs.readdirSync(currentLocation);
            const packageJSONPathExists = (folderContents.indexOf("package.json") > -1);
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
                    /* continue regardless of error */
                }
            }
        }

        currentLocation = path.resolve(currentLocation, "..");
    }
    return null;
};

const getRootFolder = function (appName, forceRescan)
{
    if (forceRescan)
    {
        RelativeRequire._location[appName] = findPackageJSONRoot(appName);
    }

    return RelativeRequire._location[appName];
};

RelativeRequire = function (appName, relativePath, forceRescan)
{
    let rootLocation;
    if (forceRescan)
    {
        rootLocation = getRootFolder(appName, forceRescan);
    }
    else
    {
        if (RelativeRequire._location[appName])
        {
            rootLocation = RelativeRequire._location[appName];
        }
        else
        {
            rootLocation = findPackageJSONRoot(appName);
            RelativeRequire._location[appName] = rootLocation;
        }
    }

    if (rootLocation)
    {
        const pathToBeRequired = path.resolve(rootLocation, relativePath);
        return require(pathToBeRequired);
    }

    throw new Error("Unable to find root path of app " + appName);
};

RelativeRequire.getRootFolder = getRootFolder;

RelativeRequire._location = {};

module.exports.RelativeRequire = RelativeRequire;
