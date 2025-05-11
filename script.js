let clicks = 0;
let clickPower = 1;

let autoClickerCount = 0;
let autoClickerCPS = 0;
let autoClickerCost = 50;
let autoClickerBoost = 1;

let manualClicksThisSecond = 0;
let lastManualCPS = 0;

// Sound elements
const clickSound = document.getElementById("clickSound");
const bonusSound = document.getElementById("bonusSound");

function handleClick() {
  clicks += clickPower;
  manualClicksThisSecond += clickPower;
  updateDisplay();
  showFloatingMessage(`+${clickPower}`);
  clickSound.currentTime = 0;
  clickSound.play();
}

function buyAutoClicker() {
  if (clicks >= autoClickerCost) {
    clicks -= autoClickerCost;
    autoClickerCount++;
    autoClickerCPS = Math.pow(2, autoClickerCount) * autoClickerBoost;
    autoClickerCost = Math.floor(autoClickerCost * 1.5);
    updateDisplay();
    bonusSound.currentTime = 0;
    bonusSound.play();
  } else {
    showFloatingMessage("Not enough clicks!");
  }
}

function upgradeClick() {
  const cost = 100;
  if (clicks >= cost) {
    clicks -= cost;
    clickPower++;
    updateDisplay();
    bonusSound.currentTime = 0;
    bonusSound.play();
  } else {
    showFloatingMessage("Not enough clicks!");
  }
}

function upgradeAutoClicker() {
  const cost = 200;
  if (clicks >= cost) {
    clicks -= cost;
    autoClickerBoost++;
    autoClickerCPS = Math.pow(2, autoClickerCount) * autoClickerBoost;
    updateDisplay();
    bonusSound.currentTime = 0;
    bonusSound.play();
  } else {
    showFloatingMessage("Not enough clicks!");
  }
}

function updateDisplay() {
  document.getElementById("click-count").textContent = `Clicks: ${clicks}`;
  document.getElementById("autoClickerCount").textContent = autoClickerCount;
  document.getElementById("clickerCost").textContent = autoClickerCost;
  document.getElementById("cpsDisplay").textContent =
    `Auto CPS: ${autoClickerCPS} | Manual CPS: ${lastManualCPS} | Total: ${autoClickerCPS + lastManualCPS}`;
}

function showFloatingMessage(text) {
  const message = document.createElement("div");
  message.className = "floating-message";
  message.textContent = text;
  document.getElementById("floating-messages").appendChild(message);
  setTimeout(() => message.remove(), 1000);
}

// Apply auto-clicker every second
setInterval(() => {
  if (autoClickerCPS > 0) {
    clicks += autoClickerCPS;
    updateDisplay();
  }
}, 1000);

// Track manual CPS every second
setInterval(() => {
  lastManualCPS = manualClicksThisSecond;
  manualClicksThisSecond = 0;
  updateDisplay();
}, 1000);
