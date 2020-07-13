const SlackBot = require('slackbots');
const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const bot = new SlackBot({
    token: process.env.BOT_TOKEN,
    name: process.env.BOT_NAME
})

// Start Handler
bot.on('start', () => {

    bot.postMessageToChannel(
        process.env.SLACK_CHANNEL,
        process.env.START_MESSAGE
    );
})

// Error Handler
bot.on('error', (err) => {
    console.log(err);
})

// Message Handler
bot.on('message', (data) => {
    if(data.type !== 'message') {
        return;
    }
    handleMessage(data.text);
})

//Response Messages
function handleMessage(message) {
    if(message.includes(' run smoke')) {
        runSmoke()
    } else if(message.includes(' help')) {
        runHelp();
    }
}

// Run Tests
function runSmoke() {
    axios.post(process.env.WORKFLOW_URL)
      .then(res => {       
            bot.postMessageToChannel(
                process.env.SLACK_CHANNEL,
                process.env.RUN_MESSAGE
            );

      })
}

// Show Help
function runHelp() {
    const params = {
        icon_emoji: ':question:'
    }

    bot.postMessageToChannel(
        process.env.SLACK_CHANNEL,
        process.env.HELP_MESSAGE,
        params
    );
}