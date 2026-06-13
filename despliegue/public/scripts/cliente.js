if (typeof Dropzone !== "undefined") {
  Dropzone.autoDiscover = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("clienteDocumentoForm");
  const dropzoneElement = document.getElementById("clienteDocumentoDropzone");

  if (!form || !dropzoneElement || typeof Dropzone === "undefined") return;

  const documentoDropzone = new Dropzone(dropzoneElement, {
    url: form.action,
    paramName: "file",
    autoProcessQueue: false,
    maxFiles: 1,
    maxFilesize: 10,
    acceptedFiles: ".pdf,.jpg,.jpeg,.png",
    addRemoveLinks: true,
    dictDefaultMessage: "Arrastra el documento o haz clic para seleccionarlo",
    dictRemoveFile: "Eliminar archivo",
    dictMaxFilesExceeded: "Solo puedes subir un archivo"
  });

  form.addEventListener("submit", (event) => {
    if (!documentoDropzone.getQueuedFiles().length) return;

    event.preventDefault();
    documentoDropzone.processQueue();
  });

  documentoDropzone.on("sending", (file, xhr, formData) => {
    formData.append("nombre", form.elements.nombre.value);
    formData.append("rfc", form.elements.rfc.value);
    formData.append("curp", form.elements.curp.value);
  });

  documentoDropzone.on("success", () => {
    window.location.assign("/testing?enviado=true");
  });
});
