var fs = require("fs");
var path = require("path");
var _ = require("underscore");

var findPackageJSONRoot = function(appName)
{
    const currentLocation = __dirname;
    while(currentLocation)
    {
        const packageJSONPath = _.find(fs.readdirSync(dirname), "package.json");

        if(packageJSONPath)
        {
            try
            {
                var packageJSON = JSON.parse(packageJSONPath);
                if(packageJSON.name === appName)
                {
                    return currentLocation;
                }
            }
            catch(e)
            {
                throw new Error("Error while parsing file " + packageJSONPath);
            }
        }
    }
    return null;
};

var RootFinder = function(appName, relativePath, forceRescan)
{
    var rootLocation;
    if(forceRescan)
    {
        RootFinder._location = findPackageJSONRoot(appName);
    }
    else
    {
        if(RootFinder._location)
        {
            rootLocation = RootFinder._location;
        }
        else
        {
            rootLocation = findPackageJSONRoot(appName);
            RootFinder._location = rootLocation;
        }
    }

    return require(path.resolve(rootLocation, relativePath));
};

RootFinder._location = null;

module.exports = RootFinder;

