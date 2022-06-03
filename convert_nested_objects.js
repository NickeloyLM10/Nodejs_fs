const fs = require('fs');

module.exports = function printAllVals(object, fileObject) {

    for (let nested_object in object) {

      var tmp = fileObject.filename;  // creating temporary variable so that it can be stored in case of multi objects in nested object
      fileObject.filename = fileObject.filename + "." + nested_object; // naming file according our need

          if(object[nested_object] === null){

              fs.writeFileSync(fileObject.filename+".column.log", "\n", {flag:'a'});

          }

          else if (typeof object[nested_object] === "object") {

              printAllVals(object[nested_object],fileObject)  // recursive call

           } 
           else {

              fileObject.filename = fileObject.filename + ".column.log"
              fileObject.content = object[nested_object]+"\n";

              fs.writeFileSync(fileObject.filename, fileObject.content.toString(), {flag:'a'});

              fileObject.filename = tmp;  // using tmp to rename filename to that it was before entering this particular object
        
          }
    }
}
