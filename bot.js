var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var webUpdater = require('./webUpdater.js');

//initialize debug logger notifications
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

//initialize Discord bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

//logs bot information if both initialization successful
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

//listens for "!" messages in chat
bot.on('message', function (user, userID, channelID, message, evt) {
if(message.substring(0, 1) == "!") {
  var args = message.substring(1).split(' ');
  var cmd = args[0];

  //remove "!" from message
  args = args.splice(1);

  //switch/case routes message between help/update/ignore
  switch(cmd) {
    case 'help':
      bot.sendMessage({
        to: channelID,
        message: 'Hi! In order to update gilrace.com, just use the "!update" command followed by your first name and gil amount! \n\nFor example, if you are Pavel and you are reporting that you now have 10,000,000g, you would use the command "!update Pavel 10000000" \n\nDon\'t try any weird commands or other formats though because I\'m a low effort tool to make Pavel\'s life easier.'
      });
      break;
    case 'update':
      if(args.length != 2)
      {
        bot.sendMessage({
          to: channelID,
          message: 'Not enough inputs for update statement. Update requires a string:name and int:value.'
        });
        return;
      }
      //validates that proper input was entered for name and gil amounts
      args[0] = args[0].toLowerCase();
      console.log(!isNaN(args[1]))
      if(args[0] != 'pavel' && args[0] != 'kyma' || isNaN(args[1]))
      {
        console.log(!isNaN(args[1]))
        bot.sendMessage({
          to: channelID,
          message: 'Name must either be \'Pavel\' or \'Kyma\' and gil amount must be an integer.'
        });
        return;
      } 
      else{   
      bot.sendMessage({
        to: channelID,
        message: `K u got it! I\'m updating ${args[0]}'s gil amount. It is now ${args[1]}!`
      });

      //calls webUpdater.js to update values and publish changes.
      webUpdater.UpdateValues(args[0], parseInt(args[1]));
      return;
      }
    default:  
      break;
  }
}
});