let draggedItem = null;␊
let originalParent = null;␊


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



function addTouchListeners(item) {
  if (item.dataset.touchAdded) return;
  item.dataset.touchAdded = 'true';

  item.addEventListener('touchstart', e => {
    draggedItem = item;
    originalParent = item.parentElement;
    item.style.position = 'absolute';
    item.style.zIndex = '1000';
  }, { passive: false });

  item.addEventListener('touchmove', e => {
    if (!draggedItem) return;
    const touch = e.touches[0];
    item.style.left = `${touch.clientX - item.offsetWidth / 2}px`;
    item.style.top = `${touch.clientY - item.offsetHeight / 2}px`;
    e.preventDefault();
  }, { passive: false });

  item.addEventListener('touchend', e => {
    if (!draggedItem) return;
    const touch = e.changedTouches[0];
    item.style.position = '';
    item.style.zIndex = '';
    item.style.left = '';
    item.style.top = '';
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const zone = dropTarget && dropTarget.closest('.drop-zone, .drop-cell, .drag-bank');
    if (zone) {
      if ((zone.classList.contains('drop-zone') || zone.classList.contains('drop-cell')) && zone.children.length > 0) {
        const existingItem = zone.firstElementChild;
        originalParent.appendChild(existingItem);
        addDragListeners(existingItem);
        addTouchListeners(existingItem);
      }
      zone.appendChild(draggedItem);
      addDragListeners(draggedItem);
      addTouchListeners(draggedItem);
    } else {
      originalParent.appendChild(draggedItem);
    }
    draggedItem = null;
  });
}

const draggables = document.querySelectorAll('.draggable');
draggables.forEach(item => {
  addDragListeners(item);
  addTouchListeners(item);
});


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
        addTouchListeners(existingItem);
      }
      zone.appendChild(draggedItem);
      addDragListeners(draggedItem);
      addTouchListeners(draggedItem);
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
      addTouchListeners(draggedItem);
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

style.css
+27-3
@@ -83,28 +83,52 @@ p {




/* Splash screen */

/* Splash screen */

#splash-screen {

#splash-screen {

  position: fixed;

  position: fixed;

  top: 0;

  top: 0;

  left: 0;

  left: 0;

  width: 100%;

  width: 100%;

  height: 100%;

  height: 100%;

  background: rgba(22, 34, 55, 0.95);

  background: rgba(22, 34, 55, 0.95);

  color: white;

  color: white;

  z-index: 9999;

  z-index: 9999;

  display: flex;

  display: flex;

  align-items: center;

  align-items: center;

  justify-content: center;

  justify-content: center;

}

}





.splash-content {

.splash-content {

  text-align: center;

  text-align: center;

  font-size: 1.5rem;

  font-size: 1.5rem;

  padding: 2rem;

  padding: 2rem;

  background-color: #1e2c44;

  background-color: #1e2c44;

  border: 2px solid #86dabd;

  border: 2px solid #86dabd;

  border-radius: 10px;

  border-radius: 10px;

}

}





.blur-background *:not(#splash-screen):not(script) {

.blur-background *:not(#splash-screen):not(script) {
  filter: blur(4px);

  filter: blur(4px);
}

}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
    max-width: 100%;
    align-items: center;
  }

  .draggable {
    width: 60px;
    height: 60px;
  }

  #element-grid th,
  #element-grid td {
    width: 60px;
    height: 60px;
  }

  #element-grid img {
    max-width: 40px;
    max-height: 40px;
  }
}
