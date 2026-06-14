document.addEventListener("DOMContentLoaded", () => {
  const SELECTED_ARTIST_KEY = "tunewaveSelectedArtist";
  window.TuneWaveTheme?.applySavedTheme?.();
  const langApi = window.TuneWaveLanguage;
  const sharedPlayer = window.TuneWavePlayer || null;

  const greeting = document.getElementById("greeting");
  const clock = document.getElementById("clock");
  const dateLabel = document.getElementById("dateLabel");
  const todayLabel = document.getElementById("todayLabel");
  const featuredName = document.getElementById("featuredName");
  const featuredBio = document.getElementById("featuredBio");
  const monthlyListeners = document.getElementById("monthlyListeners");
  const genreLabel = document.getElementById("genreLabel");
  const featuredArt = document.getElementById("featuredArt");
  const artistEra = document.getElementById("artistEra");
  const songCountLabel = document.getElementById("songCountLabel");
  const artistSearch = document.getElementById("artistSearch");
  const artistGrid = document.getElementById("artistGrid");
  const artistSongs = document.getElementById("artistSongs");
  const followArtistBtn = document.getElementById("followArtistBtn");
  const shuffleArtistBtn = document.getElementById("shuffleArtistBtn");
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
  const volumeToggle = document.getElementById("artistVolumeToggle");
  const volumePopover = document.getElementById("artistVolumePopover");
  const likeButton = document.getElementById("artistLikeBtn");
  const downloadBtn = document.getElementById("artistDownloadBtn");
  const actionPanel = document.getElementById("artistActionPanel");
  const downloadActionBtn = document.getElementById("artistDownloadActionBtn");
  const saveActionBtn = document.getElementById("artistSaveActionBtn");
  const playlistPanel = document.getElementById("artistPlaylistPanel");
  const playlistOptions = document.getElementById("artistPlaylistOptions");
  const newPlaylistName = document.getElementById("artistNewPlaylistName");
  const createPlaylistBtn = document.getElementById("artistCreatePlaylistBtn");
  const saveToPlaylistBtn = document.getElementById("artistSaveToPlaylistBtn");
  const closePlaylistBtn = document.getElementById("artistClosePlaylistBtn");
  const playlistMsg = document.getElementById("artistPlaylistMsg");
  const artistUploadForm = document.getElementById("artistUploadForm");
  const artistUploadFeedback = document.getElementById("artistUploadFeedback");

  const defaultPlaylists = ["Favorites", "Workout Mix", "Chill Vibes"];
  let artists = [];
  let playlists = [...defaultPlaylists];
  let activeArtistIndex = 0;
  let filteredArtistIndexes = artists.map((_, index) => index);
  let currentSongIndex = 0;
  let isPlaying = false;
  let progressTimer = null;
  let progressValue = 0;
  const likedSongTitles = new Set();
  const followedArtists = new Set();
  const audioPlayer = new Audio();
  audioPlayer.preload = "metadata";

  function readImageFile(file) {
    return new Promise((resolve) => {
      if (!file) {
        resolve("");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(typeof reader.result === "string" ? reader.result : ""));
      reader.addEventListener("error", () => resolve(""));
      reader.readAsDataURL(file);
    });
  }

  async function readImageFiles(files) {
    const fileList = Array.from(files || []).filter(Boolean);
    const images = [];
    for (const file of fileList) {
      const image = await readImageFile(file);
      if (image) images.push(image);
    }
    return images;
  }

  function readAudioFile(file) {
    return new Promise((resolve) => {
      if (!file) {
        resolve("");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(typeof reader.result === "string" ? reader.result : ""));
      reader.addEventListener("error", () => resolve(""));
      reader.readAsDataURL(file);
    });
  }

  function formatAudioDuration(file) {
    return new Promise((resolve) => {
      if (!file) {
        resolve("0:00");
        return;
      }

      const tempAudio = document.createElement("audio");
      const objectUrl = URL.createObjectURL(file);
      tempAudio.src = objectUrl;
      tempAudio.addEventListener("loadedmetadata", () => {
        const totalSeconds = Number.isFinite(tempAudio.duration) ? tempAudio.duration : 0;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
        URL.revokeObjectURL(objectUrl);
        resolve(`${minutes}:${seconds}`);
      });
      tempAudio.addEventListener("error", () => {
        URL.revokeObjectURL(objectUrl);
        resolve("0:00");
      });
    });
  }

  function getUploadedSongs() {
    return window.TuneWaveUploads?.loadSongs?.() || [];
  }

  function splitArtistNames(value) {
    return (window.TuneWaveUploads?.splitArtistNames?.(value) || [])
      .map((name) => String(name || "").trim())
      .filter(Boolean);
  }

  function getArtistImageForSong(song = {}, artistName = "", index = 0) {
    const normalizedName = String(artistName || "").trim().toLowerCase();
    const imageMap = song.artistImageMap && typeof song.artistImageMap === "object" ? song.artistImageMap : {};
    const mappedImage = normalizedName ? String(imageMap[normalizedName] || "").trim() : "";
    if (mappedImage) return mappedImage;

    const imageList = Array.isArray(song.artistImageUrls) ? song.artistImageUrls : [];
    if (imageList[index]) return String(imageList[index] || "").trim();
    return String(song.artistImageUrl || "").trim();
  }

  function upsertSongImageMetadata(songTitle, artistNames, artistImageUrls) {
    const safeTitle = String(songTitle || "").trim().toLowerCase();
    const safeArtist = String(artistNames || "").trim().toLowerCase();
    const orderedNames = splitArtistNames(artistNames);
    const imageMap = {};
    orderedNames.forEach((name, index) => {
      const image = String(artistImageUrls[index] || "").trim();
      if (!image) return;
      imageMap[name.toLowerCase()] = image;
    });

    const songs = window.TuneWaveUploads?.loadSongs?.() || [];
    const updatedSongs = songs.map((song) => {
      const songTitleKey = String(song.title || "").trim().toLowerCase();
      const artistKey = String(song.artist || "").trim().toLowerCase();
      if (songTitleKey !== safeTitle || artistKey !== safeArtist) return song;
      return {
        ...song,
        artistImageUrl: String(song.artistImageUrl || artistImageUrls[0] || "").trim(),
        artistImageUrls: artistImageUrls.slice(),
        artistImageMap: {
          ...(song.artistImageMap || {}),
          ...imageMap
        }
      };
    });

    window.TuneWaveUploads?.saveSongs?.(updatedSongs);
  }

  function getCurrentUserId() {
    if (window.TuneWaveApi) {
      return window.TuneWaveApi.getCurrentUserId();
    }
    return "";
  }

  function createArtistArtworkMarkup(artist) {
    const imageStyle = artist.imageUrl ? ` style="background-image: url('${artist.imageUrl}');"` : "";
    return `<div class="artwork ${artist.coverClass} artist-artwork${artist.imageUrl ? " has-image" : ""}"${imageStyle}></div>`;
  }

  function applyHeroArtwork(artist) {
    featuredArt.className = `hero-artwork artwork ${artist.coverClass}${artist.imageUrl ? " has-image" : ""}`;
    featuredArt.style.backgroundImage = artist.imageUrl ? `url('${artist.imageUrl}')` : "";
    featuredArt.style.backgroundSize = artist.imageUrl ? "cover" : "";
    featuredArt.style.backgroundPosition = artist.imageUrl ? "center" : "";
  }

  function applyPlayerArtwork(artist) {
    playerArtwork.className = `upload-cover artwork ${artist.coverClass}${artist.imageUrl ? " has-image" : ""}`;
    playerArtwork.style.backgroundImage = artist.imageUrl ? `url('${artist.imageUrl}')` : "";
    playerArtwork.style.backgroundSize = artist.imageUrl ? "cover" : "";
    playerArtwork.style.backgroundPosition = artist.imageUrl ? "center" : "";
  }

  function buildArtists() {
    const artistList = [];
    const artistMap = new Map();
    const uploadedSongs = getUploadedSongs();

    uploadedSongs.forEach((song, index) => {
      const artistNames = splitArtistNames(song.artist);
      const songTitle = song.title || `Uploaded Song ${index + 1}`;
      const songDuration = song.duration || "0:00";
      const namesToUse = artistNames.length ? artistNames : [song.artist || "Unknown Artist"];

      namesToUse.forEach((artistName, artistIndex) => {
        const artistImageUrl = getArtistImageForSong(song, artistName, artistIndex);
        const key = artistName.toLowerCase();
        let foundArtist = artistMap.get(key);

        if (!foundArtist) {
          foundArtist = {
            name: artistName,
            genre: song.genre || song.movie || "Uploaded Artist",
            listeners: "Uploaded artist",
            bio: `${artistName} now has uploaded tracks ready to preview in TuneWave.`,
            coverClass: song.coverClass || window.TuneWaveUploads?.getCoverClass?.(index) || "artwork-a",
            era: song.releaseYear || String(new Date().getFullYear()),
            mood: song.genre || song.movie || "Uploaded track",
            tagline: "Fresh artist upload ready to explore.",
            imageUrl: artistImageUrl || "",
            songs: []
          };
          artistMap.set(key, foundArtist);
          artistList.push(foundArtist);
        }

        if (artistImageUrl && !foundArtist.imageUrl) {
          foundArtist.imageUrl = artistImageUrl;
        }

        const songAlreadyExists = foundArtist.songs.some((entry) => {
          return String(entry.title || "").trim().toLowerCase() === songTitle.toLowerCase();
        });

        if (!songAlreadyExists) {
          foundArtist.songs.unshift({
            title: songTitle,
            duration: songDuration,
            audioUrl: song.audioUrl || "",
            coverUrl: song.coverUrl || "",
            artistImageUrl,
            coverClass: song.coverClass || foundArtist.coverClass,
            movie: song.movie || "Single"
          });
        }
      });
    });

    return artistList;
  }

  function getProfileName() {
    return window.TuneWaveProfile?.loadProfile().name || "Listener";
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
    todayLabel.textContent = langApi?.translateText(`Explore artist profiles, top songs, and standout moments for your ${weekday.toLowerCase()} listening.`) || `Explore artist profiles, top songs, and standout moments for your ${weekday.toLowerCase()} listening.`;
  }

  function getCurrentArtist() {
    return artists[activeArtistIndex] || null;
  }

  function getCurrentSong() {
    const artist = getCurrentArtist();
    return artist?.songs[currentSongIndex] || null;
  }

  function getCurrentSongSource() {
    const song = getCurrentSong();
    return song?.audioUrl || "";
  }

  function getCurrentArtistQueue() {
    const artist = getCurrentArtist();
    if (!artist?.songs?.length) return [];
    return artist.songs.map((song) => ({
      ...song,
      artist: artist.name,
      movie: song.movie || artist.genre || "Single",
      coverClass: song.coverClass || artist.coverClass,
      coverUrl: song.coverUrl || artist.imageUrl || "",
      artistImageUrl: song.artistImageUrl || artist.imageUrl || ""
    }));
  }

  function buildTrackPayload() {
    const artist = getCurrentArtist();
    const song = getCurrentSong();
    if (!artist || !song) return null;
    return {
      title: song.title,
      artist: artist.name,
      duration: song.duration,
      mood: artist.genre,
      coverClass: artist.coverClass,
      imageUrl: artist.imageUrl || ""
    };
  }

  function toTimestamp(progressPercent) {
    const totalSeconds = Math.max(0, Math.floor(progressPercent || 0));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function getSongDurationSeconds(song = getCurrentSong()) {
    const parts = String(song?.duration || "0:00")
      .split(":")
      .map((part) => Number.parseInt(part, 10) || 0);
    if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    if (parts.length === 2) return (parts[0] * 60) + parts[1];
    return parts[0] || 0;
  }

  function syncLikeButton(songTitle) {
    const liked = likedSongTitles.has(songTitle);
    likeButton.classList.toggle("active", liked);
    likeButton.querySelector(".like-label").textContent = liked ? "Liked" : "Like";
    likeButton.querySelector(".heart-icon").textContent = liked ? "♥" : "♡";
  }

  function syncFollowButton() {
    const artist = getCurrentArtist();
    if (!artist || !followArtistBtn) return;
    const followed = followedArtists.has(artist.name);
    followArtistBtn.textContent = followed ? "Following" : "Follow Artist";
    followArtistBtn.classList.toggle("secondary", followed);
  }

  function animateLikeButton() {
    likeButton.classList.remove("like-pop");
    void likeButton.offsetWidth;
    likeButton.classList.add("like-pop");
  }

  function startPlayback() {
    if (sharedPlayer) {
      const queue = getCurrentArtistQueue();
      if (!queue.length) return;
      isPlaying = true;
      playButton.textContent = "⏸";
      sharedPlayer.setQueue?.(queue, { startIndex: currentSongIndex, autoPlay: true });
      return;
    }
    isPlaying = true;
    playButton.textContent = "⏸";
    clearInterval(progressTimer);
    const source = getCurrentSongSource();
    if (source) {
      audioPlayer.play().catch(() => {
        pausePlayback();
      });
      return;
    }
    const durationSeconds = Math.max(getSongDurationSeconds(), 1);
    progressTimer = window.setInterval(() => {
      progressValue = Math.min(progressValue + 0.45, durationSeconds);
      progress.value = progressValue;
      currentTime.textContent = toTimestamp(progressValue);
      if (progressValue >= durationSeconds) nextSong();
    }, 300);
  }

  function pausePlayback() {
    if (sharedPlayer) {
      isPlaying = false;
      playButton.textContent = "▶";
      sharedPlayer.pause?.();
      return;
    }
    isPlaying = false;
    playButton.textContent = "▶";
    clearInterval(progressTimer);
    audioPlayer.pause();
  }

  function highlightSongRow() {
    const rows = artistSongs.querySelectorAll(".song-row");
    rows.forEach((row, index) => row.classList.toggle("active", index === currentSongIndex));
  }

  function loadSong(index, shouldAutoplay = true) {
    const artist = getCurrentArtist();
    const song = artist?.songs[index];
    if (!song) return;

    currentSongIndex = index;
    playerTitle.textContent = song.title;
    playerArtist.textContent = artist.name;
    applyPlayerArtwork(artist);
    duration.textContent = song.duration;
    progress.max = String(Math.max(getSongDurationSeconds(song), 1));
    progressValue = 0;
    progress.value = 0;
    currentTime.textContent = "0:00";
    syncLikeButton(song.title);
    highlightSongRow();
    if (sharedPlayer) {
      const queue = getCurrentArtistQueue();
      sharedPlayer.setQueue?.(queue, { startIndex: index, autoPlay: shouldAutoplay });
      if (!shouldAutoplay) {
        playButton.textContent = "▶";
      }
      return;
    }
    const source = song.audioUrl || "";
    if (source) {
      if (audioPlayer.src !== source) {
        audioPlayer.src = source;
      }
    } else {
      audioPlayer.pause();
      audioPlayer.removeAttribute("src");
      audioPlayer.load();
    }
    if (shouldAutoplay) {
      startPlayback();
    }
  }

  function updateFeaturedArtist() {
    const artist = getCurrentArtist();
    if (!artist) {
      featuredName.textContent = "No artists yet";
      featuredBio.textContent = "Upload songs with artist names to create artist folders automatically.";
      monthlyListeners.textContent = "0";
      genreLabel.textContent = "Uploaded Artist";
      artistEra.textContent = "--";
      songCountLabel.textContent = "0 songs available";
      featuredArt.className = "hero-artwork artwork artwork-a";
      featuredArt.style.backgroundImage = "";
      artistSongs.innerHTML = `<p class="muted">Upload songs to create artist folders.</p>`;
      playerTitle.textContent = "No song loaded";
      playerArtist.textContent = "Upload a track to preview it here.";
      return;
    }

    featuredName.textContent = artist.name;
    featuredBio.textContent = artist.bio;
    monthlyListeners.textContent = artist.listeners;
    genreLabel.textContent = artist.genre;
    artistEra.textContent = artist.era;
    applyHeroArtwork(artist);
    songCountLabel.textContent = `${artist.songs.length} songs available`;
    syncFollowButton();

    artistSongs.innerHTML = "";
    artist.songs.forEach((song, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = `song-row ${index === currentSongIndex ? "active" : ""}`;
      row.innerHTML = `
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${song.title}</strong>
          <p>${artist.name}</p>
        </div>
        <span class="muted">${song.duration}</span>
      `;
      row.addEventListener("click", () => loadSong(index));
      artistSongs.appendChild(row);
    });

    if (!sharedPlayer) {
      loadSong(currentSongIndex, false);
    } else {
      highlightSongRow();
      syncLikeButton(getCurrentSong()?.title || "");
    }
  }

  function renderArtists() {
    artistGrid.innerHTML = "";

    if (!filteredArtistIndexes.length) {
      artistGrid.innerHTML = `<p class="muted">No artists found.</p>`;
      artistSongs.innerHTML = "";
      return;
    }

    filteredArtistIndexes.forEach((artistIndex) => {
      const artist = artists[artistIndex];
      const card = document.createElement("div");
      card.className = `artist-card-wrapper ${artistIndex === activeArtistIndex ? "active" : ""}`;
      card.innerHTML = `
        <button type="button" class="artist-card" data-artist-name="${artist.name}">
          ${createArtistArtworkMarkup(artist)}
          <div>
            <h3>${artist.name}</h3>
          </div>
        </button>
      `;
      const artistBtn = card.querySelector('.artist-card');
      artistBtn.addEventListener("click", () => {
        activeArtistIndex = artistIndex;
        currentSongIndex = 0;
        updateFeaturedArtist();
        renderArtists();
        if (sharedPlayer) {
          loadSong(currentSongIndex, false);
        }
      });
      card.addEventListener("dblclick", async () => {
        const confirmed = await window.TuneWaveDeleteModal?.confirm('artist', artist.name) || false;
        if (confirmed) {
          try {
            await fetch(`${window.TuneWaveApi?.baseUrl || 'http://127.0.0.1:8080'}/deleteArtist?name=${encodeURIComponent(artist.name)}&user_id=${window.TuneWaveApi?.getCurrentUserId() || 1}`);
            window.dispatchEvent(new CustomEvent("tunewave-uploads-changed"));
          } catch (e) { console.warn('Delete failed:', e); }
        }
      });
      artistGrid.appendChild(card);
    });
  }

  function nextSong() {
    if (sharedPlayer) {
      sharedPlayer.next?.();
      return;
    }
    const artist = getCurrentArtist();
    if (!artist) return;
    currentSongIndex = (currentSongIndex + 1) % artist.songs.length;
    loadSong(currentSongIndex);
  }

  function previousSong() {
    if (sharedPlayer) {
      sharedPlayer.previous?.();
      return;
    }
    const artist = getCurrentArtist();
    if (!artist) return;
    currentSongIndex = (currentSongIndex - 1 + artist.songs.length) % artist.songs.length;
    loadSong(currentSongIndex);
  }

  function filterArtists(queryText) {
    const query = queryText.trim().toLowerCase();
    filteredArtistIndexes = artists
      .map((artist, index) => ({ artist, index }))
      .filter(({ artist }) => !query || `${artist.name} ${artist.genre} ${artist.mood}`.toLowerCase().includes(query))
      .map(({ index }) => index);

    if (filteredArtistIndexes.length && !filteredArtistIndexes.includes(activeArtistIndex)) {
      activeArtistIndex = filteredArtistIndexes[0];
      currentSongIndex = 0;
      updateFeaturedArtist();
    }

    renderArtists();
  }

  function refreshArtistPage(artistName) {
    artists = buildArtists();
    filteredArtistIndexes = artists.map((_, index) => index);

    if (artistName) {
      for (let i = 0; i < artists.length; i += 1) {
        if (artists[i].name.toLowerCase() === artistName.toLowerCase()) {
          activeArtistIndex = i;
          break;
        }
      }
    }

    currentSongIndex = 0;
    updateFeaturedArtist();
    renderArtists();
  }

  async function submitArtistUpload(event) {
    event.preventDefault();
    let backendMessage = "";

    const artistName = document.getElementById("newArtistName").value.trim();
    const genre = document.getElementById("newArtistGenre").value.trim();
    const songTitle = document.getElementById("newArtistSongTitle").value.trim();
    const releaseYear = document.getElementById("newArtistReleaseYear").value.trim();
    const artistPhotoFiles = document.getElementById("newArtistPhoto").files;
    const songFile = document.getElementById("newArtistSongFile").files?.[0];
    const songCoverFile = document.getElementById("newArtistSongCover").files?.[0];

    if (!artistName || !songTitle || !songFile) {
      artistUploadFeedback.textContent = "Add artist name, song title, and song file first.";
      return;
    }

    const artistImageUrls = await readImageFiles(artistPhotoFiles);
    const artistImageUrl = artistImageUrls[0] || "";
    const coverUrl = await readImageFile(songCoverFile);
    const audioDataUrl = await readAudioFile(songFile);
    const duration = await formatAudioDuration(songFile);

    const formData = new URLSearchParams();
    const currentUserId = String(getCurrentUserId() || "").trim();
    if (!currentUserId) {
      artistUploadFeedback.textContent = "Please log in again before uploading songs.";
      return;
    }
    formData.append("title", songTitle);
    formData.append("artist", artistName);
    formData.append("lyricist", "");
    formData.append("music_by", "");
    formData.append("release_year", releaseYear || String(new Date().getFullYear()));
    formData.append("genre", genre || "Uploaded Artist");
    formData.append("uploaded_by", currentUserId);
    formData.append("file_path", audioDataUrl);
    formData.append("cover_path", coverUrl);
    formData.append("artist_image_path", artistImageUrl);

    try {
      const response = await fetch(window.TuneWaveApi.endpoint("/uploadSong"), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });
      const text = await response.text();
      if (!text.startsWith("Song uploaded successfully")) {
        backendMessage = text;
      } else {
        await window.TuneWaveUploads?.syncFromBackend?.();
        upsertSongImageMetadata(songTitle, artistName, artistImageUrls);
      }
    } catch (error) {
      backendMessage = "Artist upload could not be saved because the backend connection failed.";
    }

    artistUploadForm.reset();
    if (backendMessage) {
      artistUploadFeedback.textContent = backendMessage;
    } else {
      artistUploadFeedback.textContent = `${artistName} was added with ${songTitle}.`;
    }
    refreshArtistPage(artistName);
  }

  function openActionPanel() {
    if (!actionPanel) return;
    closePlaylistPanel();
    actionPanel.classList.add("open");
    actionPanel.setAttribute("aria-hidden", "false");
  }

  function closeActionPanel() {
    if (!actionPanel) return;
    actionPanel.classList.remove("open");
    actionPanel.setAttribute("aria-hidden", "true");
  }

  function renderPlaylistOptions() {
    playlistOptions.innerHTML = "";
    playlists.forEach((playlistName) => {
      const label = document.createElement("label");
      label.className = "playlist-option";
      label.innerHTML = `
        <input type="checkbox" value="${playlistName}">
        <span class="playlist-check" aria-hidden="true"></span>
        <span class="playlist-option-copy">
          <strong>${playlistName}</strong>
          <span>Ready for backend save</span>
        </span>
      `;
      playlistOptions.appendChild(label);
    });
  }

  function openPlaylistPanel() {
    closeActionPanel();
    renderPlaylistOptions();
    playlistPanel.classList.add("open");
    playlistPanel.setAttribute("aria-hidden", "false");
    playlistMsg.textContent = "";
  }

  function closePlaylistPanel() {
    playlistPanel.classList.remove("open");
    playlistPanel.setAttribute("aria-hidden", "true");
    playlistMsg.textContent = "";
  }

  function createNewPlaylist() {
    const name = newPlaylistName.value.trim();
    if (!name) {
      playlistMsg.textContent = "Enter a playlist name.";
      return;
    }

    if (playlists.some((playlist) => playlist.toLowerCase() === name.toLowerCase())) {
      playlistMsg.textContent = "That playlist already exists.";
      return;
    }

    playlists.push(name);
    newPlaylistName.value = "";
    playlistMsg.textContent = "Playlist created for this page session.";
    renderPlaylistOptions();
  }

  function saveCurrentSongToSelectedPlaylists() {
    const track = buildTrackPayload();
    const selected = Array.from(playlistOptions.querySelectorAll("input[type='checkbox']:checked")).map((input) => input.value);

    if (!track) {
      playlistMsg.textContent = "No song is currently selected.";
      return;
    }

    if (!selected.length) {
      playlistMsg.textContent = "Select at least one playlist.";
      return;
    }

    playlistMsg.textContent = `"${track.title}" added to ${selected.length} playlist${selected.length === 1 ? "" : "s"} for this session.`;
  }

  function downloadCurrentSongMetadata() {
    const track = buildTrackPayload();
    if (!track) return;

    const content = [
      "TuneWave Download (preview)",
      `Title: ${track.title}`,
      `Artist: ${track.artist}`,
      `Duration: ${track.duration}`,
      `Mood: ${track.mood}`
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${track.title}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (!sharedPlayer) {
    playButton?.addEventListener("click", () => (isPlaying ? pausePlayback() : startPlayback()));
    prevButton?.addEventListener("click", previousSong);
    nextButton?.addEventListener("click", nextSong);
    progress?.addEventListener("input", () => {
      progressValue = Number(progress.value);
      const source = getCurrentSongSource();
      if (source && audioPlayer.duration && Number.isFinite(audioPlayer.duration)) {
        audioPlayer.currentTime = Math.min(progressValue, audioPlayer.duration);
      }
      currentTime.textContent = toTimestamp(progressValue);
    });
    volume?.addEventListener("input", () => {
      audioPlayer.volume = Number(volume.value) / 100;
    });
  }
  if (!sharedPlayer) {
    volumeToggle?.addEventListener("click", () => volumePopover.classList.toggle("open"));
  }
  if (!sharedPlayer) {
    likeButton?.addEventListener("click", () => {
      const song = getCurrentSong();
      if (!song) return;
      if (likedSongTitles.has(song.title)) likedSongTitles.delete(song.title);
      else {
        likedSongTitles.add(song.title);
        animateLikeButton();
      }
      syncLikeButton(song.title);
    });
  }
  followArtistBtn?.addEventListener("click", () => {
    const artist = getCurrentArtist();
    if (!artist) return;
    if (followedArtists.has(artist.name)) followedArtists.delete(artist.name);
    else followedArtists.add(artist.name);
    syncFollowButton();
  });
  shuffleArtistBtn?.addEventListener("click", () => {
    const artist = getCurrentArtist();
    if (!artist?.songs.length) return;
    currentSongIndex = Math.floor(Math.random() * artist.songs.length);
    loadSong(currentSongIndex);
  });
  downloadBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    downloadCurrentSongMetadata();
  });
  downloadActionBtn?.addEventListener("click", () => {
    closeActionPanel();
    downloadCurrentSongMetadata();
  });
  saveActionBtn?.addEventListener("click", openPlaylistPanel);
  saveToPlaylistBtn?.addEventListener("click", saveCurrentSongToSelectedPlaylists);
  closePlaylistBtn?.addEventListener("click", closePlaylistPanel);
  createPlaylistBtn?.addEventListener("click", createNewPlaylist);
  artistSearch?.addEventListener("input", (event) => filterArtists(event.target.value));
  artistUploadForm?.addEventListener("submit", submitArtistUpload);
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".volume-wrap")) {
      volumePopover?.classList.remove("open");
    }

    const clickedTrigger = event.target.closest("#artistDownloadBtn");
    const clickedAction = event.target.closest("#artistActionPanel");
    const clickedPlaylist = event.target.closest("#artistPlaylistPanel");
    if (actionPanel?.classList.contains("open") && !clickedAction && !clickedTrigger) closeActionPanel();
    if (playlistPanel?.classList.contains("open") && !clickedPlaylist && !clickedTrigger) closePlaylistPanel();
  });

  artists = buildArtists();
  filteredArtistIndexes = artists.map((_, index) => index);
  const selectedArtistName = window.localStorage.getItem(SELECTED_ARTIST_KEY) || "";
  if (selectedArtistName) {
    window.localStorage.removeItem(SELECTED_ARTIST_KEY);
    refreshArtistPage(selectedArtistName);
  }
  formatGreeting();
  window.setInterval(formatGreeting, 1000);
  window.addEventListener("tunewave-profile-updated", formatGreeting);
  window.addEventListener("tunewave-uploads-changed", () => {
    activeArtistIndex = Math.min(activeArtistIndex, Math.max(artists.length - 1, 0));
    refreshArtistPage();
  });
  window.addEventListener("tunewave-player-changed", (event) => {
    const activeSong = event.detail?.song;
    if (!activeSong) return;
    for (let artistIndex = 0; artistIndex < artists.length; artistIndex += 1) {
      const songIndex = artists[artistIndex].songs.findIndex((song) => (
        String(song.title || "").trim().toLowerCase() === String(activeSong.title || "").trim().toLowerCase()
        && String(artists[artistIndex].name || "").trim().toLowerCase() === String(activeSong.artist || "").trim().toLowerCase()
      ));
      if (songIndex >= 0) {
        activeArtistIndex = artistIndex;
        currentSongIndex = songIndex;
        isPlaying = !!event.detail?.isPlaying;
        playButton.textContent = isPlaying ? "⏸" : "▶";
        updateFeaturedArtist();
        renderArtists();
        break;
      }
    }
  });
  if (sharedPlayer) {
    const activeSong = sharedPlayer.getState?.().song;
    if (activeSong) {
      for (let artistIndex = 0; artistIndex < artists.length; artistIndex += 1) {
        const songIndex = artists[artistIndex].songs.findIndex((song) => (
          String(song.title || "").trim().toLowerCase() === String(activeSong.title || "").trim().toLowerCase()
          && String(artists[artistIndex].name || "").trim().toLowerCase() === String(activeSong.artist || "").trim().toLowerCase()
        ));
        if (songIndex >= 0) {
          activeArtistIndex = artistIndex;
          currentSongIndex = songIndex;
          break;
        }
      }
    }
  }
  updateFeaturedArtist();
  renderArtists();

  if (!sharedPlayer) {
    volume.value = "80";
    audioPlayer.volume = 0.8;
    audioPlayer.addEventListener("timeupdate", () => {
      if (!audioPlayer.duration || !Number.isFinite(audioPlayer.duration)) return;
      progress.max = String(Math.max(Math.floor(audioPlayer.duration), 1));
      progressValue = audioPlayer.currentTime;
      progress.value = progressValue;
      currentTime.textContent = toTimestamp(progressValue);
      duration.textContent = toTimestamp(audioPlayer.duration);
    });

    audioPlayer.addEventListener("ended", nextSong);
  }
});
