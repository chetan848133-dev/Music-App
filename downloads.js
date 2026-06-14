document.addEventListener("DOMContentLoaded", () => {
  window.TuneWaveTheme?.applySavedTheme?.();
  const langApi = window.TuneWaveLanguage;
  const sharedPlayer = window.TuneWavePlayer || null;
  const downloads = [];

  const greeting = document.getElementById("greeting");
  const clock = document.getElementById("clock");
  const dateLabel = document.getElementById("dateLabel");
  const todayLabel = document.getElementById("todayLabel");
  const downloadCount = document.getElementById("downloadCount");
  const downloadSearch = document.getElementById("downloadSearch");
  const downloadsRows = document.getElementById("downloadsRows");
  const downloadListLabel = document.getElementById("downloadListLabel");
  const totalSongsCount = document.getElementById("totalSongsCount");
  const totalDurationCount = document.getElementById("totalDurationCount");
  const queuedCount = document.getElementById("queuedCount");
  const playAllBtn = document.getElementById("playAllBtn");
  const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));

  const playerTitle = document.getElementById("playerTitle");
  const playerArtist = document.getElementById("playerArtist");
  const playerArtwork = document.getElementById("playerArtwork");
  const playButton = document.getElementById("playButton");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const progress = document.getElementById("progress");
  const currentTime = document.getElementById("currentTime");
  const duration = document.getElementById("duration");
  const volume = document.getElementById("volume");
  const volumeToggle = document.getElementById("downloadsVolumeToggle");
  const volumePopover = document.getElementById("downloadsVolumePopover");
  const likeButton = document.getElementById("downloadsLikeBtn");

  let filterMode = "all";
  let currentIndex = 0;
  let isPlaying = false;
  let progressValue = 0;
  const likedTitles = new Set();
  const audioPlayer = new Audio();
  audioPlayer.preload = "metadata";

  function buildDownloads() {
    return window.TuneWaveUploads?.getDownloadedSongs?.() || [];
  }

  function songKey(song = {}) {
    if (sharedPlayer?.songKey) return sharedPlayer.songKey(song);
    const id = Number(song.id) || 0;
    if (id > 0) return `id:${id}`;
    return `${String(song.title || "").trim().toLowerCase()}::${String(song.artist || "").trim().toLowerCase()}`;
  }

  function durationToSeconds(durationText) {
    const [minutes, seconds] = durationText.split(":").map(Number);
    return (minutes * 60) + seconds;
  }

  function formatTotalDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  function getProfileName() {
    return window.TuneWaveProfile?.loadProfile?.().name || "Listener";
  }

  function formatGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const locale = langApi?.getLocale?.() || undefined;
    const weekday = now.toLocaleDateString(locale, { weekday: "long" });
    const prettyDate = now.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" });
    const timeText = now.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
    const greetingText = langApi?.getGreeting?.(hours) || (hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening");

    greeting.textContent = `${greetingText}, ${getProfileName()}`;
    clock.textContent = timeText;
    dateLabel.textContent = `${weekday} • ${prettyDate}`;
    todayLabel.textContent = langApi?.t("downloads.todayLabel") || `Keep your ${weekday.toLowerCase()} offline queue organized and ready for travel.`;
  }

  function formatTime(totalSeconds) {
    const safe = Math.max(0, Math.floor(totalSeconds || 0));
    const minutes = Math.floor(safe / 60);
    const seconds = String(safe % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function syncLikeButton(title) {
    const liked = likedTitles.has(title);
    likeButton.classList.toggle("active", liked);
    likeButton.querySelector(".heart-icon").textContent = liked ? "♥" : "♡";
    likeButton.querySelector(".like-label").textContent = liked ? "Liked" : "Like";
  }

  function startPlayback() {
    if (sharedPlayer) {
      sharedPlayer.toggle();
      return;
    }
    if (!downloads.length) return;
    const song = downloads[currentIndex];
    if (!song?.audioUrl) {
      playerArtist.textContent = `${song.artist} • no audio file stored for this download`;
      return;
    }
    isPlaying = true;
    playButton.textContent = "⏸";
    audioPlayer.play().catch(() => {
      pausePlayback();
    });
  }

  function pausePlayback() {
    if (sharedPlayer) {
      sharedPlayer.pause();
      return;
    }
    isPlaying = false;
    playButton.textContent = "▶";
    audioPlayer.pause();
  }

  function loadSong(index) {
    const song = downloads[index];
    if (!song) return;
    if (sharedPlayer) {
      currentIndex = index;
      renderRows();
      const queued = sharedPlayer.setQueue?.(downloads, { startIndex: index, autoPlay: true, keepTime: false });
      if (!queued) {
        sharedPlayer.playSong(song);
      }
      return;
    }
    currentIndex = index;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerArtwork.className = `upload-cover artwork ${song.coverClass}`;
    if (song.coverUrl) {
      playerArtwork.style.backgroundImage = `url("${song.coverUrl}")`;
      playerArtwork.style.backgroundSize = "cover";
      playerArtwork.style.backgroundPosition = "center";
    } else {
      playerArtwork.style.backgroundImage = "";
      playerArtwork.style.backgroundSize = "";
      playerArtwork.style.backgroundPosition = "";
    }
    duration.textContent = song.duration;
    const durationSeconds = durationToSeconds(song.duration);
    progress.max = String(Math.max(durationSeconds, 1));
    progress.value = "0";
    progressValue = 0;
    currentTime.textContent = "0:00";
    if (song.audioUrl) {
      if (audioPlayer.src !== song.audioUrl) {
        audioPlayer.src = song.audioUrl;
      }
    } else {
      audioPlayer.pause();
      audioPlayer.removeAttribute("src");
      audioPlayer.load();
    }
    syncLikeButton(song.title);
    renderRows();
    startPlayback();
  }

  function nextSong() {
    if (sharedPlayer) {
      sharedPlayer.next();
      return;
    }
    if (!downloads.length) return;
    currentIndex = (currentIndex + 1) % downloads.length;
    loadSong(currentIndex);
  }

  function previousSong() {
    if (sharedPlayer) {
      sharedPlayer.previous();
      return;
    }
    if (!downloads.length) return;
    currentIndex = (currentIndex - 1 + downloads.length) % downloads.length;
    loadSong(currentIndex);
  }

  function removeSong(songKey) {
    if (!window.TuneWaveUploads?.removeDownload) return;
    window.TuneWaveUploads.removeDownload(songKey);
    downloads.length = 0;
    downloads.push(...buildDownloads());
    renderStats();
    renderRows();
    if (currentIndex >= downloads.length) {
      currentIndex = Math.max(0, downloads.length - 1);
      if (sharedPlayer) {
        sharedPlayer.pause();
      } else {
        pausePlayback();
        loadSong(currentIndex);
      }
    }
  }

  function renderStats() {
    const totalPlayTime = downloads.reduce((sum, song) => sum + durationToSeconds(song.duration), 0);
    const queued = downloads.filter((song) => song.status === "queued").length;

    downloadCount.textContent = String(downloads.length);
    totalSongsCount.textContent = String(downloads.length);
    totalDurationCount.textContent = formatTotalDuration(totalPlayTime);
    queuedCount.textContent = String(queued);
  }

  function renderRows() {
    const list = getFilteredDownloads();
    downloadsRows.innerHTML = "";
    downloadListLabel.textContent = `${list.length} track${list.length === 1 ? "" : "s"} shown`;

    if (!list.length) {
      downloadsRows.innerHTML = `<div class="empty-state">Upload songs to see downloads here.</div>`;
      return;
    }

    list.forEach((song) => {
      const index = downloads.findIndex((entry) => songKey(entry) === songKey(song));
      const row = document.createElement("button");
      row.type = "button";
      row.className = `download-row ${index === currentIndex ? "active" : ""}`;
      const imageStyle = song.coverUrl
        ? ` style="background-image:url('${String(song.coverUrl).replace(/'/g, "\\'")}');background-size:contain;background-position:center;background-repeat:no-repeat;background-color:rgba(255,255,255,0.03);"`
        : "";
      row.innerHTML = `
        <span>${String(index + 1).padStart(2, "0")}</span>
        <span class="download-track">
          <span class="artwork ${song.coverClass || "artwork-a"} download-thumb"${imageStyle}></span>
          <span class="download-copy">
            <strong>${song.title}</strong>
            <p>${song.artist} • ${song.duration}</p>
          </span>
        </span>
        <span class="hidden-mobile">${song.quality}</span>
        <span class="status-pill-inline is-${song.status}">${song.status}</span>
        <span>${song.sizeMb} MB</span>
        <button class="remove-btn" data-song-key="${songKey(song)}" title="Remove from downloads">🗑️</button>
      `;
      row.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) return;
        loadSong(index);
      });
      row.querySelector(".remove-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        removeSong(e.target.dataset.songKey);
      });
      downloadsRows.appendChild(row);
    });
  }

  function setFilter(nextFilter) {
    filterMode = nextFilter;
    filterButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === nextFilter);
    });
    renderRows();
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
  });

  downloadSearch?.addEventListener("input", renderRows);
  playAllBtn?.addEventListener("click", () => {
    if (!downloads.length) return;
    currentIndex = 0;
    loadSong(0);
    todayLabel.textContent = "Playing your full offline queue from the beginning.";
  });

  if (!sharedPlayer) {
    playButton?.addEventListener("click", () => (isPlaying ? pausePlayback() : startPlayback()));
    prevButton?.addEventListener("click", previousSong);
    nextButton?.addEventListener("click", nextSong);
    progress?.addEventListener("input", () => {
      progressValue = Number(progress.value);
      if (audioPlayer.duration && Number.isFinite(audioPlayer.duration)) {
        audioPlayer.currentTime = progressValue;
      }
      currentTime.textContent = formatTime(progressValue);
    });
    volume?.addEventListener("input", () => {
      audioPlayer.volume = Number(volume.value) / 100;
    });
    volumeToggle?.addEventListener("click", () => volumePopover.classList.toggle("open"));
  }
  likeButton?.addEventListener("click", () => {
    const song = downloads[currentIndex];
    if (!song) return;
    if (likedTitles.has(song.title)) likedTitles.delete(song.title);
    else likedTitles.add(song.title);
    syncLikeButton(song.title);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".volume-wrap")) {
      volumePopover?.classList.remove("open");
    }
  });
  window.addEventListener("tunewave-uploads-changed", () => {
    downloads.length = 0;
    downloads.push(...buildDownloads());
    renderStats();
    renderRows();
    if (currentIndex >= downloads.length) {
      currentIndex = Math.max(0, downloads.length - 1);
    }
  });
  window.addEventListener("tunewave-downloads-changed", () => {
    downloads.length = 0;
    downloads.push(...buildDownloads());
    renderStats();
    renderRows();
    if (currentIndex >= downloads.length) {
      currentIndex = Math.max(0, downloads.length - 1);
    }
  });
  window.addEventListener("tunewave-settings-changed", () => {
    downloads.length = 0;
    downloads.push(...buildDownloads());
    renderStats();
    renderRows();
  });

  if (!sharedPlayer) {
    volume.value = "80";
    audioPlayer.volume = 0.8;
  }
  formatGreeting();
  window.setInterval(formatGreeting, 1000);
  downloads.push(...buildDownloads());
  renderStats();
  renderRows();
  if (sharedPlayer) {
    const activeSong = sharedPlayer.getState?.().song;
    const matchedIndex = activeSong ? downloads.findIndex((song) => songKey(song) === songKey(activeSong)) : -1;
    if (matchedIndex >= 0) {
      currentIndex = matchedIndex;
      renderRows();
    }
  }
  if (downloads.length && !sharedPlayer) {
    loadSong(0);
  } else {
    playerTitle.textContent = "No song loaded";
    playerArtist.textContent = "Upload songs to build downloads.";
    duration.textContent = "0:00";
    if (!sharedPlayer) {
      progress.max = "1";
      progress.value = "0";
    }
  }

  if (!sharedPlayer) {
    audioPlayer.addEventListener("timeupdate", () => {
      if (!audioPlayer.duration || !Number.isFinite(audioPlayer.duration)) return;
      progressValue = audioPlayer.currentTime;
      progress.value = String(Math.floor(progressValue));
      currentTime.textContent = formatTime(progressValue);
      duration.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener("ended", nextSong);
  }
});
