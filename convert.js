const fs = require('fs');
const readline = require('readline');
const convert_nested_objects = require('./convert_nested_objects');

async function processLineByLine() {
const fileStream = fs.createReadStream('test.log');

const rl = readline.createInterface({

  input: fileStream, //input <stream.Readable> The Readable stream to listen to. This option is required.
  crlfDelay: Infinity

});
  // crlfDelay <number> If the delay between \r and \n exceeds crlfDelay milliseconds, 
  // both \r and \n will be treated as separate end-of-line input. crlfDelay will be 
  // coerced to a number no less than 100. It can be set to Infinity, in which 
  // case \r followed by \n will always be considered a single newline (which may be 
  // reasonable for reading files with \r\n line delimiter). Default: 100.

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) { //looping through each line

      let Line_Text = "";

      for(let i in line){ //looping through each word

        Line_Text+=line[i] ;

      }
      const parsed_text = JSON.parse(Line_Text); //storing each line's data int Line_Text and coverting it to json
              
      for (let parsed_object in parsed_text){ //looping through each object of json

          let fileObjects = { //creating object so that we can pass it to recursive function (pass by reference)

              filename: parsed_object,
              content: ""

          };

          if(parsed_text[parsed_object] === null){

              fs.writeFileSync(fileObjects.filename+".column.log", "\n", {flag:'a'});

          }

          else if (typeof parsed_text[parsed_object] === "object") {

              convert_nested_objects(parsed_text[parsed_object],fileObjects); // recursive funtion to check if there's nested objects in json and write data according to it.

          }
          
          else {

              fileObjects.filename = fileObjects.filename + ".column.log"; //naming each file according to our need.
              fileObjects.content = parsed_text[parsed_object]+"\n";
                        
              fs.writeFileSync(fileObjects.filename, fileObjects.content.toString(), {flag:'a'}); // writing data in file "flag: a" for appending.
                    
          }
      }
          
  }
}

processLineByLine();


