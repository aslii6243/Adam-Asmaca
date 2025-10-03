// Kelime havuzları
const wordPools = {
  hayvanlar: ["KEDİ", "KÖPEK", "ASLAN", "KAPLAN", "ZEBRA", "PANDA", "FİL", "KUŞ","ZÜRAFA","KURT","FLAMİNGO","TAVUK","KAPLUMBAĞA"],
  ulkeler: ["TÜRKİYE", "ALMANYA", "FRANSA", "İTALYA", "MISIR", "JAPONYA", "İSPANYA","KOLOMBİA","RUSYA","HİNDİSTAN","ÖZBEKİSTAN"],
  programlama: ["PYTHON", "JAVASCRIPT", "JAVA", "CPLUSPLUS", "HTML", "CSS", "ALGORITMA","MYSQL","PHP","KOTLİN"],
  çiçek:["MENEKŞE","PAPATYA","SÜMBÜL","GÜL","LEYLAK","ZAMBAK","ORKİDE","KILIÇ","KASIMPATI","KARANFİL","ŞAKAYIK"]
};

let selectedWord = "";
let guessed = [];
let wrong = 0;
const maxWrong = 6;

// Elementler
const wordEl = document.getElementById("word");
const messageEl = document.getElementById("message");
const livesEl = document.getElementById("lives");
const keyboardEl = document.getElementById("keyboard");

// Başlangıç ekranı
document.getElementById("startBtn").addEventListener("click", () => {
  const topic = document.getElementById("topic").value;
  const length = document.getElementById("length").value;
  startGame(topic, length);
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
});

// Oyunu başlat
function startGame(topic, length) {
  const pool = wordPools[topic];
  let filtered = pool;

  if (length === "short") {
    filtered = pool.filter(w => w.length <= 6);
  } else if (length === "medium") {
    filtered = pool.filter(w => w.length >= 7 && w.length <= 9);
  } else if (length === "long") {
    filtered = pool.filter(w => w.length >= 10);
  }

  // Eğer filtre boşsa tüm havuzu kullan
  if (filtered.length === 0) filtered = pool;

  selectedWord = filtered[Math.floor(Math.random() * filtered.length)];
  guessed = [];
  wrong = 0;
  livesEl.textContent = maxWrong;
  messageEl.textContent = "";
  drawWord();
  generateKeyboard();
  resetHangman();
}

// Kelimeyi çiz
function drawWord() {
  wordEl.innerHTML = selectedWord
    .split("")
    .map(
      (letter) =>
        `<div class="letter ${guessed.includes(letter) ? "" : "hidden"}">${
          guessed.includes(letter) ? letter : letter
        }</div>`
    )
    .join("");
}

// Klavye
function generateKeyboard() {
  keyboardEl.innerHTML = "";
  const letters = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
  letters.split("").forEach((letter) => {
    const btn = document.createElement("div");
    btn.classList.add("key");
    btn.textContent = letter;
    btn.addEventListener("click", () => handleGuess(letter, btn));
    keyboardEl.appendChild(btn);
  });
}

// Harf tahmini
function handleGuess(letter, btn) {
  btn.classList.add("disabled");
  btn.style.pointerEvents = "none";

  if (selectedWord.includes(letter)) {
    guessed.push(letter);
    drawWord();
    checkWin();
  } else {
    wrong++;
    livesEl.textContent = maxWrong - wrong;
    drawHangman(wrong);
    if (wrong === maxWrong) {
      messageEl.textContent = "Kaybettin! Kelime: " + selectedWord;
    }
  }
}

// Kazanma kontrolü
function checkWin() {
  const wordCompleted = selectedWord
    .split("")
    .every((letter) => guessed.includes(letter));
  if (wordCompleted) {
    messageEl.textContent = "Tebrikler! Kazandın 🎉";
    launchConfetti();
  }
}

// Konfeti efekti
function launchConfetti() {
  const duration = 5000; // 5 saniye boyunca konfeti yağacak
  const end = Date.now() + duration;

  function frame() {
    // Her frame’de birkaç konfeti üret
    for (let i = 0; i < 10; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      document.body.appendChild(confetti);

      // Rastgele konum
      confetti.style.left = Math.random() * window.innerWidth + "px";

      // Rastgele renk
      confetti.style.backgroundColor =
        "hsl(" + Math.random() * 360 + ",100%,50%)";

      // Rastgele boyut
      const size = Math.random() * 8 + 6; // 6–14px
      confetti.style.width = size + "px";
      confetti.style.height = size * 1.5 + "px";

      // Rastgele düşme süresi
      const fallDuration = Math.random() * 3 + 3; // 3–6 saniye
      confetti.style.animationDuration = fallDuration + "s";

      // Rastgele sağa-sola kayma + dönüş
      const xMove = Math.random() * 200 - 100;
      confetti.animate(
        [
          { transform: `translate(0,0) rotate(0deg)` },
          {
            transform: `translate(${xMove}px, 100vh) rotate(${Math.random() * 720}deg)`
          }
        ],
        {
          duration: fallDuration * 1000,
          iterations: 1,
          easing: "ease-out",
          fill: "forwards"
        }
      );

      // Belirli süre sonra kaldır
      setTimeout(() => {
        confetti.remove();
      }, fallDuration * 1000);
    }

    // Süre bitene kadar konfeti üretmeye devam et
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }

  frame();
}

// Adam figürünü sıfırla
function resetHangman() {
  ["head", "body", "armL", "armR", "legL", "legR"].forEach((id) => {
    document.getElementById(id).style.display = "none";
  });
}

// Adamı çiz
function drawHangman(step) {
  const parts = ["head", "body", "armL", "armR", "legL", "legR"];
  document.getElementById(parts[step - 1]).style.display = "block";
}


// Yeni oyun
document.getElementById("newBtn").addEventListener("click", () => {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
});
