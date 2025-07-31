const VIMEO_TOKEN = "fd34e8b7d77d082834788d718081bc1d";
const USER_ID = "me"; // Pode ser um número ou 'me'

async function getVideos() {
  const res = await fetch(`https://api.vimeo.com/users/${USER_ID}/videos?per_page=5`, {
    headers: {
      Authorization: `Bearer ${VIMEO_TOKEN}`,
    },
  });
  const data = await res.json();
  return data.data; // array de vídeos
}

function setupVideoPlayer(url) {
  const player = videojs('my-video');
  player.src({
    src: url,
    type: url.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
  });
  player.play();
}

async function init() {
  const videos = await getVideos();
  const listContainer = document.getElementById('video-list');

  videos.forEach((video, index) => {
    const btn = document.createElement('button');
    btn.textContent = `Play vídeo ${index + 1}`;
    btn.onclick = async () => {
      // Buscar arquivos de vídeo do player
      const files = video.download || video.files;
      const file = files?.find(f => f.quality === 'sd' || f.quality === '720p' || f.link.endsWith('.mp4'));
      if (file) setupVideoPlayer(file.link);
      else alert("Vídeo não disponível para download direto.");
    };
    listContainer.appendChild(btn);
  });

  // Auto play o primeiro vídeo
  const first = videos[0];
  if (first) {
    const files = first.download || first.files;
    const file = files?.find(f => f.quality === 'sd' || f.quality === '720p' || f.link.endsWith('.mp4'));
    if (file) setupVideoPlayer(file.link);
  }
}

init();