const API = 'https://pinboard-ivkx.onrender.com/pins';

async function fetchPins() {
  const res = await fetch(API);
  const pins = await res.json();
  const board = document.getElementById('board');
  board.innerHTML = '';

  pins.forEach(p => {
    const div = document.createElement('div');
    div.className = 'pin';

    // Usar propiedades en minúsculas según JSON de la API
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
    }

    board.appendChild(div);
  });
}

// Mostrar/ocultar formulario al hacer clic en el botón +
document.getElementById('show-menu').addEventListener('click', () => {
  const pinForm = document.getElementById('pin-form');
  const isHidden = pinForm.style.display === 'none';
  pinForm.style.display = isHidden ? 'block' : 'none';  // Toggle display
  pinForm.style.opacity = isHidden ? '1' : '0';  // Transición de opacidad
});

document.getElementById('add-pin').addEventListener('click', async () => {
  const type = document.getElementById('pin-type').value;
  const content = document.getElementById('pin-content').value.trim();
  if (!content) return alert('Agrega texto o URL');
  
  // Enviar la nueva información del pin a la API
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, content })
  });

  // Limpiar y ocultar el formulario
  document.getElementById('pin-content').value = '';
  document.getElementById('pin-form').style.display = 'none';
  document.getElementById('pin-form').style.opacity = '0'; // Animación de ocultado

  // Refrescar el tablero
  fetchPins();
});

// Cargar pins al iniciar
document.addEventListener('DOMContentLoaded', fetchPins);
