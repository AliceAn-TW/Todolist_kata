const headers = require("./config");
const todos = require("./database");

//專門處理 成功讀取資料 用的模組
function successHandle(response) {
  response.writeHead(200, headers);
  response.write(
    JSON.stringify({
      status: "success",
      data: todos,
    }),
  );
  response.end();
}

function successOptions(response) {
  response.writeHead(200, headers);
  response.end();
}

module.exports = { successHandle, successOptions };
