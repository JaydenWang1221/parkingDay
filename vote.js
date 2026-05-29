const pole = document.getElementById("votePole");
const submitButton = document.getElementById("submitVote");

const params = new URLSearchParams(window.location.search);
const keepSameVotes = params.get("keep") === "1";

let votes;
let userVotes;

if (keepSameVotes && localStorage.getItem("votes")) {
  votes = JSON.parse(localStorage.getItem("votes"));
  userVotes = JSON.parse(localStorage.getItem("userVotes")) || [];
} else {
  let avgLike;

  do {
    votes = Array.from({ length: 15 }, () => ({
      like: Math.floor(Math.random() * 11) - 5,
      freq: Math.floor(Math.random() * 6)
    }));

    avgLike = votes.reduce((sum, v) => sum + v.like, 0) / votes.length;
  } while (avgLike <= 2);

  userVotes = [];

  localStorage.setItem("votes", JSON.stringify(votes));
  localStorage.setItem("userVotes", JSON.stringify(userVotes));
}

let tempVote = null;

function getDotLevel(count) {
  if (count === 1) return "dot-level-1";
  if (count === 2) return "dot-level-2";
  if (count === 3) return "dot-level-3";
  if (count === 4) return "dot-level-4";
  return "dot-level-5";
}

function renderDots() {
  document.querySelectorAll(".dot").forEach(dot => dot.remove());

  const allVotes = [...votes, ...userVotes];
  const pointCount = {};

  allVotes.forEach(vote => {
    const key = `${vote.like},${vote.freq}`;
    pointCount[key] = (pointCount[key] || 0) + 1;
  });

  Object.entries(pointCount).forEach(([key, count]) => {
    const [like, freq] = key.split(",").map(Number);

    const dot = document.createElement("div");
    dot.className = `dot ${getDotLevel(count)}`;
    dot.textContent = count > 1 ? count : "";

    dot.style.left = `${((like + 5) / 10) * 100}%`;
    dot.style.top = `${100 - (freq / 5) * 100}%`;

    pole.appendChild(dot);
  });
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
renderDots();

pole.addEventListener("click", event => {
  const rect = pole.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  tempVote = {
    like: Math.max(-5, Math.min(5, Math.round((x / rect.width) * 10 - 5))),
    freq: Math.max(0, Math.min(5, Math.round((1 - y / rect.height) * 5)))
  };

  document.querySelectorAll(".preview-dot").forEach(dot => dot.remove());

  const preview = document.createElement("div");
  preview.className = "dot preview-dot";
  preview.style.left = `${((tempVote.like + 5) / 10) * 100}%`;
  preview.style.top = `${100 - (tempVote.freq / 5) * 100}%`;

  pole.appendChild(preview);
});

submitButton.addEventListener("click", () => {
  if (!tempVote) {
    alert("請先在圖上點選你的投票位置！");
    return;
  }

  userVotes.push(tempVote);
  localStorage.setItem("userVotes", JSON.stringify(userVotes));

  tempVote = null;
  renderDots();

  alert("投票成功！");
});