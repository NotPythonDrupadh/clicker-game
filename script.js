let clicks = 0;
let autoClickers = [];
let autoClickerCost = 50;
let clickBoost = 1;
let autoClickerBoost = 1;
let clickQueue = 0;
let achievements = [];
let goldClicks = 0;
let prestigeCount = 0;
let upgradeProgress = 0;
let upgradeGoal = 100; // Goal to progress to next upgrade
let autoClickerPower = 2; // Start at 2 clicks/sec per auto-clicker
let soundsEnabled = true;
let lastUpdateTime = Date.now();
let totalClicksPerSecond = 0;

// Save/load progress
if(localStorage.getItem('clicks')) {
  clicks = parseInt(localStorage.getItem('clicks'));
  autoClickers = JSON.parse(localStorage.getItem('autoClickers'));
  autoClickerCost = parseInt(localStorage.getItem('autoClickerCost'));
  clickBoost = parseInt(localStorage.getItem('clickBoost'));
  autoClickerBoost = parseInt(localStorage.getItem('autoClickerBoost'));
  goldClicks = parseInt(localStorage.getItem('goldClicks'));
  prestigeCount = parseInt(localStorage.getItem('prestigeCount'));
}

// Save progress to localStorage every second
setInterval(() => {
  localStorage.setItem('clicks', clicks);
  localStorage.setItem('autoClickers', JSON.stringify(autoClickers));
  localStorage.setItem('autoClickerCost', autoClickerCost);
  localStorage.setItem('clickBoost', clickBoost);
  localStorage.setItem('autoClickerBoost', autoClickerBoost);
  localStorage.setItem('goldClicks', goldClicks);
  localStorage.setItem('prestigeCount', prestigeCount);
}, 1000);

function updateDisplay() {
  document.getElementById('clicks').textContent = clicks;
  document.getElementById('autoClickers').textContent = autoClickers.length;
  document.getElementById('autoClickerCost').textContent = autoClickerCost;
  document.getElementById('cps').textContent = getClickRate();
  document.getElementById('goldClicks').textContent = 'Gold Clicks: ' + goldClicks;
  updateAchievements();
  document.getElementById('upgradeProgress').style.width = `${(upgradeProgress / upgradeGoal) * 100}%`;
}

// Show fancy messages
function showFloatingMessage(message) {
    const msg = document.getElementById("float-msg");
    msg.textContent = message;
    msg.style.display = "block";
    msg.style.opacity = 1;
  
    setTimeout(() => {
      msg.style.opacity = 0;
      setTimeout(() => {
        msg.style.display = "none";
      }, 500);
    }, 2000);
}

function handleClick() {
  clicks += clickBoost;
  if (soundsEnabled) {
    const clickSound = new Audio('click-sound.mp3');
    clickSound.play();
  }
  updateDisplay();
}

function buyAutoClicker() {
    if (clicks >= autoClickerCost) {
      clicks -= autoClickerCost;
  
      // Powers: 2, 4, 8, 16...
      const power = Math.pow(2, autoClickers.length); 
      autoClickers.push(power);
  
      autoClickerCost = Math.floor(autoClickerCost * 1.5);
      updateDisplay();
    } else {
      showFloatingMessage("Not enough clicks!");
    }
}
  
function buyClickBoost() {
  if (clicks >= 100) {
    clicks -= 100;
    clickBoost++;
    updateDisplay();
  } else {
    showFloatingMessage('NOT ENOUGH CLICKS!');
  }
}

function buyAutoClickerBoost() {
  if (clicks >= 200) {
    clicks -= 200;
    autoClickerBoost++;
    updateDisplay();
  } else {
    showFloatingMessage('NOT ENOUGH CLICKS!');
  }
}

function getClickRate() {
    return autoClickers.reduce((sum, power) => sum + power * autoClickerBoost, 0) + clickQueue;
}

function updateAchievements() {
  let achievementHtml = '';
  
  if (clicks >= 1000 && !achievements.includes('1000 clicks')) {
    achievements.push('1000 clicks');
    achievementHtml += `<span class="achievement">1000 Clicks!</span>`;
  }
  if (autoClickers.length >= 10 && !achievements.includes('10 auto-clickers')) {
    achievements.push('10 auto-clickers');
    achievementHtml += `<span class="achievement">10 Auto-Clickers!</span>`;
  }

  document.getElementById('achievements').innerHTML = achievementHtml;
}

function prestige() {
  clicks = 0;
  autoClickers = [];
  autoClickerCost = 50;
  clickBoost = 1;
  autoClickerBoost = 1;
  goldClicks += prestigeCount * 100;
  prestigeCount++;
  updateDisplay();
}

// Random events
setInterval(() => {
  if (Math.random() < 0.1) {
    clicks += 100; // Random bonus clicks
    if (soundsEnabled) {
      const bonusSound = new Audio('bonus-sound.mp3');
      bonusSound.play();
    }
    updateDisplay();
  }
}, 5000);

// Auto-clicker
setInterval(() => {
  clickQueue += getClickRate();
}, 1000);

// Update CPS every second
setInterval(() => {
  const currentTime = Date.now();
  const timeElapsed = (currentTime - lastUpdateTime) / 1000; // Time in seconds
  totalClicksPerSecond = clickQueue / timeElapsed;
  lastUpdateTime = currentTime;

  updateDisplay();
  clickQueue = 0;  // Reset click queue after updating CPS
}, 1000);

updateDisplay();

window.addEventListener("beforeunload", () => {
    localStorage.clear();
});
