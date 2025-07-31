const ACCESS_TOKEN = 'fd34e8b7d77d082834788d718081bc1d'; // Substitua pelo token gerado no painel Vimeo

async function fetchVimeoVideos() {
  const res = await fetch('https://api.vimeo.com/me/videos?per_page=5', {
    headers: {
      Authorization: `bearer ${ACCESS_TOKEN}`
    }
  });

  if (!res.ok) {
    console.error('Erro ao buscar vídeos:', res.status);
    return;
  }

  const data = await res.json();
  const videos = data.data;

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const file = video.files?.find(f => f.quality === 'hd' && f.type === 'video/mp4') ||
                 video.files?.find(f => f.type === 'video/mp4');

    if (file) {
      renderVideoOption(video.name, file.link, i === 0);
    }
  }
}

function renderVideoOption(title, mp4Url, autoPlay = false) {
  const list = document.getElementById('videoList');
  const btn = document.createElement('button');
  btn.innerText = `▶️ ${title}`;
  btn.style.margin = '10px';
  btn.style.padding = '10px 20px';
  btn.style.cursor = 'pointer';
  btn.onclick = () => loadVideo(mp4Url);
  list.appendChild(btn);

  if (autoPlay) loadVideo(mp4Url);
}

function loadVideo(mp4Url) {
  const playerEl = document.getElementById('videoPlayer');
  const source = playerEl.querySelector('source');
  source.src = mp4Url;
  playerEl.load();

  if (window.videojs) {
    if (!window.player) {
      window.player = videojs(playerEl);
      player.chromecast({
        metaTitle: 'Transmitindo via Chromecast',
        metaSubtitle: 'Vimeo + Video.js'
      });
    } else {
      window.player.src({ type: 'video/mp4', src: mp4Url });
    }
  }
}

fetchVimeoVideos();