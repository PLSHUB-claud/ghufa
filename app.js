// ==========================================
// GHUFA OLD WEB SITE - APP LOGIC
// ==========================================

// Tab Switching
const tabs = document.querySelectorAll(".nav-tab");
const panels = document.querySelectorAll(".tab-panel");

function switchTab(name) {
  tabs.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === name));
  panels.forEach(panel => panel.classList.toggle("active", panel.id === `tab-${name}`));
  history.replaceState(null, "", `#${name}`);
}

tabs.forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
document.querySelectorAll("[data-tab-link]").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab(link.dataset.tabLink);
  });
});
document.querySelectorAll("[data-tab-jump]").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tabJump));
});

// Copy button
document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const old = button.textContent;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = "copied";
    } catch {
      button.textContent = button.dataset.copy;
    }
    setTimeout(() => button.textContent = old, 1200);
  });
});

// Search easter egg
const searchButton = document.getElementById("searchButton");
if (searchButton) {
  searchButton.addEventListener("click", () => {
    const input = document.getElementById("searchInput");
    if (input) input.value = input.value.split("").reverse().join("");
  });
}

// Random button easter egg
const randomButton = document.getElementById("randomButton");
if (randomButton) {
  randomButton.addEventListener("click", () => {
    const words = ["enter", "rot", "archive", "blood", "ghufa", "index"];
    randomButton.textContent = words[Math.floor(Math.random() * words.length)];
  });
}

// Missing GIF handler
document.querySelectorAll("[data-gif-slot] img, .gif-slot img").forEach(img => {
  img.addEventListener("error", () => {
    img.parentElement.classList.add("missing");
  });
});

// ==========================================
// GOTHIC MEDIA PLAYER & PLAYLIST SYSTEM
// ==========================================

const playlist = [
  {
    "title": "01. ATTAINING HEAVEN BY FORCE",
    "sub": "DOOMSDAY // GHUFA AUDIO ARCHIVE",
    "src": "music/Attaining Heaven By Force_spotdown.org.mp3",
    "cover": "assets/covers/cover_01.jpg"
  },
  {
    "title": "02. BALL-GAGGED AND GUTTED",
    "sub": "VISCERAL DISGORGE // GHUFA AUDIO ARCHIVE",
    "src": "music/Ball-Gagged and Gutted_spotdown.org.mp3",
    "cover": "assets/covers/cover_02.jpg"
  },
  {
    "title": "03. BITCH IN A DITCH",
    "sub": "DEVOUR THE UNBORN // GHUFA AUDIO ARCHIVE",
    "src": "music/Bitch in a Ditch_spotdown.org.mp3",
    "cover": "assets/covers/cover_03.jpg"
  },
  {
    "title": "04. BLACKSMITH OF DAMNATION",
    "sub": "COLD STEEL // GHUFA AUDIO ARCHIVE",
    "src": "music/Blacksmith of Damnation_spotdown.org.mp3",
    "cover": "assets/covers/cover_04.jpg"
  },
  {
    "title": "05. CHAINSAW DISMEMBERMENT",
    "sub": "MORTICIAN // GHUFA AUDIO ARCHIVE",
    "src": "music/Chainsaw Dismemberment_spotdown.org.mp3",
    "cover": "assets/covers/cover_05.jpg"
  },
  {
    "title": "06. CHEAP VODKA",
    "sub": "ACID BATH // GHUFA AUDIO ARCHIVE",
    "src": "music/Cheap Vodka_spotdown.org.mp3",
    "cover": "assets/covers/cover_06.jpg"
  },
  {
    "title": "07. DEMENTED AGGRESSION",
    "sub": "CANNIBAL CORPSE // GHUFA AUDIO ARCHIVE",
    "src": "music/Demented Aggression_spotdown.org.mp3",
    "cover": "assets/covers/cover_07.jpg"
  },
  {
    "title": "08. DOUBLEWIDE STOMP",
    "sub": "BODYBOX // GHUFA AUDIO ARCHIVE",
    "src": "music/Doublewide Stomp_spotdown.org.mp3",
    "cover": "assets/covers/cover_08.jpg"
  },
  {
    "title": "09. EVERY DOG GETS PUT DOWN",
    "sub": "CORPSE PILE // GHUFA AUDIO ARCHIVE",
    "src": "music/Every Dog Gets Put Down_spotdown.org.mp3",
    "cover": "assets/covers/cover_09.jpg"
  },
  {
    "title": "10. EYES OF ABOMINATION",
    "sub": "MALODOROUS // GHUFA AUDIO ARCHIVE",
    "src": "music/Eyes of Abomination_spotdown.org.mp3",
    "cover": "assets/covers/cover_10.jpg"
  },
  {
    "title": "11. FIXATED ON DEVASTATION",
    "sub": "DYING FETUS // GHUFA AUDIO ARCHIVE",
    "src": "music/Fixated on Devastation_spotdown.org.mp3",
    "cover": "assets/covers/cover_11.jpg"
  },
  {
    "title": "12. FIXATION THROUGH INFANT SODOMY",
    "sub": "EMBRYECTOMY // GHUFA AUDIO ARCHIVE",
    "src": "music/Fixation Through Infant Sodomy_spotdown.org.mp3",
    "cover": "assets/covers/cover_12.jpg"
  },
  {
    "title": "13. FORCE FED SHREDDED GENETALIA",
    "sub": "VISCERAL DISGORGE // GHUFA AUDIO ARCHIVE",
    "src": "music/Force Fed Shredded Genetalia_spotdown.org.mp3",
    "cover": "assets/covers/cover_13.jpg"
  },
  {
    "title": "14. GO-ZEN GRINDER",
    "sub": "GO-ZEN // GHUFA AUDIO ARCHIVE",
    "src": "music/GO-ZEN GRINDER_spotdown.org.mp3",
    "cover": "assets/covers/cover_14.jpg"
  },
  {
    "title": "15. GHETTO BRAWL",
    "sub": "ACRANIUS // GHUFA AUDIO ARCHIVE",
    "src": "music/Ghetto Brawl_spotdown.org.mp3",
    "cover": "assets/covers/cover_15.jpg"
  },
  {
    "title": "16. GROSS ABUSE",
    "sub": "200 STAB WOUNDS // GHUFA AUDIO ARCHIVE",
    "src": "music/Gross Abuse_spotdown.org.mp3",
    "cover": "assets/covers/cover_16.jpg"
  },
  {
    "title": "17. HEAD CAVED IN",
    "sub": "10 TO THE CHEST, VOLCANO // GHUFA AUDIO ARCHIVE",
    "src": "music/HEAD CAVED IN_spotdown.org.mp3",
    "cover": "assets/covers/cover_17.jpg"
  },
  {
    "title": "18. HANDS OF ETERNITY",
    "sub": "200 STAB WOUNDS // GHUFA AUDIO ARCHIVE",
    "src": "music/Hands of Eternity_spotdown.org.mp3",
    "cover": "assets/covers/cover_18.jpg"
  },
  {
    "title": "19. IDEOLOGICAL SUBJUGATION",
    "sub": "DYING FETUS // GHUFA AUDIO ARCHIVE",
    "src": "music/Ideological Subjugation_spotdown.org.mp3",
    "cover": "assets/covers/cover_19.jpg"
  },
  {
    "title": "20. MACHETE CODPIECE MENSTRUATION",
    "sub": "EMBRYECTOMY // GHUFA AUDIO ARCHIVE",
    "src": "music/Machete Codpiece Menstruation_spotdown.org.mp3",
    "cover": "assets/covers/cover_20.jpg"
  },
  {
    "title": "21. METAMORPHIC DEITY",
    "sub": "RABID // GHUFA AUDIO ARCHIVE",
    "src": "music/Metamorphic Deity_spotdown.org.mp3",
    "cover": "assets/covers/cover_21.jpg"
  },
  {
    "title": "22. NECROCANNIBAL",
    "sub": "MORTICIAN // GHUFA AUDIO ARCHIVE",
    "src": "music/Necrocannibal_spotdown.org.mp3",
    "cover": "assets/covers/cover_22.jpg"
  },
  {
    "title": "23. RABID",
    "sub": "MORTICIAN // GHUFA AUDIO ARCHIVE",
    "src": "music/Rabid_spotdown.org (1).mp3",
    "cover": "assets/covers/cover_23.jpg"
  },
  {
    "title": "24. RABID",
    "sub": "RABID // GHUFA AUDIO ARCHIVE",
    "src": "music/Rabid_spotdown.org.mp3",
    "cover": "assets/covers/cover_24.jpg"
  },
  {
    "title": "25. REALITY",
    "sub": "CORPSE PILE // GHUFA AUDIO ARCHIVE",
    "src": "music/Reality_spotdown.org.mp3",
    "cover": "assets/covers/cover_25.jpg"
  },
  {
    "title": "26. SPLIT THE FUCK OPEN",
    "sub": "10 TO THE CHEST, SANGUISUGABOGG // GHUFA AUDIO ARCHIVE",
    "src": "music/SPLIT THE FUCK OPEN_spotdown.org.mp3",
    "cover": "assets/covers/cover_26.jpg"
  },
  {
    "title": "27. SARCOPHAGIC FRENZY",
    "sub": "CANNIBAL CORPSE // GHUFA AUDIO ARCHIVE",
    "src": "music/Sarcophagic Frenzy_spotdown.org.mp3",
    "cover": "assets/covers/cover_27.jpg"
  },
  {
    "title": "28. SKIN PEELER",
    "sub": "MORTICIAN // GHUFA AUDIO ARCHIVE",
    "src": "music/Skin Peeler_spotdown.org.mp3",
    "cover": "assets/covers/cover_28.jpg"
  },
  {
    "title": "29. SKULLFUCK LOBOTOMY",
    "sub": "AMPUTATED // GHUFA AUDIO ARCHIVE",
    "src": "music/Skullfuck Lobotomy_spotdown.org.mp3",
    "cover": "assets/covers/cover_29.jpg"
  },
  {
    "title": "30. STAB",
    "sub": "MORTICIAN // GHUFA AUDIO ARCHIVE",
    "src": "music/Stab_spotdown.org.mp3",
    "cover": "assets/covers/cover_30.jpg"
  },
  {
    "title": "31. STOMA PENETRATION",
    "sub": "CEREBRAL INCUBATION // GHUFA AUDIO ARCHIVE",
    "src": "music/Stoma Penetration_spotdown.org.mp3",
    "cover": "assets/covers/cover_31.jpg"
  },
  {
    "title": "32. THE EDGE OF EXISTENCE",
    "sub": "CREEPING DEATH // GHUFA AUDIO ARCHIVE",
    "src": "music/The Edge of Existence_spotdown.org.mp3",
    "cover": "assets/covers/cover_32.jpg"
  },
  {
    "title": "33. THE FORGOTTEN REALMS",
    "sub": "PROWL // GHUFA AUDIO ARCHIVE",
    "src": "music/The Forgotten Realms_spotdown.org.mp3",
    "cover": "assets/covers/cover_33.jpg"
  },
  {
    "title": "34. THE JAVELIN",
    "sub": "FUGITIVE // GHUFA AUDIO ARCHIVE",
    "src": "music/The Javelin_spotdown.org.mp3",
    "cover": "assets/covers/cover_34.jpg"
  },
  {
    "title": "35. THE LLANFAIRPWLLGWYNGYLLGOGERYCHWYRNDROBWLLLLANTYSILIOGOGOGOCH SLASHER",
    "sub": "XAVLEGBMAOFFFASSSSITIMIWOAMNDUTROABCWAPWAEIIPPOHFFFX // GHUFA AUDIO ARCHIVE",
    "src": "music/The Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch Slasher_spotdown.org.mp3",
    "cover": "assets/covers/cover_35.jpg"
  },
  {
    "title": "36. WHEN WHORES MEET SAWS",
    "sub": "AMPUTATED // GHUFA AUDIO ARCHIVE",
    "src": "music/When Whores Meet Saws_spotdown.org.mp3",
    "cover": "assets/covers/cover_36.jpg"
  },
  {
    "title": "37. YOUR TREACHERY WILL DIE WITH YOU",
    "sub": "DYING FETUS // GHUFA AUDIO ARCHIVE",
    "src": "music/Your Treachery Will Die with You_spotdown.org.mp3",
    "cover": "assets/covers/cover_37.jpg"
  }
];

let currentIndex = 0;
let isCustomFile = false;

// Player Elements
const gothPlayer = document.getElementById("gothPlayer");
const audio = document.getElementById("lobbyAudio") || new Audio();
const gothCover = document.getElementById("gothCover");
const gothHudStatus = document.getElementById("gothHudStatus");
const gothHudTime = document.getElementById("gothHudTime");
const gothHudTitle = document.getElementById("gothHudTitle");
const gothHudSub = document.getElementById("gothHudSub");

const gothPlay = document.getElementById("gothPlay");
const gothPrev = document.getElementById("gothPrev");
const gothNext = document.getElementById("gothNext");
const gothSeek = document.getElementById("gothSeek");
const gothSeekProgress = document.getElementById("gothSeekProgress");
const gothVolConsole = document.getElementById("gothVolConsole");
const gothSpeakerBtn = document.getElementById("gothSpeakerBtn");
const gothSpeakerIcon = document.getElementById("gothSpeakerIcon");
const gothVolTrack = document.getElementById("gothVolTrack");
const gothVolFill = document.getElementById("gothVolFill");
const gothVolHandle = document.getElementById("gothVolHandle");

const gothTracklistBtn = document.getElementById("gothTracklistBtn");
const gothPlaylistDrawer = document.getElementById("gothPlaylistDrawer");
const gothDrawerClose = document.getElementById("gothDrawerClose");
const gothDrawerList = document.getElementById("gothDrawerList");

const gothAudioFile = document.getElementById("gothAudioFile");
const gothDrawerUpload = document.getElementById("gothDrawerUpload");

// Tab Music Player Elements
const musicCover = document.getElementById("musicCover");
const trackTitle = document.getElementById("trackTitle");
const trackMeta = document.getElementById("trackMeta");
const musicTrackList = document.getElementById("musicTrackList");
const musicTimeDisplay = document.getElementById("musicTimeDisplay");
const audioPlayBtn = document.getElementById("audioPlay");
const audioPauseBtn = document.getElementById("audioPause");
const audioStopBtn = document.getElementById("audioStop");
const audioPrevBtn = document.getElementById("audioPrev");
const audioNextBtn = document.getElementById("audioNext");
const audioSeekBtn = document.getElementById("audioSeek");
const audioFile = document.getElementById("audioFile");

function formatTime(sec) {
  if (!isFinite(sec) || isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function updateTrackUI() {
  const current = playlist[currentIndex];
  if (!current) return;

  const coverSrc = current.cover || "assets/profile_doll.png";

  if (gothCover) {
    gothCover.style.opacity = "0.3";
    setTimeout(() => {
      gothCover.src = coverSrc;
      gothCover.style.opacity = "1";
    }, 120);
  }

  if (musicCover) {
    musicCover.style.opacity = "0.3";
    setTimeout(() => {
      musicCover.src = coverSrc;
      musicCover.style.opacity = "1";
    }, 120);
  }

  if (gothHudTitle) gothHudTitle.textContent = current.title;
  if (gothHudSub) gothHudSub.textContent = current.sub || "GHUFA AUDIO ARCHIVE";

  if (trackTitle) trackTitle.textContent = current.title;
  if (trackMeta) trackMeta.textContent = current.sub || "GHUFA AUDIO ARCHIVE";

  renderDrawerPlaylist();
  renderMusicTabPlaylist();
}

function loadTrack(index, autoPlay = false) {
  if (index < 0 || index >= playlist.length) return;
  currentIndex = index;
  isCustomFile = false;

  const track = playlist[currentIndex];
  audio.src = track.src;
  updateTrackUI();

  if (autoPlay) {
    playAudio();
  } else {
    updatePlayState(false);
  }
}

function playAudio() {
  if (!audio.src) {
    loadTrack(currentIndex, true);
    return;
  }
  audio.play().then(() => {
    updatePlayState(true);
  }).catch(() => {
    updatePlayState(false);
  });
}

function pauseAudio() {
  audio.pause();
  updatePlayState(false);
}

function togglePlay() {
  if (audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
}

function updatePlayState(isPlaying) {
  if (gothPlayer) {
    gothPlayer.classList.toggle("playing", isPlaying);
  }
  if (gothHudStatus) {
    gothHudStatus.textContent = isPlaying ? "PLAYING" : "PAUSED";
  }
}

function renderDrawerPlaylist() {
  if (!gothDrawerList) return;
  gothDrawerList.innerHTML = "";

  playlist.forEach((track, i) => {
    const item = document.createElement("div");
    item.className = `goth-drawer-item ${i === currentIndex && !isCustomFile ? "active" : ""}`;
    item.innerHTML = `
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${track.title}</span>
      <span style="font-size:9px;opacity:0.7">${i === currentIndex && !audio.paused ? "▶" : `#${i + 1}`}</span>
    `;
    item.addEventListener("click", () => {
      loadTrack(i, true);
      if (gothPlaylistDrawer) gothPlaylistDrawer.classList.remove("open");
    });
    gothDrawerList.appendChild(item);
  });
}

function renderMusicTabPlaylist() {
  if (!musicTrackList) return;
  musicTrackList.innerHTML = "";

  playlist.forEach((track, i) => {
    const row = document.createElement("div");
    row.className = `music-row ${i === currentIndex && !isCustomFile ? "active" : ""}`;
    const cleanTitle = track.title.replace(/^\d+\.\s*/, "");
    const cleanArtist = track.sub.replace(/\s*\/\/\s*GHUFA AUDIO ARCHIVE/i, "").trim() || "UNKNOWN";

    row.innerHTML = `
      <span class="mr-num">${String(i + 1).padStart(2, "0")}</span>
      <span class="mr-title" title="${track.title}">${cleanTitle}</span>
      <span class="mr-artist" title="${cleanArtist}">${cleanArtist}</span>
    `;
    row.addEventListener("click", () => {
      loadTrack(i, true);
    });
    musicTrackList.appendChild(row);
  });
}

// Controls Listeners
if (gothPlay) gothPlay.addEventListener("click", togglePlay);

if (gothPrev) {
  gothPrev.addEventListener("click", () => {
    const nextIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(nextIdx, true);
  });
}

if (gothNext) {
  gothNext.addEventListener("click", () => {
    const nextIdx = (currentIndex + 1) % playlist.length;
    loadTrack(nextIdx, true);
  });
}

// Tab Music Button Listeners
if (audioPlayBtn) audioPlayBtn.addEventListener("click", togglePlay);
if (audioPauseBtn) audioPauseBtn.addEventListener("click", pauseAudio);
if (audioStopBtn) {
  audioStopBtn.addEventListener("click", () => {
    pauseAudio();
    audio.currentTime = 0;
  });
}
if (audioPrevBtn) {
  audioPrevBtn.addEventListener("click", () => {
    const nextIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(nextIdx, true);
  });
}
if (audioNextBtn) {
  audioNextBtn.addEventListener("click", () => {
    const nextIdx = (currentIndex + 1) % playlist.length;
    loadTrack(nextIdx, true);
  });
}

audio.addEventListener("ended", () => {
  const nextIdx = (currentIndex + 1) % playlist.length;
  loadTrack(nextIdx, true);
});

audio.addEventListener("play", () => {
  updatePlayState(true);
  renderDrawerPlaylist();
  renderMusicTabPlaylist();
});
audio.addEventListener("pause", () => {
  updatePlayState(false);
  renderDrawerPlaylist();
  renderMusicTabPlaylist();
});

// Time update & Seeking
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) {
    if (gothHudTime) gothHudTime.textContent = `${formatTime(audio.currentTime)} / 00:00`;
    if (musicTimeDisplay) musicTimeDisplay.textContent = `${formatTime(audio.currentTime)} / 00:00`;
    return;
  }
  const pct = (audio.currentTime / audio.duration) * 100;
  if (gothSeek) gothSeek.value = pct;
  if (audioSeekBtn) audioSeekBtn.value = pct;
  if (gothSeekProgress) gothSeekProgress.style.width = `${pct}%`;
  const wmpSeekProgress = document.getElementById("wmpSeekProgress");
  if (wmpSeekProgress) wmpSeekProgress.style.width = `${pct}%`;
  if (gothHudTime) {
    gothHudTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  }
  if (musicTimeDisplay) {
    musicTimeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  }
});

if (gothSeek) {
  const handleSeek = () => {
    if (!audio.duration) return;
    const time = (Number(gothSeek.value) / 100) * audio.duration;
    audio.currentTime = time;
    if (gothSeekProgress) gothSeekProgress.style.width = `${gothSeek.value}%`;
  };
  gothSeek.addEventListener("input", handleSeek);
  gothSeek.addEventListener("change", handleSeek);
}

if (audioSeekBtn) {
  audioSeekBtn.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(audioSeekBtn.value) / 100) * audio.duration;
  });
}

// Directly Integrated Draggable Volume Console Logic
let currentVolume = 0.75;
let prevVolume = 0.75;
let isDraggingVol = false;

function setVolume(val, updateAudio = true) {
  currentVolume = Math.max(0, Math.min(1, Number(val)));

  if (updateAudio) {
    audio.volume = currentVolume;
  }

  const pct = Math.round(currentVolume * 100);
  if (gothVolFill) gothVolFill.style.width = `${pct}%`;
  if (gothVolHandle) gothVolHandle.style.left = `${pct}%`;

  const wmpVol = document.getElementById("wmpVolume");
  if (wmpVol) wmpVol.value = currentVolume;

  if (gothSpeakerIcon) {
    if (currentVolume === 0) {
      gothSpeakerIcon.textContent = "🔇";
      gothSpeakerIcon.style.opacity = "0.5";
    } else if (currentVolume < 0.4) {
      gothSpeakerIcon.textContent = "🔉";
      gothSpeakerIcon.style.opacity = "0.85";
    } else {
      gothSpeakerIcon.textContent = "🔊";
      gothSpeakerIcon.style.opacity = "1";
    }
  }
}

const wmpVolumeInput = document.getElementById("wmpVolume");
if (wmpVolumeInput) {
  wmpVolumeInput.addEventListener("input", () => {
    setVolume(Number(wmpVolumeInput.value));
  });
}

function handleTrackClickOrDrag(e) {
  if (!gothVolTrack) return;
  const rect = gothVolTrack.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const fraction = Math.max(0, Math.min(1, clickX / rect.width));
  if (fraction > 0) prevVolume = fraction;
  setVolume(fraction);
}

if (gothVolTrack) {
  gothVolTrack.addEventListener("mousedown", (e) => {
    isDraggingVol = true;
    if (gothVolConsole) gothVolConsole.classList.add("dragging");
    handleTrackClickOrDrag(e);
  });

  gothVolTrack.addEventListener("touchstart", (e) => {
    isDraggingVol = true;
    if (gothVolConsole) gothVolConsole.classList.add("dragging");
    if (e.touches && e.touches[0]) {
      handleTrackClickOrDrag(e.touches[0]);
    }
  }, { passive: true });
}

window.addEventListener("mousemove", (e) => {
  if (!isDraggingVol) return;
  handleTrackClickOrDrag(e);
});

window.addEventListener("touchmove", (e) => {
  if (!isDraggingVol || !e.touches || !e.touches[0]) return;
  handleTrackClickOrDrag(e.touches[0]);
}, { passive: true });

window.addEventListener("mouseup", () => {
  if (isDraggingVol) {
    isDraggingVol = false;
    if (gothVolConsole) gothVolConsole.classList.remove("dragging");
  }
});

window.addEventListener("touchend", () => {
  if (isDraggingVol) {
    isDraggingVol = false;
    if (gothVolConsole) gothVolConsole.classList.remove("dragging");
  }
});

// Speaker button click: toggle mute / unmute
if (gothSpeakerBtn) {
  gothSpeakerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentVolume > 0) {
      prevVolume = currentVolume;
      setVolume(0);
    } else {
      setVolume(prevVolume > 0 ? prevVolume : 0.75);
    }
  });
}

// Mouse wheel on volume console to adjust volume
if (gothVolConsole) {
  gothVolConsole.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    setVolume(currentVolume + delta);
  }, { passive: false });
}

setVolume(0.75);

// Drawer Modal Toggle
if (gothTracklistBtn && gothPlaylistDrawer) {
  gothTracklistBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    gothPlaylistDrawer.classList.toggle("open");
  });
}

if (gothDrawerClose && gothPlaylistDrawer) {
  gothDrawerClose.addEventListener("click", () => {
    gothPlaylistDrawer.classList.remove("open");
  });
}

document.addEventListener("click", (e) => {
  if (gothPlaylistDrawer && !gothPlaylistDrawer.contains(e.target) && e.target !== gothTracklistBtn) {
    gothPlaylistDrawer.classList.remove("open");
  }
});

// Custom Audio File Loading
function handleCustomAudioFile(file) {
  if (!file) return;
  isCustomFile = true;
  const fileUrl = URL.createObjectURL(file);
  const cleanName = file.name.replace(/\.[^/.]+$/, "").toUpperCase();

  audio.src = fileUrl;

  if (gothCover) gothCover.src = "assets/profile_doll.png";
  if (musicCover) musicCover.src = "assets/profile_doll.png";
  if (gothHudTitle) gothHudTitle.textContent = cleanName;
  if (trackTitle) trackTitle.textContent = cleanName;
  if (gothHudSub) gothHudSub.textContent = "TEMPORARY LOCAL FILE // LOADED AUDIO";
  if (trackMeta) trackMeta.textContent = "TEMPORARY LOCAL FILE // LOADED AUDIO";

  playAudio();
}

[gothAudioFile, gothDrawerUpload, audioFile].forEach(input => {
  if (input) {
    input.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleCustomAudioFile(file);
    });
  }
});

// Initial track load & Robust Autoplay
loadTrack(0, false);
renderDrawerPlaylist();

function attemptAutoplay() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      updatePlayState(true);
    }).catch(() => {
      // Browser autoplay policy requires user interaction:
      // Attach one-time listeners to immediately start playback on first touch/click/key
      const unlockAudio = () => {
        playAudio();
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
        window.removeEventListener("pointerdown", unlockAudio);
      };
      window.addEventListener("click", unlockAudio, { once: true });
      window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
      window.addEventListener("keydown", unlockAudio, { once: true });
      window.addEventListener("pointerdown", unlockAudio, { once: true });
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attemptAutoplay);
} else {
  attemptAutoplay();
}

// ==========================================
// WINDOWS NOTEPAD 'ABOUT YOU' SYSTEM STATS
// ==========================================

async function initAboutYou() {
  const ipEl = document.getElementById("aboutIp");
  const browserEl = document.getElementById("aboutBrowser");
  const langEl = document.getElementById("aboutLang");
  const screenEl = document.getElementById("aboutScreen");
  const colorEl = document.getElementById("aboutColor");
  const osEl = document.getElementById("aboutOs");
  const memoryEl = document.getElementById("aboutMemory");
  const coresEl = document.getElementById("aboutCores");
  const connEl = document.getElementById("aboutConn");
  const cookiesEl = document.getElementById("aboutCookies");
  const dntEl = document.getElementById("aboutDnt");
  const tzEl = document.getElementById("aboutTz");
  const winSizeEl = document.getElementById("aboutWinSize");
  const timeEl = document.getElementById("aboutTime");

  // Browser & OS
  if (browserEl) browserEl.textContent = navigator.userAgent;
  if (langEl) langEl.textContent = navigator.language || "pt-BR";
  if (screenEl) screenEl.textContent = `${screen.width}x${screen.height}`;
  if (colorEl) colorEl.textContent = `${screen.colorDepth || 24}-bit`;
  if (osEl) osEl.textContent = navigator.platform || "Win32";
  if (memoryEl) memoryEl.textContent = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "32 GB";
  if (coresEl) coresEl.textContent = navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) : "6";
  if (connEl) {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    connEl.textContent = (conn && conn.effectiveType) ? conn.effectiveType : "4g";
  }
  if (cookiesEl) cookiesEl.textContent = navigator.cookieEnabled ? "Yes" : "No";
  if (dntEl) dntEl.textContent = (navigator.doNotTrack === "1" || window.doNotTrack === "1") ? "Enabled" : "Disabled";
  if (tzEl) {
    try {
      tzEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London";
    } catch {
      tzEl.textContent = "Europe/London";
    }
  }

  // Live Window Size update
  function updateWinSize() {
    if (winSizeEl) winSizeEl.textContent = `${window.innerWidth}x${window.innerHeight}`;
  }
  window.addEventListener("resize", updateWinSize);
  updateWinSize();

  // Live Time update
  function updateClock() {
    if (!timeEl) return;
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    const secs = String(now.getSeconds()).padStart(2, "0");
    timeEl.textContent = `${day}/${month}/${year}, ${hours}:${mins}:${secs}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Fetch Public IP
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    if (ipEl && data && data.ip) {
      ipEl.textContent = data.ip;
    }
  } catch {
    if (ipEl) ipEl.textContent = "179.126.167.235";
  }
}

initAboutYou();

// Hash Navigation
const initialHash = location.hash.replace("#", "");
if (["lobby", "profiles", "music"].includes(initialHash)) {
  switchTab(initialHash);
} else {
  switchTab("lobby");
}

/* =========================================================
   SECURITY & ANTI-INSPECT PROTECTION
   ========================================================= */
// Disable Right Click context menu
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
});

// Block DevTools shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S)
document.addEventListener("keydown", (e) => {
  // F12
  if (e.key === "F12" || e.keyCode === 123) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
  if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c" || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  // Ctrl+U (View Source) & Ctrl+S (Save Page)
  if (e.ctrlKey && (e.key === "U" || e.key === "u" || e.key === "S" || e.key === "s" || e.keyCode === 85 || e.keyCode === 83)) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
});

// DevTools console defense & debugger trap
(() => {
  setInterval(() => {
    (function () {
      Function("debugger")();
    })();
  }, 400);

  setInterval(() => {
    console.clear();
  }, 1000);
})();
