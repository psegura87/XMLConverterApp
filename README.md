**XML Converter**

This standalone Node-Webkit application takes in any .xml file, parses it, and inserts it into and designated .docx template.

**Template creation instruction:**

Any place inside the .docx file where xml data is to be inserted, there needs to be the corresponding xml node variable wrapped in curly brackets.  For example:

**In .xml:** &nbsp;&nbsp;&nbsp;&nbsp;  <incident_number>ETYF43563463</incident_number>

**In .docx template:** &nbsp;&nbsp;&nbsp;&nbsp; Incident Number: {incident_number}

**This will output to:**  &nbsp;&nbsp;&nbsp;&nbsp;  Incident Number: ETYF43563463


------------


**That's All!**
