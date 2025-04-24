const fetchButton = document.getElementById("fetch");
const output = document.getElementById("output");

fetchButton.addEventListener("click", async () => {
  const response = await fetch("http://localhost:8000");
  console.log(response);
  const data = await response.text();
  output.innerHTML = data;
});
