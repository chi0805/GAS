// 「AWS 障害」を含んだツイートの件数が10分以内に10件以上投稿された場合Slackに通知する
var apiKey = 'xxxxxxxxxxxxx';
var apiSecret = 'xxxxxxxxxxxxxxxxxxxx'
var slackWebhookUrl = 'xxxxxxxxxxxxxxxxxxxx';
var keywords = 'AWS 障害';
var beforeMinutes = 10;
var threshold = 10

function getBearerAuthHeader() {
  const blob = Utilities.newBlob(apiKey + ':' + apiSecret);
  const credential = Utilities.base64Encode(blob.getBytes());
  const formData = {
    'grant_type': 'client_credentials'
  };
  const basicAuthHeader = {
    'Authorization': 'Basic ' + credential
  };
  const options = {
    'method': 'post',
    'contentType': 'application/x-www-form-urlencoded;charset=UTF-8',
    'headers':  basicAuthHeader,
    'payload': formData,
  };
  const oauth2Response = UrlFetchApp.fetch('https://api.twitter.com/oauth2/token', options);  
  const bearerToken = JSON.parse(oauth2Response).access_token;
  const bearerAuthHeader = {
    'Authorization': 'Bearer ' + bearerToken
  };

  return bearerAuthHeader;
}

function getSinceDatetime(beforeMinutes) {
  const now = new Date();
  // 10分前の日時の取得
  const startTime = now.setMinutes(now.getMinutes() - beforeMinutes);
  const startDateTime = new Date(startTime);
  const year = startDateTime.getFullYear();
  const month = startDateTime.getMonth() + 1;
  const date = startDateTime.getDate();
  const hour = startDateTime.getHours();
  const minutes = startDateTime.getMinutes();
  const sinceDateTime = year + '-' + month + '-' + date + '_' + hour + ':' + minutes + ':00_JST';

  return sinceDateTime;
}

function sendSlack(url, message) {
  const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(message)
    };
  UrlFetchApp.fetch(url, options);
}

function searchTweetsApps() {
  const bearerAuthHeader =  getBearerAuthHeader();
  const sinceDateTime = getSinceDatetime(beforeMinutes);
  
  // Twitter検索結果取得
  // リツイートを除外する
  const searchKeyword = keywords + ' -rt';
  const resultType = 'recent';
  const lang = 'ja';
  const count = 10;
  const searchResponse = UrlFetchApp.fetch(
    'https://api.twitter.com/1.1/search/tweets.json?q=' + searchKeyword + '&result_type=' + resultType + '&lang=' + lang + '&count=' + count + '&since=' + sinceDateTime,
    { 'headers': bearerAuthHeader }
  );
  const result = JSON.parse(searchResponse);

  const numberOfTweets = Object.keys(result['statuses']).length;

  if (numberOfTweets >= threshold) {
    const message = {'text': keywords + 'のツイートが' + beforeMinutes +  '分間で' + numberOfTweets +  '件投稿されています'};
    sendSlack(slackWebhookUrl, message);
  }
}
