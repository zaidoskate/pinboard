const API = 'https://pinboard-ivkx.onrender.com/pins';

function randomSize(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchPins() {
  const res = await fetch(API);
  const pins = await res.json();
  const board = document.getElementById('board');
  board.innerHTML = '';

  pins.forEach(p => {
    const div = document.createElement('div');
    div.className = 'pin';

    const w = randomSize(150, 300);
    const h = randomSize(150, 300);
    div.style.width = `${w}px`;
    div.style.height = `${h}px`;

    // Contenido del pin
    if (p.type === 'text') {
      div.textContent = p.content;
    } else if (p.type === 'image') {
      const img = document.createElement('img');
      img.src = p.content;
      div.appendChild(img);
    } else if (p.type === 'audio') {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = p.content;
      div.appendChild(audio);
    } else if (p.type === 'youtube') {
      const iframe = document.createElement('iframe');
      iframe.width = 0;
      iframe.height = 0;
      iframe.src = `https://www.youtube.com/embed/${p.content}?enablejsapi=1&controls=0`;
      iframe.allow = 'autoplay';
      div.appendChild(iframe);

      const playBtn = document.createElement('button');
      playBtn.textContent = '▶️ Escuchar audio';
      playBtn.addEventListener('click', () => {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo' }),
          '*'
        );
      });
      div.appendChild(playBtn);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '-';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', async () => {
      if (confirm('¿Estás seguro de que quieres eliminar este pin?')) {
        await fetch(`${API}/${p.id}`, { method: 'DELETE' });
        fetchPins(); // Refrescar
      }
    });
    div.appendChild(deleteBtn);

    board.appendChild(div);
  });
}

document.getElementById('show-menu').addEventListener('click', () => {
  const pinForm = document.getElementById('pin-form');
  const isHidden = pinForm.style.display === 'none';
  pinForm.style.display = isHidden ? 'block' : 'none';
  pinForm.style.opacity = isHidden ? '1' : '0';
});

document.getElementById('add-pin').addEventListener('click', async () => {
  const type = document.getElementById('pin-type').value;
  const content = document.getElementById('pin-content').value.trim();
  if (!content) return alert('Agrega texto o URL');

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, content })
  });

  // Limpiar y ocultar el formulario
  document.getElementById('pin-content').value = '';
  document.getElementById('pin-form').style.display = 'none';
  document.getElementById('pin-form').style.opacity = '0';

  fetchPins();
});

document.addEventListener('DOMContentLoaded', fetchPins);
