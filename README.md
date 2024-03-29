# Nodejs_fs

Goal : 
The goal of this project is to be able to convert huge JSON-based log files into columnar files. The conversion to columnar files should be performed in single pass.
The size of JSON log file will range between 4GB to 48GB (sample log files of different sizes).

----------------------------------------------------------------------------------------------------------------------------------

Problem Statement

We want to build a simple tool that will convert this JSON-based log to columnar format, i.e., we want to create one file per column.
Example, if we have the following 2 log lines:

{"timestamp": "2022-01-14T00:12:21.000", "Field1": 10, "Field_Doc": {"f1": "xyz"}}
{"timestamp": "2022-01-18T00:15:51.000", "Field_Doc": {"f1": "abc", "f2": 1.7}}

It will generate 4 files:
1. timestamp.column
2. Field1.column
3. Field_Doc.f1.column
4. Field_Doc.f2.column

The column file format is as follows:
- string fields are separated by a new line '\n' character. Assume that no string value has new line characters, so no need to worry about escaping them
- double, integer & boolean fields are represented as a single value per line
- null, undefined & empty strings are represented as an empty line

Example content of timestamp.column:
2022-01-14T00:12:21.000
2022-01-18T00:15:51.000

Example content of Field_Doc.f1.column:
xyz
abc

Note: The fields in the log will be dynamic. Do not assume that these are all the expected properties, or that this is the max. level of nesting.

-------------------------------------------------------------------------------------------------------------------------------------

This problem can be solved by file system module in Nodejs 

The Node.js file system module allows you to work with the file system on your computer.
To include the File System module, use the require() method:
    var fs = require('fs');

For reading input line-by-line readline module is used
Readline Module in Node.js allows the reading of input stream line by line. This module wraps up the process standard output and process standard input objects. Readline module makes it easier for input and reading the output given by the user. To use this module, create a new JavaScript file and write the following code at the starting of the application – 
    const readline = require('readline');

After that an async function is created named processLineByLine and then a constant is defined to open up a file/stream and read the data present in it using createReadStream
The createReadStream() method is an inbuilt application programming interface of fs module which allow you to open up a file/stream and read the data present in it.
    const fileStream = fs.createReadStream('test.log');

Storing data of each line in "let Line_Text = "";" so that it can be used to parse json file iterating it through loop

Now we have json object, and since The fields in the log will be dynamic we need consider this in our application so we need to call each object recursively to check if it contains nested object and to pass variable by reference we need to create new object 

    let fileObjects = { //creating object so that we can pass it to recursive function (pass by reference)

              filename: parsed_object,
              content: ""

          };
          filename to store file name
          content is data that is going to be transfered in file

As given in problem else "null, undefined & empty strings are represented as an empty line" we need to check if data is null we need to create empty line

    if(parsed_text[parsed_object] === null){

              fs.writeFileSync(fileObjects.filename+".column.log", "\n", {flag:'a'});

          }

And if it contains nested object we will call recursive funtion 

    else if (typeof parsed_text[parsed_object] === "object") {

              convert_nested_objects(parsed_text[parsed_object],fileObjects);

          }
          convert_nested_objects is recursive function

And if above two conditions are false we need to just write data in file

    else {

              fileObjects.filename = fileObjects.filename + ".column.log"; 
              fileObjects.content = parsed_text[parsed_object]+"\n";
                        
              fs.writeFileSync(fileObjects.filename, fileObjects.content.toString(), {flag:'a'}); // writing data in file "flag: a" for appending.
                    
          }

Now in convert_nested_objects function we passed object, fileObject by reference.
each nested object is being traversed and if it contains another nested loop it will itself

    else if (typeof object[nested_object] === "object") {

              printAllVals(object[nested_object],fileObject)  

           } 

and other conditions as same as before


-------------------------------------------------------------------------------------------------------------------------------------


Time complexity:

we are traversing each line and after that traversing each word to store it in Line_Text

    for(let i in line){ 

            Line_Text+=line[i] ;

        }
and then parsing it with 

    const parsed_text = JSON.parse(Line_Text); O(n)

after which we are traversing each object from this parsed_text and using recursion in case object is containing nested object

so overall time complexity is O(n*(m + m + l*k)) = O(2*n*m + n*l*k)
n = number of lines
m = number of words in each line
l = number of objects in particular parsed data
k = number of nested objects

Space complexity:

space complexity depends on how many variables we are creating in loop and how many times recursive function is returning something
let Line_Text = "";
const parsed_text = JSON.parse(Line_Text);
let fileObjects = {

              filename: parsed_object,
              content: ""

          };

so overall space complexity is O(n*(1 + 1 + m*(1+l))) = O(2*n + n*m + n*m*l)
n = number of lines
m = number of objects
l = number of nested objects




Thank You ;)
