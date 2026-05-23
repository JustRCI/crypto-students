export const showAlert = (message, type = "primary") => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("show-alert", { detail: { message, type } })
    );
  }
};
