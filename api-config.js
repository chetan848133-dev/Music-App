window.TuneWaveApi = {
  baseUrl: "http://127.0.0.1:8080",
  offlineAccountsKey: "tunewaveOfflineAccounts",

  endpoint(path) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${this.baseUrl}${cleanPath}`;
  },

  getCurrentUserId() {
    const rawValue = String(window.localStorage.getItem("tunewaveCurrentUserId") || "").trim();
    return /^\d+$/.test(rawValue) && Number(rawValue) > 0 ? rawValue : "";
  },

  getCurrentUsername() {
    return window.localStorage.getItem("tunewaveCurrentUsername") || "Listener";
  },

  saveCurrentUser(id, username) {
    window.localStorage.setItem("tunewaveCurrentUserId", String(id));
    window.localStorage.setItem("tunewaveCurrentUsername", username || "Listener");
  },

  normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  },

  loadOfflineAccounts() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(this.offlineAccountsKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  },

  saveOfflineAccounts(accounts) {
    try {
      window.localStorage.setItem(this.offlineAccountsKey, JSON.stringify(Array.isArray(accounts) ? accounts : []));
    } catch (error) {
      // Ignore local storage failures.
    }
  },

  getNextOfflineUserId() {
    const accounts = this.loadOfflineAccounts();
    const maxId = accounts.reduce((currentMax, account) => {
      const id = Number(account?.id) || 0;
      return Math.max(currentMax, id);
    }, 999999);
    return maxId + 1;
  },

  findOfflineAccount(email) {
    const normalizedEmail = this.normalizeEmail(email);
    if (!normalizedEmail) return null;
    return this.loadOfflineAccounts().find((account) => this.normalizeEmail(account?.email) === normalizedEmail) || null;
  },

  upsertOfflineAccount(account) {
    const normalizedEmail = this.normalizeEmail(account?.email);
    if (!normalizedEmail) return null;

    const accounts = this.loadOfflineAccounts();
    const nextAccount = {
      id: Number(account?.id) || this.getNextOfflineUserId(),
      username: String(account?.username || account?.fullName || "Listener").trim(),
      fullName: String(account?.fullName || account?.username || "Listener").trim(),
      email: normalizedEmail,
      phone: String(account?.phone || "").trim(),
      password: String(account?.password || "").trim(),
      image: String(account?.image || "").trim(),
      createdAt: String(account?.createdAt || new Date().toISOString())
    };

    const existingIndex = accounts.findIndex((entry) => this.normalizeEmail(entry?.email) === normalizedEmail);
    if (existingIndex >= 0) {
      accounts[existingIndex] = {
        ...accounts[existingIndex],
        ...nextAccount,
        id: Number(accounts[existingIndex]?.id) || nextAccount.id,
        createdAt: accounts[existingIndex]?.createdAt || nextAccount.createdAt
      };
    } else {
      accounts.push(nextAccount);
    }

    this.saveOfflineAccounts(accounts);
    return existingIndex >= 0 ? accounts[existingIndex] : nextAccount;
  },

  signupOffline({ username, fullName, email, phone, password, image }) {
    const normalizedEmail = this.normalizeEmail(email);
    if (!normalizedEmail) {
      return { ok: false, message: "Enter a valid email first." };
    }
    if (this.findOfflineAccount(normalizedEmail)) {
      return { ok: false, message: "An offline account with this email already exists." };
    }
    const account = this.upsertOfflineAccount({
      username,
      fullName,
      email: normalizedEmail,
      phone,
      password,
      image
    });
    return { ok: true, account };
  },

  loginOffline({ email, password }) {
    const account = this.findOfflineAccount(email);
    if (!account) {
      return { ok: false, message: "No saved offline account was found for this email." };
    }
    if (String(account.password || "") !== String(password || "")) {
      return { ok: false, message: "Incorrect password for the saved offline account." };
    }
    return { ok: true, account };
  },

  resetOfflinePassword({ name, email, phone, password }) {
    const normalizedEmail = this.normalizeEmail(email);
    const normalizedName = String(name || "").trim().toLowerCase();
    const normalizedPhone = String(phone || "").trim();
    const accounts = this.loadOfflineAccounts();
    const accountIndex = accounts.findIndex((account) => {
      const emailMatch = this.normalizeEmail(account?.email) === normalizedEmail;
      const phoneMatch = String(account?.phone || "").trim() === normalizedPhone;
      const nameMatch = [account?.fullName, account?.username]
        .map((value) => String(value || "").trim().toLowerCase())
        .includes(normalizedName);
      return emailMatch && phoneMatch && nameMatch;
    });

    if (accountIndex < 0) {
      return { ok: false, message: "No matching offline account was found for those details." };
    }

    accounts[accountIndex] = {
      ...accounts[accountIndex],
      password: String(password || "")
    };
    this.saveOfflineAccounts(accounts);
    return { ok: true, account: accounts[accountIndex] };
  }
};
