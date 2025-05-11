const clickSound = document.getElementById("clickSound");
const bonusSound = document.getElementById("bonusSound");

let clicks = 0;
let clickPower = 1;

let autoClickers = [];
let autoClickerCost = 50;
let autoClickerBoost = 1;

let manualClicksThisSecond = 0;
let lastManualCPS = 0;

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
    const power = Math.pow(2, autoClickers.length); // 2, 4, 8, 16...
    autoClickers.push(power);
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
  } else {
    showFloatingMessage("Not enough clicks!");
  }
}

function upgradeAutoClicker() {
  const cost = 200;
  if (clicks >= cost) {
    clicks -= cost;
    autoClickerBoost++;
    updateDisplay();
  } else {
    showFloatingMessage("Not enough clicks!");
  }
}

function getClickRate() {
  return autoClickers.reduce((sum, power) => sum + power * autoClickerBoost, 0);
}

function updateDisplay() {
  document.getElementById("click-count").textContent = `Clicks: ${clicks}`;
  document.getElementById("autoClickerCount").textContent = autoClickers.length;
  document.getElementById("clickerCost").textContent = autoClickerCost;
}

function updateCPSDisplay() {
  const autoCPS = getClickRate();
  const manualCPS = lastManualCPS;
  const total = autoCPS + manualCPS;

  document.getElementById("cpsDisplay").textContent =
    `Auto CPS: ${autoCPS} | Manual CPS: ${manualCPS} | Total: ${total}`;
}

setInterval(() => {
  clicks += getClickRate();
  updateDisplay();
}, 1000);

setInterval(() => {
  lastManualCPS = manualClicksThisSecond;
  manualClicksThisSecond = 0;
  updateCPSDisplay();
}, 1000);

function showFloatingMessage(text) {
  const message = document.createElement("div");
  message.className = "floating-message";
  message.textContent = text;
  document.getElementById("floating-messages").appendChild(message);
  setTimeout(() => message.remove(), 1000);
}
