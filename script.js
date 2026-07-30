/*
  ============================================================
  CONFIGURAÇÕES PRINCIPAIS DA RÁDIO
  Altere somente os dados abaixo para personalizar o site.
  ============================================================
*/

const RADIO_CONFIG = {
  streamUrl: "https://stream.zeno.fm/yn65fsaurfhvv",
  youtubeVideoId: "kVv9I2VFStQ",
  youtubeChannelUrl: "https://www.youtube.com/",
  instagramUrl: "https://www.instagram.com/cjonasfernandes/",
  whatsappNumber: "5563984857405",
  whatsappMessage:
    "Olá! Estou ouvindo a Rádio IDE e gostaria de participar da programação."
};

/*
  Grade demonstrativa.
  Use horários no formato 24 horas.
  O programa atual é calculado automaticamente conforme o horário do visitante.
*/
const PROGRAMACAO = [
  {
    inicio: "00:00",
    fim: "06:00",
    nome: "Louvor da Madrugada",
    descricao: "Uma madrugada de adoração e comunhão.",
    icone: "fa-moon"
  },
  {
    inicio: "06:00",
    fim: "09:00",
    nome: "Manhã com Deus",
    descricao: "Louvores e uma palavra para começar bem o dia.",
    icone: "fa-sun"
  },
  {
    inicio: "09:00",
    fim: "12:00",
    nome: "Palavra e Louvor",
    descricao: "Música gospel e mensagens edificantes.",
    icone: "fa-book-bible"
  },
  {
    inicio: "12:00",
    fim: "15:00",
    nome: "IDE Notícias",
    descricao: "Informação, prestação de serviço e boa música.",
    icone: "fa-newspaper"
  },
  {
    inicio: "15:00",
    fim: "18:00",
    nome: "Tarde de Adoração",
    descricao: "Uma tarde inteira de louvores selecionados.",
    icone: "fa-music"
  },
  {
    inicio: "18:00",
    fim: "21:00",
    nome: "Culto no Lar",
    descricao: "Oração, Palavra de Deus e participação dos ouvintes.",
    icone: "fa-house"
  },
  {
    inicio: "21:00",
    fim: "23:59",
    nome: "Noite de Avivamento",
    descricao: "Mensagens e louvores para renovar a fé.",
    icone: "fa-fire-flame-curved"
  }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getCurrentProgram() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    PROGRAMACAO.find((programa) => {
      const start = timeToMinutes(programa.inicio);
      let end = timeToMinutes(programa.fim);

      if (programa.fim === "23:59") {
        end = 24 * 60;
      }

      return currentMinutes >= start && currentMinutes < end;
    }) || PROGRAMACAO[0]
  );
}

function createSchedule() {
  const scheduleGrid = $("#schedule-grid");

  if (!scheduleGrid) return;

  const currentProgram = getCurrentProgram();

  scheduleGrid.innerHTML = PROGRAMACAO.map((programa) => {
    const isActive = programa.nome === currentProgram.nome;

    return `
      <article class="schedule-card${isActive ? " active" : ""}">
        <div class="schedule-icon">
          <i class="fa-solid ${programa.icone}"></i>
        </div>
        <span class="schedule-time">${programa.inicio} às ${programa.fim}</span>
        <h3>${programa.nome}</h3>
        <p>${programa.descricao}</p>
      </article>
    `;
  }).join("");
}

function updateCurrentProgram() {
  const currentProgram = getCurrentProgram();
  const programName = currentProgram.nome;
  const programTime = `${currentProgram.inicio} às ${currentProgram.fim}`;

  const programElements = [
    $("#programa-atual"),
    $("#programa-card")
  ];

  programElements.forEach((element) => {
    if (element) element.textContent = programName;
  });

  const timeElement = $("#horario-programa");

  if (timeElement) {
    timeElement.textContent = programTime;
  }
}

function configureLinks() {
  const encodedMessage = encodeURIComponent(RADIO_CONFIG.whatsappMessage);
  const whatsappUrl =
    `https://wa.me/${RADIO_CONFIG.whatsappNumber}?text=${encodedMessage}`;

  const whatsappLinks = [
    $("#hero-whatsapp"),
    $("#contact-whatsapp"),
    $("#whatsapp-link"),
    $("#floating-whatsapp")
  ];

  whatsappLinks.forEach((link) => {
    if (link) link.href = whatsappUrl;
  });

  const instagramLink = $("#instagram-link");

  if (instagramLink) {
    instagramLink.href = RADIO_CONFIG.instagramUrl;
  }

  const youtubeLinks = [
    $("#youtube-channel"),
    $("#youtube-link")
  ];

  youtubeLinks.forEach((link) => {
    if (link) link.href = RADIO_CONFIG.youtubeChannelUrl;
  });

  const player = $("#youtube-player");

  if (player) {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1"
    });

    player.src =
      `https://www.youtube.com/embed/${RADIO_CONFIG.youtubeVideoId}?${params}`;
  }
}

/*
  Player de áudio ao vivo.
  Toca o stream configurado em RADIO_CONFIG.streamUrl (atualmente o link
  gerado pelo Zeno.fm). Controla o botão de play/pause, a animação da
  barra de som e a mensagem de status abaixo do player.
*/
function configureAudioPlayer() {
  const audio = $("#radio-audio");
  const playButton = $("#audio-play-btn");
  const playIcon = $("#audio-play-icon");
  const playLabel = $("#audio-play-label");
  const soundBars = $("#sound-bars");
  const playerNote = $("#player-note");

  if (!audio || !playButton) return;

  const setIcon = (iconClass) => {
    if (playIcon) playIcon.className = iconClass;
  };

  const setIdleState = () => {
    setIcon("fa-solid fa-play");
    if (playLabel) playLabel.textContent = "Ouvir agora";
    if (soundBars) soundBars.classList.remove("playing");
    if (playerNote) {
      playerNote.textContent = "Clique para ouvir a rádio ao vivo.";
    }
  };

  const setLoadingState = () => {
    setIcon("fa-solid fa-spinner fa-spin");
    if (playLabel) playLabel.textContent = "Conectando...";
    if (playerNote) {
      playerNote.textContent = "Conectando à transmissão ao vivo...";
    }
  };

  const setPlayingState = () => {
    setIcon("fa-solid fa-pause");
    if (playLabel) playLabel.textContent = "Pausar";
    if (soundBars) soundBars.classList.add("playing");
    if (playerNote) {
      playerNote.textContent = "Você está ouvindo a Rádio IDE ao vivo.";
    }
  };

  const setErrorState = () => {
    setIcon("fa-solid fa-play");
    if (playLabel) playLabel.textContent = "Tentar novamente";
    if (soundBars) soundBars.classList.remove("playing");
    if (playerNote) {
      playerNote.textContent =
        "Não foi possível conectar à rádio agora. Tente novamente.";
    }
  };

  audio.src = RADIO_CONFIG.streamUrl;

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      setLoadingState();
      audio.play().catch(setErrorState);
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("playing", setPlayingState);
  audio.addEventListener("waiting", setLoadingState);
  audio.addEventListener("pause", setIdleState);
  audio.addEventListener("error", setErrorState);

  setIdleState();
}

function configureMobileMenu() {
  const menuButton = $("#mobile-menu");
  const navMenu = $("#nav-menu");

  if (!menuButton || !navMenu) return;

  const closeMenu = () => {
    menuButton.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
  };

  menuButton.addEventListener("click", () => {
    const willOpen = !navMenu.classList.contains("active");

    menuButton.classList.toggle("active", willOpen);
    navMenu.classList.toggle("active", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute(
      "aria-label",
      willOpen ? "Fechar menu" : "Abrir menu"
    );
  });

  $$("#nav-menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function setCurrentYear() {
  const currentYear = $("#current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
}

function init() {
  configureLinks();
  configureAudioPlayer();
  configureMobileMenu();
  createSchedule();
  updateCurrentProgram();
  setCurrentYear();

  // Atualiza o programa exibido a cada minuto.
  window.setInterval(() => {
    updateCurrentProgram();
    createSchedule();
  }, 60_000);
}

document.addEventListener("DOMContentLoaded", init);