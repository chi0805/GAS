/**
 * SpreadSheet
 */
class SpreadSheet {
  constructor() {
    const spreadsheetId = ScriptProperties.getProperty('spreadsheetId');
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheetName = '担当者'
    this.sheet = spreadsheet.getSheetByName(sheetName); 
  }

  getStaffs(date) {
    let lastRow1 = this.getLastLow(this.sheet);
    let range = this.sheet.getRange('A2:A' + lastRow1);
    let cel = range.getValues();
    let dateList = cel.flat().map(function(e) {
      return String(e);
    });
    let index = dateList.indexOf(date);
  
    let staffs = this.sheet.getRange(index + 2, 2, 1, 2).getValues().flat();
    staffs = staffs.map(function(staff_name) {
      return staff_name + 'さん';
    }); 

    return staffs;
  }

  getLastLow(sheet) {
    return sheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
  }

}
