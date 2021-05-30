const setting = [
  {
    keyword: 'AWS 障害',
    beforeMinutes: 10,
    threshold: 10,
    tag: 'aws',
    notNotifyTime: 60,
  },
  {
    keyword: 'Twitterログイン 不具合',
    beforeMinutes: 10,
    threshold: 10,
    tag: 'twitter_login',
    notNotifyTime: 60,
  }
]

function main() {
  const twitter = new Twitter();
  const slack = new Slack();

  for(let i = 0; i < setting.length; i++) {
    let tag = setting[i].tag;
    let keyword = setting[i].keyword;
    let beforeMinutes = setting[i].beforeMinutes;
    let threshold = setting[i].threshold;
    let notNotifyTime = setting[i].notNotifyTime;
    let notified = ScriptProperties.getProperty(tag);

    if (notified > 0) {
      // 通知しない時間のツイート数を確認し、閾値未満であれば通知済フラグを0とする
      let result = twitter.searchKeyword(notNotifyTime, keyword);
      if (result.numberOfTweets < threshold) {
        ScriptProperties.setProperty(tag, 0);
        Logger.log(keyword + ' の通知済フラグを0に変更しました');
      }
      continue;
    }

    let result = twitter.searchKeyword(beforeMinutes, keyword);

    if (result.numberOfTweets >= threshold) {
      let uri = encodeURI('https://twitter.com/search?f=live&' + result.params);
      PropertiesService.getScriptProperties().setProperty(tag, 1);
      let message = keyword + 'のツイートが' + beforeMinutes +  '分間で' + result.numberOfTweets +  '件投稿されています\n' + uri;
      slack.send(message);
      ScriptProperties.setProperty(tag, 1);
      Logger.log(keyword + ' の通知済フラグを1に変更しました');
    }
  }
}

