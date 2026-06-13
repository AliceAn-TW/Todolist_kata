const headers = require("./config");

//專門處理錯誤用的模組
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

module.exports = errorHandle;
