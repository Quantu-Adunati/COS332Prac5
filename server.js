const http = require("http");
const ldap = require('ldapjs');
const url = require('url');
const fs = require("fs");

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
        resolve(name)
        });
    });
}
function getName()
{
    return new Promise((resolve)=>
    {
        readline.question(`Name to search?`, (name) => {
        console.log(`Name entered ${name}!`)       
        readline.close()
        resolve(name)
        });
    });
}

function doLDAP(name)
{
    var client = ldap.createClient({
        url: `ldap://${global.address}:389`
    });
    const searchOptions = {
        scope: "sub",
        filter:`(objectClass=*)`
    }
    client.search(`cn=${name},cn=Friends,cn=admin,dc=cos332,dc=com`,searchOptions, function(err, res) {
       console.log(err);
      
        res.on('searchEntry', function(entry) {
          console.log('entry: ' + JSON.stringify(entry.object.mobile));
          return new Promise((resolve)=>
          {
            resolve();
          });
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
function callTheLoop()
{
    askQuestion().then(getName).then(doLDAP).then(callTheLoop);
}
callTheLoop();



