const http = require("http");
const ldap = require('ldapjs');
//The following is to get the server IP from the user terminal input 
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
//Global variable declaration
global.address;
  //Cause the IP keeps changing
function askQuestion()
{
    return new Promise((resolve)=>
    {
        readline.question(`Server IP address?`, (name) => {
        console.log(`Address ${name}!`)
        global.address = name        
        readline.close()
        resolve(name)
        });
    });
}
function doLDAP(name)
{
    var client = ldap.createClient({
        url: `ldap://${name}:389`
    });
    client.search('ou=Friends', function(err, res) {
        assert.ifError(err);
      
        res.on('searchEntry', function(entry) {
          console.log('entry: ' + JSON.stringify(entry.object));
        });
        res.on('searchReference', function(referral) {
          console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function(err) {
          console.error('error: ' + err.message);
        });
        res.on('end', function(result) {
          console.log('status: ' + result.status);
        });
      });
}
askQuestion().then(doLDAP);

