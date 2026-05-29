const pole = document.getElementById("votePole");
const submitButton = document.getElementById("submitVote");

let votes = JSON.parse(localStorage.getItem("votes"));

if (!votes) {
  votes = Array.from({ length: 15 }, () => ({
    // Random 喜好程度: only 3, 4, 5
    like: Math.floor(Math.random() * 3) + 3,

    // Random 品嚐頻率: 0 to 5
    freq: Math.floor(Math.random() * 6)
  }));

  localStorage.setItem("votes", JSON.stringify(votes));
}

let tempVote = null;

function plotDot(vote, isMine = false) {
  const dot = document.createElement("div");
  dot.className = isMine ? "dot my-dot" : "dot";

  const xPercent = ((vote.like + 5) / 10) * 100;
  const yPercent = 100 - (vote.freq / 5) * 100;

  dot.style.left = `${xPercent}%`;
  dot.style.top = `${yPercent}%`;

  pole.appendChild(dot);
}

function addAxisNumbers() {
  for (let i = -5; i <= 5; i++) {
    const num = document.createElement("div");
    num.className = "axis-number x-number";
    num.textContent = i;
    num.style.left = `${((i + 5) / 10) * 100}%`;
    pole.appendChild(num);
  }

  for (let i = 0; i <= 5; i++) {
    const num = document.createElement("div");
    num.className = "axis-number y-number";
    num.textContent = i;
    num.style.bottom = `${(i / 5) * 100}%`;
    pole.appendChild(num);
  }
}

addAxisNumbers();
votes.forEach(vote => plotDot(vote));

pole.addEventListener("click", event => {
  const rect = pole.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const like = Math.round((x / rect.width) * 10 - 5);
  const freq = Math.round((1 - y / rect.height) * 5);

  tempVote = {
    like: Math.max(-5, Math.min(5, like)),
    freq: Math.max(0, Math.min(5, freq))
  };

  const oldMyDot = document.querySelector(".my-dot");
  if (oldMyDot) oldMyDot.remove();

  plotDot(tempVote, true);
});

submitButton.addEventListener("click", () => {
  if (!tempVote) {
    alert("請先在圖上點選你的投票位置！");
    return;
  }

  localStorage.setItem("myVote", JSON.stringify(tempVote));
  alert("投票成功！");
});
