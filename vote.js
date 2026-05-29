const pole = document.getElementById("votePole");

let votes = JSON.parse(localStorage.getItem("votes"));

if (!votes) {
  votes = Array.from({ length: 15 }, () => ({
    like: Math.floor(Math.random() * 11) - 5,
    freq: Math.floor(Math.random() * 6)
  }));
  localStorage.setItem("votes", JSON.stringify(votes));
}

function plotDot(vote, isMine = false) {
  const dot = document.createElement("div");
  dot.className = isMine ? "dot my-dot" : "dot";

  const xPercent = ((vote.like + 5) / 10) * 100;
  const yPercent = 100 - (vote.freq / 5) * 100;

  dot.style.left = `${xPercent}%`;
  dot.style.top = `${yPercent}%`;

  pole.appendChild(dot);
}

votes.forEach(vote => plotDot(vote));

pole.addEventListener("click", event => {
  const rect = pole.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const like = Math.round((x / rect.width) * 10 - 5);
  const freq = Math.round((1 - y / rect.height) * 5);

  const myVote = {
    like: Math.max(-5, Math.min(5, like)),
    freq: Math.max(0, Math.min(5, freq))
  };

  const oldMyDot = document.querySelector(".my-dot");
  if (oldMyDot) oldMyDot.remove();

  localStorage.setItem("myVote", JSON.stringify(myVote));
  plotDot(myVote, true);
});