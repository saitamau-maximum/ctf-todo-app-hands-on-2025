const fetchButton = document.getElementById("fetch");
const output = document.getElementById("output");

// ボタンがクリックされたときの処理
fetchButton.addEventListener("click", async () => {
  // サーバーにリクエストを送信する
  const response = await fetch("http://localhost:8000");
  // レスポンスの内容を取得する
  console.log(response);
  // レスポンスの内容をテキストとして取得する
  const data = await response.text();
  // レスポンスの内容を出力する
  output.innerHTML = data;
});
