(() => {
  const OVERLAY_ID = "deleteOverlay";
  let activeResolve = null;

  function ensureModal() {
    let overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = OVERLAY_ID;
      overlay.className = "delete-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML = `
        <div class="delete-popup" role="document">
          <h2 class="delete-title" id="deleteTitle">Delete Item</h2>
          <p class="delete-message" id="deleteMessage">Do you want to delete this item?</p>
          <div class="delete-buttons">
            <button id="deleteCancel" class="delete-btn delete-cancel" type="button">No</button>
            <button id="deleteConfirm" class="delete-btn delete-confirm" type="button">Yes, delete</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const title = overlay.querySelector("#deleteTitle");
    const message = overlay.querySelector("#deleteMessage");
    const cancelButton = overlay.querySelector("#deleteCancel");
    const confirmButton = overlay.querySelector("#deleteConfirm");

    function finish(result) {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      if (activeResolve) {
        const resolve = activeResolve;
        activeResolve = null;
        resolve(result);
      }
    }

    cancelButton.onclick = () => finish(false);
    confirmButton.onclick = () => finish(true);
    overlay.onclick = (event) => {
      if (event.target === overlay) finish(false);
    };

    return { overlay, title, message, finish };
  }

  function formatDeleteCopy(kind, name) {
    const label = String(name || "this item").trim() || "this item";
    const normalizedKind = String(kind || "item").trim().toLowerCase();

    if (normalizedKind === "artist") {
      return {
        title: "Delete Artist",
        message: `Do you want to delete "${label}" and that artist's songs?`
      };
    }

    if (normalizedKind === "playlist") {
      return {
        title: "Delete Playlist Song",
        message: `Do you want to delete "${label}" from this playlist section?`
      };
    }

    return {
      title: "Delete Song",
      message: `Do you want to delete "${label}"?`
    };
  }

  async function confirm(kind, name) {
    const refs = ensureModal();
    const copy = formatDeleteCopy(kind, name);

    if (activeResolve) {
      refs.finish(false);
    }

    refs.title.textContent = copy.title;
    refs.message.textContent = copy.message;
    refs.overlay.classList.add("open");
    refs.overlay.setAttribute("aria-hidden", "false");

    return new Promise((resolve) => {
      activeResolve = resolve;
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay || !overlay.classList.contains("open")) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    if (activeResolve) {
      const resolve = activeResolve;
      activeResolve = null;
      resolve(false);
    }
  });

  window.TuneWaveDeleteModal = {
    confirm
  };
})();
