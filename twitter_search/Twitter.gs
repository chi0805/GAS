/**
 * Twitter
 */
class Twitter
{
  constructor() {
    const prop = PropertiesService.getScriptProperties().getProperties();
    this.apiKey = prop.apiKey;
    this.apiSecret = prop.apiSecret;
  }

   getBearerAuthHeader() {
    const blob = Utilities.newBlob(this.apiKey + ':' + this.apiSecret);
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

  getSinceDatetime(beforeMinutes) {
    const now = new Date();
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

  searchKeyword(beforeMinutes, keyword) {
    const bearerAuthHeader =  this.getBearerAuthHeader();
    const sinceDateTime = this.getSinceDatetime(beforeMinutes);
  
    // Twitter検索結果取得
    const searchKeyword = keyword;
    const resultType = 'recent';
    const lang = 'ja';
    const count = 20;
    const params = 'q=' + searchKeyword + ' since:' + sinceDateTime + '&result_type=' + resultType + '&lang=' + lang + '&count=' + count;
    const url = 'https://api.twitter.com/1.1/search/tweets.json?' + params;
    const searchResponse = UrlFetchApp.fetch(
      url,
      { 'headers': bearerAuthHeader }
    );
    const result = JSON.parse(searchResponse);
    const numberOfTweets = Object.keys(result['statuses']).length;

    return {params: params, numberOfTweets: numberOfTweets};
  }
}

