export function copyToClipboard(text: string, onSuccess?: () => void) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(console.error);
  } else {
    try {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  }
}
