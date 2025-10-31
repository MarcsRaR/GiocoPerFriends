async function startGame() {
  document.getElementById("screen-start").style.display = "none";
  level1();
}

async function level1() {
  const res = await fetch("/level1");
  const data = await res.json();
  document.getElementById("content").innerHTML = `
    <h2>Livello 1</h2>
    <p>${data.question}</p>
    <input id="ans" placeholder="Risposta...">
    <button onclick="checkLevel1()">Invia</button>
    <p id="msg"></p>
  `;
}

async function checkLevel1() {
  const ans = document.getElementById("ans").value;
  const res = await fetch("/check_level1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer: ans })
  });
  const data = await res.json();
  if (data.correct) {
    document.getElementById("msg").innerHTML = "Corretto! Livello 2...";
    setTimeout(level2, 1500);
  } else {
    document.getElementById("msg").innerHTML = "<span style='color:red'>HELL NAH</span>";
    setTimeout(() => location.reload(), 2000);
  }
}

function level2() {
  const animals = ["cavallo", "mucca", "elefante", "criceto"];
  animals.sort(() => Math.random() - 0.5);
  let html = "<h2>La parola d'ordine</h2>";
  animals.forEach(a => {
    html += `<div><img src="/static/${a}.jpg" height="120"><br><input class="pw" placeholder="..."></div>`;
  });
  html += `<button onclick="checkLevel2()">Invia</button><p id='msg2'></p>`;
  document.getElementById("content").innerHTML = html;
}

function checkLevel2() {
  const inputs = [...document.querySelectorAll(".pw")];
  if (inputs.every(i => i.value.toLowerCase() === "goofy")) {
    document.getElementById("msg2").innerText = "Bravo! Ora sudoku!";
    setTimeout(level3, 1500);
  } else {
    document.getElementById("msg2").innerText = "HELL NAH";
  }
}

function level3() {
  document.getElementById("content").innerHTML = `
    <h2>Livello 3 - Sudoku</h2>
    <iframe src="https://sudoku.com" width="400" height="400"></iframe>
    <br><button onclick="level4()">Ho finito!</button>
  `;
}

function level4() {
  document.getElementById("content").innerHTML = `
    <h2>Livello 4 - Snake</h2>
    <canvas id="snake" width="400" height="400" style="background:black"></canvas>
  `;
  startSnake();
}

function startSnake() {
  const canvas = document.getElementById("snake");
  const ctx = canvas.getContext("2d");
  let snake = [{x:10,y:10}];
  let dir = "right";
  let apple = {x:15,y:15};
  let score = 0;

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && dir !== "down") dir="up";
    if (e.key === "ArrowDown" && dir !== "up") dir="down";
    if (e.key === "ArrowLeft" && dir !== "right") dir="left";
    if (e.key === "ArrowRight" && dir !== "left") dir="right";
  });

  const interval = setInterval(() => {
    const head = {...snake[0]};
    if (dir === "up") head.y--;
    if (dir === "down") head.y++;
    if (dir === "left") head.x--;
    if (dir === "right") head.x++;

    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
      score++;
      apple = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
      if (score === 4) {
        clearInterval(interval);
        endGame();
      }
    } else {
      snake.pop();
    }

    ctx.clearRect(0,0,400,400);
    ctx.fillStyle = "lime";
    snake.forEach(p => ctx.fillRect(p.x*20, p.y*20, 18, 18));
    ctx.fillStyle = "red";
    ctx.fillRect(apple.x*20, apple.y*20, 18, 18);
  }, 100);
}

async function endGame() {
  const res = await fetch("/end");
  const data = await res.json();
  document.getElementById("content").innerHTML = `<h1>${data.message}</h1>`;
}
