document.addEventListener("DOMContentLoaded", () => {
  if (window.TuneWaveTheme && window.TuneWaveTheme.applySavedTheme) {
    window.TuneWaveTheme.applySavedTheme();
  }

  const form = document.getElementById("forgotPasswordForm");
  const recoveryName = document.getElementById("recoveryName");
  const recoveryEmail = document.getElementById("recoveryEmail");
  const recoveryPhone = document.getElementById("recoveryPhone");
  const newPassword = document.getElementById("newPassword");
  const confirmNewPassword = document.getElementById("confirmNewPassword");
  const forgotMessage = document.getElementById("forgotMessage");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = recoveryName ? recoveryName.value.trim() : "";
    const email = recoveryEmail ? recoveryEmail.value.trim() : "";
    const phone = recoveryPhone ? recoveryPhone.value.trim() : "";
    const password = newPassword ? newPassword.value : "";
    const confirm = confirmNewPassword ? confirmNewPassword.value : "";

    if (!name || !email || !phone) {
      forgotMessage.textContent = "Fill in name, email, and phone number first.";
      return;
    }

    if (!password || !confirm) {
      forgotMessage.textContent = "Enter the new password in both fields.";
      return;
    }

    if (password !== confirm) {
      forgotMessage.textContent = "Passwords do not match.";
      return;
    }

    const data = new URLSearchParams();
    data.append("name", name);
    data.append("email", email);
    data.append("phone", phone);
    data.append("password", password);

    fetch(window.TuneWaveApi.endpoint("/resetPassword"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString()
    })
      .then((response) => response.text())
      .then((text) => {
        forgotMessage.textContent = text;
      })
      .catch(() => {
        const offlineResult = window.TuneWaveApi?.resetOfflinePassword?.({
          name,
          email,
          phone,
          password
        });
        forgotMessage.textContent = offlineResult?.ok
          ? "Backend offline. Password was updated for your saved offline account."
          : offlineResult?.message || "Backend is offline and no saved offline account matched those details.";
      });
  });
});
