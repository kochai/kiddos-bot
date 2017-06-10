require('dotenv').config();
var restify = require('restify');
var builder = require('botbuilder');
var weather = require('weather-js');
var parser = require('rss-parser');
var apod = require('nasa-apod');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8080, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PW
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Bot on
bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Desi %s... Šta ima? Ako ti treba nešto preko veze, tutni jednu ciglu ispod stola i isčitaj: https://github.com/kochai/kiddos-bot", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});

// Bots Dialogs

String.prototype.contains = function(content){
  return this.indexOf(content) !== -1;
}

bot.dialog('/', function (session) {
  let lcMessage = session.message.text.toLowerCase();
  console.log(message.user);
  console.log(lcMessage);
  // prevent replying unless mentioned
  if (lcMessage.contains(process.env.BOT_ID)) {

    // Because javascript things
    switch (true) {
      case lcMessage.contains('ćao'):
      case lcMessage.contains('cao'):
        session.send(`De si brate, e si mi dobar?`);
      break;
      case lcMessage.contains('pomoć'):
      case lcMessage.contains('pomoc'):
        session.send(`Ako ti treba pomoć, uvek je moš naći, samo treba znati gde potražiti.`);
      break;
      case lcMessage.contains('ko je najveci car danas?'):
        // todo get all users and display message
      break;
      case lcMessage.contains('basshunter'):
        session.send(`https://www.youtube.com/watch?v=Y7EQaNlsEFs`);
      break;
      case lcMessage.contains('attila'):
        session.send(`https://www.youtube.com/watch?v=ZTidn2dBYbY`);
      break;
      case lcMessage.contains('ljo'):
        session.send(`https://www.youtube.com/watch?v=kzMkWxryWeM`);
      break;
      case lcMessage.contains('laza'):
        session.send(`https://www.youtube.com/watch?v=RnqAXuLZlaE`);
      break;
      case lcMessage.contains('mare'):
        session.send(`https://www.youtube.com/watch?v=GZR58d77a4A`);
      break;
      case lcMessage.contains('iva'):
        session.send(`https://www.youtube.com/watch?v=nEjPDS8Jp1E&t=1s`);
      break;
      case lcMessage.contains('nasa pod'):
        var response = '';

        apod().then(function(data) {
            response += data.title + '\n\n';
            response += data.explanation + '\n\n';
            response += data.hdurl + '\n\n';
            session.send(response);
        });

      break;
      case lcMessage.contains('šta radit večeras?'):
      case lcMessage.contains('sta radit veceras?'):
        parser.parseURL('https://belgradeatnight.com/feed/', function(err, parsed) {
          if(err) console.log(err);
          var response = '';

          parsed.feed.entries.forEach(function(entry) {
            response += entry.title + '\n\n';
            response += entry.link + '\n\n';
          })

          session.send(response);
        });
      break;
      case lcMessage.contains('vreme'):
        if (lcMessage.contains('dugorocna')) {
          var pattern = /dugorocna\b(.*)\b/;
          var city = lcMessage.match(pattern)[1];

          weather.find({search: city, degreeType: 'C'}, function(err, result) {
            if(err) console.log(err);
            session.send('Trenutno u ' + result[0].location.name + ' je ' + result[0].current.temperature + ' stepeni, najviša dnevna temperatura će biti ' + result[0].forecast[0].high + ' stepeni, a najniža ' + result[0].forecast[0].low + ". Sutra se očekuje najviša temperatura od " + result[0].forecast[1].high + " stepeni.");
          });

        } else if {
          var pattern = /vreme\b(.*)\b/;
          var city = lcMessage.match(pattern)[1];

          weather.find({search: city, degreeType: 'C'}, function(err, result) {
            if(err) console.log(err);
            session.send('Trenutno u ' + result[0].location.name + ' je ' + result[0].current.temperature + ' stepeni, najviša dnevna temperatura će biti ' + result[0].forecast[0].high + ' stepeni, a najniža ' + result[0].forecast[0].low + ".");
          });

        }
      break;
      default:
        session.send(`Ako ti treba pomoć, moš slobodno pogledati listu komandi na sledećem URL-u: https://github.com/kochai/kiddos-bot`);
      break;
    }
  }
});