var fs = require('fs');

var testFolder = './data';

fs.readdir(testFolder, function (error, filelist)
{
  console.log(filelist);
});
