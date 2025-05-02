const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

// Read the config file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const slackWebhook = config.notifications.slack.webhookUrl;

app.use(bodyParser.json());

app.post('/github', async (req, res) => {
  const event = req.headers['x-github-event'];

  if (event === 'push') {
    const pusher = req.body.pusher.name;
    const repo = req.body.repository.name;
    const branch = req.body.ref.split('/').pop();
    const commits = req.body.commits.map(commit => `- ${commit.message} (${commit.id.substring(0, 7)})`).join('\n');

    const message = {
      text: `📦 *${pusher}* pushed to *${repo}* on *${branch}*\n${commits}`
    };

    try {
      await axios.post(slackWebhook, message);
      res.status(200).send('Slack message sent!');
    } catch (err) {
      console.error('Error posting to Slack:', err.message);
      res.status(500).send('Error sending Slack message');
    }
  } else {
    res.status(200).send('Event not handled');
  }
});

app.listen(port, () => {
  console.log(`✅ GitHub webhook listener running on port ${port}`);
});
