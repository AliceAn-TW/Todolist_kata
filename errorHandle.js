const headers = require("./config");

//專門處理錯誤用的模組

// 輸入格式錯誤 或 查無此 todo id
function errorHandle(response) {
  response.writeHead(400, headers);
  response.write(
    JSON.stringify({
      status: "false",
      message: "欄位未填寫正確，或無此 todo id",
    }),
  );
  response.end();
}

// 輸入 URL 不正確
function errorUrl(response) {
  response.writeHead(404, headers);
  response.write(
    JSON.stringify({
      status: "false",
      message: "無此網站路由",
    }),
  );
  response.end();
}

module.exports = { errorHandle, errorUrl };
