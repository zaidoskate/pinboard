const API = 'https://tu-api.azurewebsites.net/pins';

async function fetchPins() {
  const res = await fetch(API);
  const pins = await res.json();
  const board = document.getElementById('board');
  board.innerHTML = '';
  pins.forEach(p => {
    const div = document.createElement('div');
    div.className = 'pin';

    if (p.Type === 'text') {
      div.textContent = p.Content;
    } else if (p.Type === 'image') {
      const img = document.createElement('img');
      img.src = p.Content;
      div.appendChild(img);
    } else if (p.Type === 'audio') {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = p.Content;
      div.appendChild(audio);
    }

    board.appendChild(div);
  });
}

document.getElementById('add-pin').addEventListener('click', async () => {
  const type = document.getElementById('pin-type').value;
  const content = document.getElementById('pin-content').value.trim();
  if (!content) return alert('Agrega texto o URL');
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, content })
  });
  document.getElementById('pin-content').value = '';
  fetchPins();
});

fetchPins();
