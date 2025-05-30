// script.js

let draggedItem = null;
let originalParent = null;

function addDragListeners(item) {
  item.setAttribute('draggable', 'true');
  item.style.cursor = 'grab';

  item.addEventListener('dragstart', e => {
    draggedItem = item;
    originalParent = item.parentElement;
    setTimeout(() => (item.style.display = 'none'), 0);
  });

  item.addEventListener('dragend', e => {
    setTimeout(() => {
      item.style.display = 'block';
      draggedItem = null;
    }, 0);
  });
}

const draggables = document.querySelectorAll('.draggable');
draggables.forEach(item => addDragListeners(item));

const dropZones = document.querySelectorAll('.drop-zone, .drop-cell');
dropZones.forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
  });

  zone.addEventListener('dragenter', e => {
    e.preventDefault();
    zone.style.backgroundColor = '#2b3c58';
  });

  zone.addEventListener('dragleave', e => {
    zone.style.backgroundColor = '#162237';
  });

  zone.addEventListener('drop', e => {
    zone.style.backgroundColor = '#162237';

    if (draggedItem) {
      if (zone.children.length > 0) {
        const existingItem = zone.firstElementChild;
        originalParent.appendChild(existingItem);
        addDragListeners(existingItem);
      }
      zone.appendChild(draggedItem);
      addDragListeners(draggedItem);
    }
  });
});

const dragBanks = document.querySelectorAll('.drag-bank');
dragBanks.forEach(bank => {
  bank.addEventListener('dragover', e => {
    e.preventDefault();
  });

  bank.addEventListener('drop', e => {
    if (draggedItem) {
      bank.appendChild(draggedItem);
      addDragListeners(draggedItem);
    }
  });
});

function showSplashScreen(success) {
  const splash = document.createElement('div');
  splash.id = 'splash-screen';
  splash.innerHTML = success
    ? `
    <div class="splash-content">
      <h2>🎉 Congratulations!</h2>
      <p>The password is: <strong>inquiry</strong></p>
    </div>
  `
    : `
    <div class="splash-content">
      <h2>Incorrect</h2>
      <p>Try again.</p>
    </div>
  `;
  document.body.appendChild(splash);

  if (!success) {
    setTimeout(() => {
      splash.remove();
    }, 2000);
  }
}

function checkAnswers() {
  const expectedOrder = [
    "Fire.png", "Air.png", "Water.png", "Earth.png"
  ];
  const expectedMatrix = [
    ["dash.png", "Up.png", "Up.png", "Up.png"],
    ["Down.png", "dash.png", "Up.png", "Up.png"],
    ["Down.png", "Down.png", "dash.png", "Up.png"],
    ["Down.png", "Down.png", "Down.png", "dash.png"]
  ];

  const rows = document.querySelectorAll("#element-grid tbody tr");

  for (let i = 0; i < 4; i++) {
    const rowSymbol = rows[i].querySelector("th img");
    const expectedRowSymbol = expectedOrder[i];
    if (!rowSymbol || !rowSymbol.src.includes(expectedRowSymbol)) {
      showSplashScreen(false);
      return;
    }

    for (let j = 0; j < 4; j++) {
      const cell = rows[i].querySelectorAll("td")[j];
      const img = cell.querySelector("img");
      const expectedArrow = expectedMatrix[i][j];
      if (!img || !img.src.includes(expectedArrow)) {
        showSplashScreen(false);
        return;
      }
    }
  }

  const headerCells = document.querySelectorAll("#element-grid thead th");
  for (let k = 1; k <= 4; k++) {
    const img = headerCells[k].querySelector("img");
    const expectedColSymbol = expectedOrder[k - 1];
    if (!img || !img.src.includes(expectedColSymbol)) {
      showSplashScreen(false);
      return;
    }
  }

  showSplashScreen(true);
}

const checkButton = document.createElement('button');
checkButton.textContent = 'Check Answer';
checkButton.style.marginTop = '2rem';
checkButton.style.padding = '0.5rem 1rem';
checkButton.style.fontSize = '1rem';
checkButton.style.cursor = 'pointer';
checkButton.onclick = checkAnswers;
document.querySelector('.container').appendChild(checkButton);
