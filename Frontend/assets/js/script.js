/**
 * Écouteur d'événements pour l'événement DOMContentLoaded.
 * Gère l'affichage et la fonctionnalité des boutons de connexion/déconnexion et des modales.
 */
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const banner = document.getElementById("banner");
  const login = document.getElementById("login");
  const logout = document.getElementById("logout");
  const editModale = document.getElementById("editModaleBtn");
  const filters = document.getElementById("filters");

  /**
   * Vérifie si un jeton est présent dans le stockage local et met à jour l'affichage des boutons de connexion/déconnexion et des modales.
   */
  function CheckToken() {
    if (localStorage.getItem("token")) {
      banner.style.display = "flex";
      login.style.display = "none";
      logout.style.display = "block";
      editModale.style.display = "flex";
      filters.style.display = "none";
    } else {
      banner.style.display = "none";
      login.style.display = "block";
      logout.style.display = "none";
      editModale.style.display = "none";
      filters.style.display = "flex";
    }
  }
  CheckToken();

  logout.addEventListener("click", function () {
    if (token) {
      localStorage.removeItem("token");
      CheckToken();
      getFilters();
    }
  });

  /**Fgetfilters
   * Récupère la liste des filtres à partir du serveur et les affiche.
   */
  async function getFilters() {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();

    const filters = document.getElementById("filters");
    const allButton = createFilterButton("0", "Tous");
    allButton.classList.add("filter-button");
    allButton.classList.add("active");
    filters.appendChild(allButton);

    data.forEach((item) => {
      const button = createFilterButton(item.id, item.name);
      button.classList.add("filter-button");
      filters.appendChild(button);
    });

    filters.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        const categoryId = Number(event.target.value);
        getWorks(categoryId);
        setActiveFilter(event.target);
      }
    });
  }

  if (!localStorage.getItem("token")) {
    getFilters();
  }

  /**
   * Crée un bouton de filtre avec un texte et une valeur spécifiques.
   * @param {string} value - La valeur du bouton de filtre.
   * @param {string} text - Le texte affiché sur le bouton de filtre.
   * @returns {HTMLButtonElement} - Le bouton de filtre créé.
   */
  function createFilterButton(value, text) {
    const button = document.createElement("button");
    button.className = "filter-option";
    button.textContent = text;
    button.value = value;
    return button;
  }
});
/**
 * Écouteur d'événements pour l'événement DOMContentLoaded.
 * Récupère la liste des travaux et les affiche dans la galerie.
 */

document.addEventListener("DOMContentLoaded", () => {
  getWorks(0).then(() => console.log("Travaux chargés"));
});

/**
 * Récupère la liste des travaux à partir du serveur et les affiche dans la galerie.
 * @param {number} categoryId - L'ID de la catégorie pour filtrer les travaux.
 * @returns {Promise<void>}
 */
async function getWorks(categoryId = 0) {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();

    const gallery = document.querySelector(".gallery");
    const modalContent = document.querySelector(".modalContent");
    gallery.innerHTML = "";
    modalContent.innerHTML = "";

    const figureModal = document.createElement("figure");
    data.forEach(({ id, imageUrl, title }) => {
      const figure_modal = document.createElement("figure");
      const img = document.createElement("img");
      const trash = document.createElement("i");
      const trashContainer = document.createElement("div");

      trash.className = "fas fa-trash-alt fa-sm";
      img.src = imageUrl;
      img.alt = title;
      img.classList = "imgModal";

      trashContainer.appendChild(trash);

      figure_modal.appendChild(img);
      figure_modal.appendChild(trashContainer);
      modalContent.appendChild(figure_modal);

      trash.addEventListener("click", async function (e) {
        e.preventDefault();
        try {
          await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          getWorks(categoryId);
        } catch (error) {
          console.error(error);
        }
      });
    });

    modalContent.appendChild(figureModal);

    const filterData = data.filter(
      (work) => work.categoryId === Number(categoryId) || categoryId === 0
    );

    const figures = filterData.map(({ imageUrl, title }) => {
      const figure = document.createElement("figure");
      figure.innerHTML += `
        <img src="${imageUrl}" alt="${title}" />
        <figcaption>${title}</figcaption>
      `;
      return figure;
    });

    figures.forEach((figure) => gallery.appendChild(figure));
  } catch (error) {
    console.error(error);
  }
}

/**
 * Met le bouton de filtre actif.
 * @param {HTMLButtonElement} button - Le bouton de filtre à mettre actif.
 */
function setActiveFilter(button) {
  document
    .querySelectorAll(".filter-option")
    .forEach((b) => b.classList.remove("active"));
  button.classList.add("active");
}

/**
 * Écouteur d'événements pour l'événement DOMContentLoaded.
 * Gère l'affichage et la fonctionnalité des modales d'édition et d'ajout.
 */
document.addEventListener("DOMContentLoaded", () => {
  function resetModale() {
    const fileupload = document.getElementById("file-upload");
    const basePreview = document.getElementById("basePreview");
    const previewContainer = document.getElementById("previewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const uploadForm = document.getElementById("uploadForm");

    uploadForm.reset();
    imagePreview.src = "";
    imagePreview.innerHTML = "";
    fileupload.style.display = "flex";
    basePreview.classList.remove("hidden");
    basePreview.classList.add("flex");
    previewContainer.classList.remove("flex");
    previewContainer.classList.add("hidden");
  }

  const modale = document.getElementById("modale");
  const editModale = document.getElementById("editModaleBtn");
  const close = document.getElementById("close");
  const addModale = document.getElementById("add-modale");
  const switchtoadd = document.getElementById("switch-addModale");
  const closeadd = document.getElementById("close-add");
  const switchModale = document.getElementById("switchToDel");
  const uploadForm = document.getElementById("uploadForm");

  switchtoadd.addEventListener("click", function () {
    modale.style.display = "none";
    addModale.style.display = "flex";
    resetModale();
    checkfilled();
  });

  editModale.addEventListener("click", function () {
    modale.style.display = "block";
  });

  closeadd.addEventListener("click", function () {
    addModale.style.display = "none";
    resetModale();
  });

  switchModale.addEventListener("click", function () {
    addModale.style.display = "none";
    modale.style.display = "flex";
    resetModale();
  });

  close.addEventListener("click", function () {
    modale.style.display = "none";
    resetModale();
  });

  window.addEventListener("click", function (event) {
    if (event.target === modale || event.target === addModale) {
      modale.style.display = "none";
      addModale.style.display = "none";
      resetModale();
    }
  });

  /**
   * Fait la prévisualisation de l'image et vérifie sa taille.
   */

  const uploadFile = document.getElementById("fileInput");
  const fileupload = document.getElementById("file-upload");
  const basePreview = document.getElementById("basePreview");
  const maxSize = 4 * 1024 * 1024; // 4 Mo en octets

  uploadFile.addEventListener("change", function (event) {
    const fileInput = event.target;
    const previewContainer = document.getElementById("previewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const file = fileInput.files[0];

    if (file) {
      if (file.size > maxSize) {
        alert(
          "Le fichier est trop volumineux. La taille maximale est de 4 Mo."
        );
        fileInput.value = ""; // Réinitialise l'input de fichier
        imagePreview.src = "";
        previewContainer.classList.add("hidden");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        fileupload.style.display = "none";
        basePreview.classList.remove("flex");
        basePreview.classList.add("hidden");
        previewContainer.classList.remove("hidden");
        previewContainer.classList.add("flex");
      };
      reader.readAsDataURL(file);
    } else {
      resetModale();
    }
  });

  /**
   * Envoie l'image au serveur et ajoute la figure à la galerie.
   */

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const image = document.getElementById("fileInput").files[0];
    const titleInput = document.getElementById("titleInput").value;
    const categorySelect = document.getElementById("categorySelect").value;

    if (!image || !titleInput || !categorySelect || categorySelect == 0) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", titleInput);
    formData.append("category", categorySelect);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        getWorks(categorySelect);
        window.scrollTo({ top: 0, behavior: "smooth" });
        resetModale();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du travail :", error);
      alert("Erreur lors de l'ajout du travail. Veuillez réessayer.");
    }
  });

  /***********Add Image - LoadCategorie Dynamique *********/

  function createSelectOption(value, text) {
    const option = document.createElement("option");
    option.textContent = text;
    option.value = value;
    return option;
  }

  async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();
    const select = document.getElementById("categorySelect");
    const optionnull = document.createElement("option");
    optionnull.value = 0;
    select.appendChild(optionnull);

    data.forEach((item) => {
      const option = createSelectOption(item.id, item.name);
      select.appendChild(option);
    });
  }
  getCategories();

  function checkfilled() {
    const categorySelect = document.getElementById("categorySelect").value;
    const titleInput = document.getElementById("titleInput").value;
    const fileupload = document.getElementById("fileInput").files[0];
    if (!fileupload || !titleInput || categorySelect == 0) {
      return false;
    } else {
      return true;
    }
  }

  const titleInput = document.getElementById("titleInput");
  const select = document.getElementById("categorySelect");
  const uploadButton = document.getElementById("uploadButton");
  select.addEventListener("change", () => {
    if (checkfilled() == true) {
      uploadButton.classList.remove("bouton-gris");
      uploadButton.classList.add("bouton-vert");
    } else {
      uploadButton.classList.remove("bouton-vert");
      uploadButton.classList.add("bouton-gris");
    }
  });
  titleInput.addEventListener("change", () => {
    if (checkfilled() == true) {
      uploadButton.classList.remove("bouton-gris");
      uploadButton.classList.add("bouton-vert");
    } else {
      uploadButton.classList.remove("bouton-vert");
      uploadButton.classList.add("bouton-gris");
    }
  });
  fileupload.addEventListener("change", () => {
    if (checkfilled() == true) {
      uploadButton.classList.remove("bouton-gris");
      uploadButton.classList.add("bouton-vert");
    } else {
      uploadButton.classList.remove("bouton-vert");
      uploadButton.classList.add("bouton-gris");
    }
  });
});

/*********Bouton Valider Image Dynamique */
// 1) Recup tout les inputs
// 2) event sur le change
// 3) regarder si c'est rempli (tous)
