function annualReportPDFConversion() {
  const todayYMD = getFormattedDate_();
  const targetIdList = [
    [
      PropertiesService.getScriptProperties().getProperty('isf11'),
      'ISF11 情報システムミーティング議事録.pdf',
    ],
    [
      PropertiesService.getScriptProperties().getProperty('isf21'),
      'ISF21 打合せ議事録.pdf',
    ],
    [
      PropertiesService.getScriptProperties().getProperty('isf23_2'),
      'ISF23-2 管理台帳（PC管理）.pdf',
    ],
    [
      PropertiesService.getScriptProperties().getProperty('isf23_3'),
      `ISF23-3 管理台帳（アクセス権）${todayYMD}.pdf`,
    ],
    [
      PropertiesService.getScriptProperties().getProperty('isf23_4'),
      `ISF23-4 管理台帳（Googleアカウント）${todayYMD}.pdf`,
    ],
    [
      PropertiesService.getScriptProperties().getProperty('isf27_7'),
      `ISF27-7 Validation System Inventory.pdf`,
    ],
    [
      PropertiesService.getScriptProperties().getProperty('isf28'),
      `ISF28 入退室管理台帳 自社用.pdf`,
    ],
    [
      PropertiesService.getScriptProperties().getProperty(
        'googleAccountManagementWorkflow'
      ),
      `管理台帳（Googleアカウント管理業務フロー）${todayYMD}.pdf`,
    ],
  ];
  const deleteTargetFileNameList = targetIdList.map(([_, fileName]) =>
    fileName.replace('.pdf', '').replace(/\d{8}$/, '')
  );
  const folder = DriveApp.getFolderById(
    PropertiesService.getScriptProperties().getProperty('targetFolderId')
  );
  deleteTargetFileNameList.forEach(fileName =>
    deleteFilesInFolderWithPrefix_(folder, fileName)
  );
  const convertDocToPdf = new ConvertDocToPdf();
  const convertSpreadSheetToPdf = new ConvertSpreadsheetToPdf();
  targetIdList.forEach(([targetId, fileName]) => {
    const mimeType = checkFileType_(targetId);
    if (
      targetId ===
        PropertiesService.getScriptProperties().getProperty('isf23_2') ||
      targetId ===
        PropertiesService.getScriptProperties().getProperty('isf23_3') ||
      targetId ===
        PropertiesService.getScriptProperties().getProperty('isf23_4')
    ) {
      const parameters = new Map([
        ['printtitle', 'true'],
        ['gridlines', 'true'],
      ]);
      const options = generateOptionsString_(parameters);
      convertSpreadSheetToPdf.exportSpreadsheetToPDF_(
        targetId,
        fileName,
        options
      );
    } else if (
      targetId ===
      PropertiesService.getScriptProperties().getProperty('isf27_7')
    ) {
      const parameters = new Map([
        ['printtitle', 'true'],
        ['gid', '0'],
        ['portrait', 'false'],
      ]);
      const options = generateOptionsString_(parameters);
      convertSpreadSheetToPdf.exportSpreadsheetToPDF_(
        targetId,
        fileName,
        options
      );
    } else if (
      targetId === PropertiesService.getScriptProperties().getProperty('isf28')
    ) {
      const parameters = new Map([['gid', '173520210']]);
      const options = generateOptionsString_(parameters);
      convertSpreadSheetToPdf.exportSpreadsheetToPDF_(
        targetId,
        fileName,
        options
      );
    } else if (
      targetId ===
      PropertiesService.getScriptProperties().getProperty(
        'googleAccountManagementWorkflow'
      )
    ) {
      const parameters = new Map([
        ['sheetnames', 'true'],
        ['portrait', 'false'],
      ]);
      const options = generateOptionsString_(parameters);
      convertSpreadSheetToPdf.exportSpreadsheetToPDF_(
        targetId,
        fileName,
        options
      );
    } else if (mimeType === 'application/vnd.google-apps.document') {
      convertDocToPdf.createPdf(targetId, fileName);
    } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      convertSpreadSheetToPdf.createPdf(targetId, fileName);
    }
  });
}
