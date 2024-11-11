let bots = [];
let botCounter = 0;
let battleInterval;

function createBotConfig() {
  botCounter++;
  const botConfigDiv = document.createElement('div');
  botConfigDiv.id = `bot${botCounter}`;
  botConfigDiv.classList.add('bot-config');

  const botNameInput = document.createElement('input');
  botNameInput.type = 'text';
  botNameInput.placeholder = `Bot ${botCounter} Name`;

  const botValueSelect = document.createElement('select');
  botValueSelect.innerHTML = `<option value="0">0</option><option value="1">1</option>`;

  const botOperationSelect = document.createElement('select');
  botOperationSelect.innerHTML = `
    <option value="AND">AND</option>
    <option value="OR">OR</option>
    <option value="XOR">XOR</option>
    <option value="NOT">NOT</option>
  `;

  const botSpeedInput = document.createElement('input');
  botSpeedInput.type = 'range';
  botSpeedInput.min = 1;
  botSpeedInput.max = 10;
  botSpeedInput.value = 5;

  botConfigDiv.appendChild(botNameInput);
  botConfigDiv.appendChild(botValueSelect);
  botConfigDiv.appendChild(botOperationSelect);
  botConfigDiv.appendChild(botSpeedInput);

  document.getElementById('bot-configs').appendChild(botConfigDiv);
}

function createBotFromInput(botName, botValue, botOperation, botSpeed) {
  const bot = {
    name: botName,
    value: parseInt(botValue),
    operation: botOperation,
    speed: parseInt(botSpeed),
    wins: 0,  
    losses: 0,  
    x: Math.floor(Math.random() * 5),  
    y: Math.floor(Math.random() * 5),  
  };
  bots.push(bot);
  renderBot(bot);
}

function renderBot(bot) {
  const arena = document.getElementById('arena');
  const botElement = document.createElement('div');
  botElement.classList.add('bot');
  botElement.style.top = `${bot.y * 60}px`;  
  botElement.style.left = `${bot.x * 60}px`;  
  botElement.textContent = bot.name;
  arena.appendChild(botElement);
}

function startBattle() {
  bots.length = 0;
  const botConfigDivs = document.querySelectorAll('.bot-config');
  
  botConfigDivs.forEach(botConfigDiv => {
    const botName = botConfigDiv.querySelector('input').value;
    const botValue = botConfigDiv.querySelector('select:nth-child(2)').value;
    const botOperation = botConfigDiv.querySelector('select:nth-child(3)').value;
    const botSpeed = botConfigDiv.querySelector('input[type="range"]').value;
    
    createBotFromInput(botName, botValue, botOperation, botSpeed);
  });

  battleInterval = setInterval(() => {
    if (bots.length <= 1) {
      clearInterval(battleInterval);
      if (bots.length === 1) {
        // Stop the battle if only one bot is left, but let it move
        moveBots();
        renderArena();
        updateLeaderboard();
      }
      return;
    }
    moveBots();
    checkCollision();
  }, 1000);
}

function moveBots() {
  bots.forEach(bot => {
    const direction = Math.floor(Math.random() * 4);
    if (direction === 0 && bot.x < 4) bot.x++; 
    if (direction === 1 && bot.x > 0) bot.x--;  
    if (direction === 2 && bot.y < 4) bot.y++;  
    if (direction === 3 && bot.y > 0) bot.y--;  
  });
  renderArena();
}

function renderArena() {
  const arena = document.getElementById('arena');
  arena.innerHTML = '';  
  bots.forEach(bot => renderBot(bot));  
}

function checkCollision() {
  for (let i = 0; i < bots.length; i++) {
    for (let j = i + 1; j < bots.length; j++) {
      if (bots[i].x === bots[j].x && bots[i].y === bots[j].y) {
        let bot1Result = applyBooleanOperation(bots[i]);
        let bot2Result = applyBooleanOperation(bots[j]);

        if (bot1Result > bot2Result) {
          bots[i].wins++;
          bots[j].losses++;
          removeBot(bots[j]);
          displayBattleResults(bots[i], bots[j]);
        } else if (bot1Result < bot2Result) {
          bots[j].wins++;
          bots[i].losses++;
          removeBot(bots[i]);
          displayBattleResults(bots[j], bots[i]);
        } else {
          displayBattleResultsTie(bots[i], bots[j]);
        }

        updateLeaderboard();
        return;  // End the loop after the battle
      }
    }
  }
}

function applyBooleanOperation(bot) {
  let result;
  switch (bot.operation) {
    case 'AND':
      result = bot.value & 1;
      break;
    case 'OR':
      result = bot.value | 1;
      break;
    case 'XOR':
      result = bot.value ^ 1;
      break;
    case 'NOT':
      result = ~bot.value;
      break;
    default:
      result = 0;
  }
  return result;
}

function removeBot(botToRemove) {
  const arena = document.getElementById('arena');
  const botElements = arena.getElementsByClassName('bot');
  for (let i = 0; i < botElements.length; i++) {
    if (botElements[i].textContent === botToRemove.name) {
      arena.removeChild(botElements[i]);
      break;
    }
  }
  bots.splice(bots.indexOf(botToRemove), 1);
}

function displayBattleResults(winner, loser) {
  alert(`${winner.name} wins! ${loser.name} loses.`);
}

function displayBattleResultsTie(bot1, bot2) {
  alert(`${bot1.name} and ${bot2.name} tied!`);
}

function updateLeaderboard() {
  const leaderboard = document.getElementById('leaderboard');
  leaderboard.innerHTML = '';
  bots.forEach(bot => {
    const botDiv = document.createElement('div');
    botDiv.textContent = `${bot.name}: Wins - ${bot.wins}, Losses - ${bot.losses}`;
    leaderboard.appendChild(botDiv);
  });
}

document.getElementById('addBotBtn').addEventListener('click', createBotConfig);
document.getElementById('battleBtn').addEventListener('click', startBattle);
