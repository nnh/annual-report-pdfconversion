function exportSpreadsheetToPDF() {
  const pdfFileNamePrefix = '管理台帳（Googleアカウント管理業務フロー）';
  const pdfFileName = `${pdfFileNamePrefix}${getFormattedDate_()}.pdf`;
  // Open the spreadsheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheetId = spreadsheet.getId();
  const baseUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?id=${spreadsheetId}`;
  const options =
    '&exportFormat=pdf&format=pdf' +
    '&size=A4' + // Paper size (A4)
    '&portrait=false' + // Paper orientation (true: Portrait / false: Landscape)
    '&scale=2' +
    '&top_margin=0.50' + // Top margin
    '&right_margin=0.50' + // Right margin
    '&bottom_margin=0.50' + // Bottom margin
    '&left_margin=0.50' + // Left margin
    '&horizontal_alignment=CENTER' + // Horizontal alignment
    '&vertical_alignment=TOP' + // Vertical alignment
    '&printtitle=false' + // Show sheet name
    '&sheetnames=true' + // Show sheet names
    '&gridlines=false' + // Show gridlines
    '&fzr=true' + // Show frozen rows
    '&fzc=true'; // Show frozen columns
  const url = baseUrl + options;
  const token = ScriptApp.getOAuthToken();
  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const blob = UrlFetchApp.fetch(url, fetchOptions)
    .getBlob()
    .setName(pdfFileName);
  // Save to download folder
  const downloadFolder = DriveApp.getFolderById(
    PropertiesService.getScriptProperties().getProperty('outputFolderId')
  ); // Specify the download folder ID
  deleteFilesInFolderWithPrefix_(downloadFolder, pdfFileNamePrefix);
  downloadFolder.createFile(blob);
}

function getFormattedDate_() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1 and zero-pad to two digits
  const day = String(today.getDate()).padStart(2, '0'); // Zero-pad the day to two digits

  const formattedDate = `${year}${month}${day}`;
  return formattedDate;
}

function deleteFilesInFolderWithPrefix_(folder, prefix) {
  const files = folder.getFiles();
  // Delete files with names starting with the specified prefix
  while (files.hasNext()) {
    const file = files.next();
    const fileName = file.getName();
    if (fileName.startsWith(prefix)) {
      // If the file name starts with the specified prefix, delete the file
      file.setTrashed(true);
    }
  }
}
