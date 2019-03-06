const request = require("request");
const fs = require("fs");
require('dotenv').config();
const auth = 'Basic ' + new Buffer(process.env.APIKEY + ':' + process.env.APIPASSWORD).toString('base64');

const makeHTTPSRequest = () => {
      return new Promise((resolve, reject) => {
            const options = {
                  'url':'https://api.myintervals.com/person/?limit=10000' ,
                  'headers': {
                        'Authorization': auth,
                        'Accept': 'application/json'
                  }
            }

            request(options, function (error, response, body) {
                  if (error) {
                        console.log('error:', error); // Print the error if one occurred
                        reject(error);
                  }

                  resolve(JSON.parse(body));
            });
      });
}

const writeToFile = (str) => {
      return new Promise((resolve, reject) => {
                fs.writeFile('users.txt', str, (err) => {
                // throws an error, you could also catch it here
                if (err){
                      reject(err);
                }

                resolve("success!");
                // success case, the file was saved
                console.log('Lyric saved!');
            });
      });
}

makeHTTPSRequest().then((userObject) => {
      let stringToWrite = "";
      for(let i = 0; i < userObject.person.length; i++){
            const id = userObject.person[i].id;
            const firstName = userObject.person[i].firstname;
            const lastName = userObject.person[i].lastname;
            const group = userObject.person[i].group;
            const groupID = userObject.person[i].groupid;
            const timezone = userObject.person[i].timezone;
            const timezoneOffSet = userObject.person[i].timezone_offset;

            stringToWrite += `${i + 1}: ${id}, ${firstName}, ${lastName}, ${group}, ${groupID}, ${timezone}, ${timezoneOffSet}`
            stringToWrite += "\n";
      }

      return writeToFile(stringToWrite);
}).then(() => {
      console.log("done");
})
