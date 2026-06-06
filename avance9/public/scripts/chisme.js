document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reporteForm");
  const dropzoneElement = document.getElementById("evidenciaDropzone");

  if (!form || !dropzoneElement || typeof Dropzone === "undefined") return;

  Dropzone.autoDiscover = false;

  const evidenciaDropzone = new Dropzone(dropzoneElement, {
    url: form.action,
    paramName: "file",
    autoProcessQueue: false,
    maxFiles: 1,
    maxFilesize: 10,
    acceptedFiles: ".pdf,.jpg,.jpeg,.png",
    addRemoveLinks: true,
    dictDefaultMessage: "",
    dictRemoveFile: "Eliminar archivo"
  });

  form.addEventListener("submit", (event) => {
    if (!evidenciaDropzone.getQueuedFiles().length) return;

    event.preventDefault();
    evidenciaDropzone.processQueue();
  });

  evidenciaDropzone.on("sending", (file, xhr, formData) => {
    formData.append("nombre", form.elements.nombre.value);
    formData.append("mensaje", form.elements.mensaje.value);
  });

  evidenciaDropzone.on("success", () => {
    window.location.assign("/testing");
  });
});
