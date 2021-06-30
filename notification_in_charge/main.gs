function main() {
  const slack = new Slack();
  const spreadSheet = new SpreadSheet();
  var date = new Date(new Date().setHours(0, 0, 0, 0));
  date.setDate(date.getDate() + 1);
  tomorrow = String(date);

  let staffs = spreadSheet.getStaffs(tomorrow);
  let message = '<!channel>\n';
  if (!staffs) {
    message += '明日の担当者が設定されていません。';
    message += '設定お願いします';
    Logger.log('担当者が設定されていませんでした');
  } else {
    message += '明日の担当者は' + staffs.join('、') + 'です！\n';
    message += 'よろしくお願いします。';
  }
  slack.send(message);
  Logger.log('担当者の通知が完了しました');
}
