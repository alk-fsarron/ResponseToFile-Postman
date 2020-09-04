const express = require('express'),
  app = express(),
  fs = require('fs'),
  shell = require('shelljs'),

   // Modify the folder path in which responses need to be stored
  folderPath = './Responses/',
  defaultFileExtension = 'json', // Change the default file extension
  bodyParser = require('body-parser'),
  DEFAULT_MODE = 'writeFile',
  path = require('path');

const port = 3000;

// Create the folder path in case it doesn't exist
shell.mkdir('-p', folderPath);

 // Change the limits according to your response size
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 

app.get('/', (req, res) => res.send('Hello, I write data to file. Send them requests!'));

app.post('/write', (req, res) => {
  let extension = req.body.fileExtension || defaultFileExtension,
    fsMode = req.body.mode || DEFAULT_MODE,
    uniqueIdentifier = req.body.uniqueIdentifier ? typeof req.body.uniqueIdentifier === 'boolean' ? Date.now() : req.body.uniqueIdentifier : false,
    filename = `${req.body.requestName}${uniqueIdentifier || ''}`,
    filePath = `${path.join(folderPath, filename)}.${extension}`,
    base64decode = !!req.body.base64decode,
    fileContent = req.body.fileContent || '' ,
    options = req.body.options || undefined;

  if (base64decode) {
    fileContent = Buffer.from(fileContent, 'base64');
  }

  fs[fsMode](filePath, fileContent, options, (err) => {
    if (err) {
      console.log(err);
      res.send('Error');
    }
    else {
      res.send('Success');
    }
  });
});

app.listen(port, () => {
  console.log(`ResponsesToFile App is listening now on port ${port}! Send them requests my way!`);
  console.log(`Data is being stored at location: ${path.join(process.cwd(), folderPath)}`);
});