/**
 * Slack
 */
class Slack {
  constructor() {
    const prop = PropertiesService.getScriptProperties().getProperties();
    this.slackWebhookUrl = prop.slackWebhookUrl;
  }

  send(message) {
    const data = {
      'text': message,
      'username': 'Twitter検索くん',
      'icon_emoji': 'fire_engine'
    };
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    };
    UrlFetchApp.fetch(this.slackWebhookUrl, options);
  }
}

