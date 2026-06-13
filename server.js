//1. 使用node.js 內建的模組
const http = require("http");
//2. 使用外部npm套件 uuid
const { v4: uuidv4 } = require("uuid");
//3. 自製一個處理資料的套件
const headers = require("./config");
const todos = require("./database");
const errorHandle = require("./errorHandle");
const successHandle = require("./successHandle");

const requestListener = (request, response) => {
  //   console.log(request.url);
  //   console.log(request.method);

  let body = "";
  //等待 req.body 接收成功，透過 on('end) 觸發

  request.on("data", (chunk) => {
    body += chunk;
  });

  // 設定首頁路徑
  //GET 取得代辦事項
  if (request.url == "/todos" && request.method == "GET") {
    successHandle(response);
  }
  //POST 新增代辦事項
  else if (request.url == "/todos" && request.method == "POST") {
    request.on("end", () => {
      //除錯1：try catch 確認req.body是否為JSON格式 ，格式錯誤則不寫入代辦清單
      try {
        const title = JSON.parse(body).title;
        //body 是字串格式，所以要型別轉換成 "物件" 格式
        // console.log(title);

        // 除錯2：確認物件是否有 title 屬性
        if (title !== undefined) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          // console.log(todo); //小步測試
          todos.push(todo);
          successHandle(response);
        } else {
          errorHandle(response);
        }
      } catch (error) {
        errorHandle(response);
      }
    });
  }
  //DELETE 刪除所有代辦
  else if (request.url == "/todos" && request.method == "DELETE") {
    todos.length = 0;
    successHandle(response);
  }
  //DELETE 刪除單一代辦
  else if (request.url.startsWith("/todos/") && request.method == "DELETE") {
    //取得 uuid
    const id = request.url.split("/").pop();
    //找到元素的索引值
    const index = todos.findIndex((Element) => Element.id === id);
    // console.log(id, index); //小步測試
    //判斷是否刪除資料
    if (index !== -1) {
      todos.splice(index, 1);
      successHandle(response);
    } else {
      errorHandle(response);
    }
  }
  //PATCH 編輯單一代辦
  else if (request.url.startsWith("/todos/") && request.method == "PATCH") {
    //等待 req.body 接收成功，透過 on('end')觸發
    request.on("end", () => {
      try {
        const todo = JSON.parse(body).title;
        const id = request.url.split("/").pop();
        const index = todos.findIndex((Element) => Element.id === id);
        // console.log(todo, id); //小步測試
        //判斷是否有 title 屬性
        if (todo !== undefined && index !== -1) {
          //修改 title
          todos[index].title = todo;
          //修改好後回傳 todos
          successHandle(response);
        } else {
          errorHandle(response);
        }
      } catch (error) {
        errorHandle(response);
      }
    });
  }
  //OPTIONS 支援跨網域
  else if (request.method == "OPTIONS") {
    successHandle(response);
    // response.writeHead(200, headers);
    // response.end();
  }
  //4XX 發生錯誤
  else {
    response.writeHead(404, headers);
    response.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      }),
    );
    response.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
