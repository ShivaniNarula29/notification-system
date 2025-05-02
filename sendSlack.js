const fs = require('fs');
const axios = require('axios');

// Load config.json
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

// Example: simulate receiving a VCS event
const incomingEvent = 'push'; // This could come from a webhook handler in reality

// Check if the event should trigger a Slack notification
if (config.vcs.events.includes(incomingEvent)) {
  const slackUrl = config.notifications.slack.webhookUrl;

  const payload = {
    text: `🔔 VCS Event Triggered: ${incomingEvent} on ${config.vcs.url}`
  };

  axios.post(slackUrl, payload)
    .then(res => {
      console.log('✅ Slack notification sent:', res.status);
    })
    .catch(err => {
      console.error('❌ Failed to send Slack message:', err.message);
    });
} else {
  console.log(`ℹ️ Event '${incomingEvent}' not in config — no Slack message sent.`);
}

