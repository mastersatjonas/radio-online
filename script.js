/*
  ============================================================
  CONFIGURAÇÕES PRINCIPAIS DA RÁDIO
  ============================================================
*/
const RADIO_CONFIG = {
  streamUrl: "https://stream.zeno.fm/yn65fsaurfhvv",

  // Vídeo fixo exibido no player (como está hoje).
  youtubeVideoId: "kVv9I2VFStQ",

  // Para programação ao vivo no YouTube: coloque aqui o ID do canal
  // (começa com UC...). O player passa a mostrar sempre a live atual
  // do canal, sem precisar trocar o link a cada transmissão.
  youtubeChannelId: "",

  youtubeChannelUrl: "https://www.youtube.com/", // troque pelo link do canal
  instagramUrl: "https://www.instagram.com/cjonasfernandes/",
  whatsappNumber: "5563984857405",
  whatsappMessage:
    "Olá! Estou ouvindo a Rádio IDE e gostaria de participar da programação."
};

/*
  Grade de programação (horários em 24 horas).
  youtube: true  -> mostra o selo "YouTube" no programa, para avisar
  que ele é transmitido em vídeo.
*/
const PROGRAMACAO = [
  { inicio: "00:00", fim: "06:00", nome: "Louvor da Madrugada", descricao: "Uma madrugada de adoração e comunhão.", youtube: false },
  { inicio: "06:00", fim: "09:00", nome: "Manhã com Deus", descricao: "Louvores e uma palavra para começar bem o dia.", youtube: false },
  { inicio: "09:00", fim: "12:00", nome: "Palavra e Louvor", descricao: "Música gospel e mensagens edificantes.", youtube: false },
  { inicio: "12:00", fim: "15:00", nome: "IDE Notícias", descricao: "Informação, prestação de serviço e boa música.", youtube: false },
  { inicio: "15:00", fim: "18:00", nome: "Tarde de Adoração", descricao: "Uma tarde inteira de louvores selecionados.", youtube: false },
  { inicio: "18:00", fim: "21:00", nome: "Culto no Lar", descricao: "Oração, Palavra de Deus e participação dos ouvintes.", youtube: false },
  { inicio: "21:00", fim: "24:00", nome: "Noite de Avivamento", descricao: "Mensagens e louvores para renovar a fé.", youtube: false }
];

const $ = (selector) => document.querySelector(selector);

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentProgram() {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  return (
    PROGRAMACAO.find(
      (p) => current >= toMinutes(p.inicio) && current < toMinutes(p.fim)
    ) || PROGRAMACAO[0]
  );
}

function renderSchedule() {
  const list = $("#schedule-grid");
  if (!list) return;

  const current = getCurrentProgram();

  list.innerHTML = PROGRAMACAO.map((p) => {
    const active = p.nome === current.nome;
    const tag = active
      ? '<em class="tag now">No ar</em>'
      : p.youtube
        ? '<em class="tag"><i class="fa-brands fa-youtube"></i> YouTube</em>'
        : "<span></span>";

    return `
      <li class="${active ? "active" : ""}">
        <time>${p.inicio} às ${p.fim}</time>
        <div>
          <strong>${p.nome}</strong>
          <p>${p.descricao}</p>
        </div>
        ${tag}
      </li>`;
  }).join("");
}

function renderCurrentProgram() {
  const p = getCurrentProgram();
  const name = $("#programa-atual");
  const time = $("#horario-programa");
  if (name) name.textContent = p.nome;
  if (time) time.textContent = `${p.inicio} às ${p.fim}`;
}

function configureLinks() {
  const message = encodeURIComponent(RADIO_CONFIG.whatsappMessage);
  const whatsappUrl = `https://wa.me/${RADIO_CONFIG.whatsappNumber}?text=${message}`;

  ["#contact-whatsapp", "#whatsapp-link"].forEach((id) => {
    const el = $(id);
    if (el) el.href = whatsappUrl;
  });

  const instagram = $("#instagram-link");
  if (instagram) instagram.href = RADIO_CONFIG.instagramUrl;

  ["#youtube-channel", "#youtube-link"].forEach((id) => {
    const el = $(id);
    if (el) el.href = RADIO_CONFIG.youtubeChannelUrl;
  });

  const player = $("#youtube-player");
  if (player) {
    const params = new URLSearchParams({ rel: "0", modestbranding: "1", playsinline: "1" });
    const base = RADIO_CONFIG.youtubeChannelId
      ? `https://www.youtube.com/embed/live_stream?channel=${RADIO_CONFIG.youtubeChannelId}`
      : `https://www.youtube.com/embed/${RADIO_CONFIG.youtubeVideoId}?`;
    player.src = RADIO_CONFIG.youtubeChannelId ? `${base}&${params}` : `${base}${params}`;
  }
}

/* Player de áudio ao vivo (stream do Zeno.fm). */
function configureAudioPlayer() {
  const audio = $("#radio-audio");
  const button = $("#audio-play-btn");
  const icon = $("#audio-play-icon");
  const label = $("#audio-play-label");
  const note = $("#player-note");

  if (!audio || !button) return;

  const setState = (iconClass, text, message) => {
    if (icon) icon.className = iconClass;
    if (label) label.textContent = text;
    if (note) note.textContent = message;
  };

  const idle = () => setState("fa-solid fa-play", "Ouvir só o áudio", "");
  const loading = () => setState("fa-solid fa-spinner fa-spin", "Conectando...", "Conectando à transmissão...");
  const playing = () => setState("fa-solid fa-pause", "Pausar", "Você está ouvindo a Rádio IDE ao vivo.");
  const failed = () =>
    setState("fa-solid fa-play", "Tentar novamente", "Não foi possível conectar agora. Tente novamente.");

  audio.src = RADIO_CONFIG.streamUrl;

  button.addEventListener("click", () => {
    if (audio.paused) {
      loading();
      audio.play().catch(failed);
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("playing", playing);
  audio.addEventListener("waiting", loading);
  audio.addEventListener("pause", idle);
  audio.addEventListener("error", failed);

  idle();
}

function init() {
  configureLinks();
  configureAudioPlayer();
  renderSchedule();
  renderCurrentProgram();

  const year = $("#current-year");
  if (year) year.textContent = new Date().getFullYear();

  // Atualiza o programa em exibição a cada minuto.
  setInterval(() => {
    renderCurrentProgram();
    renderSchedule();
  }, 60_000);
}

document.addEventListener("DOMContentLoaded", init);
