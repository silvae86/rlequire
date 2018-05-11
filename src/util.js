module.exports.isNull = function (object)
{
    if (object === null)
    {
        return true;
    }

    if (typeof object === "undefined")
    {
        return true;
    }

    return false;
};

module.exports.pathInApp = function (filePath)
{
    const path = require("path");
    return path.join(path.resolve(__dirname, ".."), filePath);
};

