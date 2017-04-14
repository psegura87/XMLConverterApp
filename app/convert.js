var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var moment = require('moment');

//store parse xml file as JSON
var parsedJSON = '';
var content, zip, doc;

function templateInput(template) {

    //Load the docx file as a binary
    // var content = fs
    //     .readFileSync(path.resolve('C:/Users/psegura/Documents/BurwoodGithub/XMLConverter/', 'incident_template.docx'), 'binary');

    //Allows user to choose template.  Code above is a hardcoded template.  To set hardcoded template, user needs to contact me.
    content = fs
        .readFileSync(path.resolve(template), 'binary');

    zip = new JSZip(content);

    doc = new Docxtemplater();
    doc.loadZip(zip);

    document.getElementById('template').value = "Template Accepted!";
    document.getElementById('template').style.backgroundColor = "white";
}

function readFile(fileConvert) {

    if (!content) {
        document.getElementById('holder').value = "No Template Specified!";
        document.getElementById('holder').style.backgroundColor = "white";
        setTimeout(function() {
            document.getElementById('holder').value = "";
            return;
        }, 2000);
    } else {
      fs.readFile(fileConvert, function(error, data) {
        parseString(data, {trim: true, explicitArray: false, explicitRoot: false, normalize: true}, function(err, result) {
          parsedJSON = result.incident;
          console.log(parsedJSON);
          renderXML(parsedJSON, fileConvert);
        })
      });
    }
}

function renderXML(parsedData, pathName) {
    //set the templateVariables
    doc.setData(
      {number: parsedData.number,
      contact: parsedData.caller_id.$.display_value,
      opened: moment(parsedData.opened_at).format('MMMM Do YYYY'),
      closed: moment(parsedData.closed_at).format('MMMM Do YYYY'),
      impact: parsedData.impact,
      status: '',
      short_description: parsedData.short_description}
      // parsedJSON
    );

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
    }
    catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        };
        console.log(JSON.stringify({error: e}));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
    }

    var buf = doc.getZip()
                 .generate({type: 'nodebuffer'});

    var outputPath = path.dirname(pathName) + '/';

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve(outputPath, 'report.docx'), buf);

    //confim conversion to DOM
    document.getElementById('holder').value = "File Converted to report.docx!";
    document.getElementById('holder').style.backgroundColor = "white";
}
