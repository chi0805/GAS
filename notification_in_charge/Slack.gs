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
      'username': '担当者通知Bot',
      'icon_emoji': 'alien'
    };
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    };
    UrlFetchApp.fetch(this.slackWebhookUrl, options);
  }
}
