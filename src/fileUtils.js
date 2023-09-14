function checkFileType_(fileId) {
  const file = DriveApp.getFileById(fileId);
  const mimeType = file.getMimeType();
  return mimeType;
}
function getFormattedDate_() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1 and zero-pad to two digits
  const day = String(today.getDate()).padStart(2, '0'); // Zero-pad the day to two digits

  const formattedDate = `${year}${month}${day}`;
  return formattedDate;
}
class ConvertToPdf {
  constructor() {
    this.folder = DriveApp.getFolderById(
      PropertiesService.getScriptProperties().getProperty('targetFolderId')
    );
  }
  getFile(fileId) {
    return fileId;
  }
  createPdf(fileId, newFileName) {
    const file = this.getFile(fileId);
    if (file === fileId) {
      return;
    }
    this.folder.createFile(file.getAs('application/pdf')).setName(newFileName);
  }
}
class ConvertDocToPdf extends ConvertToPdf {
  getFile(fileId) {
    return DocumentApp.openById(fileId);
  }
}
class ConvertSpreadsheetToPdf extends ConvertToPdf {
  getFile(fileId) {
    return SpreadsheetApp.openById(fileId);
  }
  exportSpreadsheetToPDF_(fileId, newFileName, options) {
    // Open the spreadsheet
    const baseUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?id=${fileId}`;
    const url = baseUrl + options;
    const token = ScriptApp.getOAuthToken();
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const blob = UrlFetchApp.fetch(url, fetchOptions)
      .getBlob()
      .setName(newFileName);
    this.folder.createFile(blob);
  }
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
