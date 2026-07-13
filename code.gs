const SHEET_NAME = 'User';

// Handles GET requests to fetch all users
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet 'User' not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const rows = data.slice(1);
  const users = rows.map(row => {
    return {
      FullName: row[0] || '',
      UserId: row[1] || '',
      Password: row[2] || '',
      Modules: row[3] || '',
      Role: row[4] || '',
      Designation: row[5] || ''
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify(users))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handles POST requests to update users
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet 'User' not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    
    // Allow CORS preflight if needed
    if (action === 'updateAll') {
      const users = payload.users;
      
      // Clear existing data (keeping headers in row 1)
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 6).clearContent();
      }
      
      // Write new data
      if (users && users.length > 0) {
        const rows = users.map(user => [
          user.FullName,
          user.UserId,
          user.Password,
          user.Modules,
          user.Role,
          user.Designation
        ]);
        sheet.getRange(2, 1, rows.length, 6).setValues(rows);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid request action" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional utility to format headers manually from the script editor
function setupHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (sheet) {
    const headers = ["Full_Name", "User Id", "Password", "Modules", "Role", "designation"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
}
