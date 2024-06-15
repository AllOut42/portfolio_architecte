// 1 : Récupérer les filtres depuis l'API
// 2 : Créer les boutons dans le DOM
// 3 : Au clic sur un bouton trier les catégories
let worksData;

window.onload = () => {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      worksData = data;
      console.log(worksData);
    });
};

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const banner = document.getElementById("banner");
  const login = document.getElementById("login");
  const logout = document.getElementById("logout");
  const editModale = document.getElementById("editModaleBtn");
  const filters = document.getElementById("filters");

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
    }
  });
});

async function getFilters() {
  const response = await fetch("http://localhost:5678/api/categories");
  const data = await response.json();

  const filters = document.getElementById("filters");
  const allButton = createFilterButton("0", "Tous");
  allButton.classList.add("filter-button");
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

async function getWorks(categoryId = 0) {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();

    const gallery = document.querySelector(".gallery");
    const modalContent = document.querySelector(".modalContent");
    gallery.innerHTML = "";
    modalContent.innerHTML = "";

    // 1 : Je récupérer les élements depuis l'api
    // 2 : Afficher les éléments dans le DOM (Modal)
    // 3 : Afficher une poubelle sur chaque élément (Modal)
    // 4 : Au clic sur la poubelle supprimer l'élément depuis l'api
    // 5 : On recharge GETWorks()
    // 6 : STEP 2 de la modale (AJOUT)
    // 7 : Ajouter un bouton ajouter un work
    // 8 : Récupérer l'image, le titre et la catégorie
    // 8a : La catégorie doit être un select qui récupère les catégories depuis l'api
    // 9 : Si toutes les données sont saisie correctement on post SUR l'api
    // 9 a: En cas d'erreur on bloque et msg d'erreur.
    // 10 : On recharge GETWorks() pour afficher les nouveaux résultats.

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

      /*figureModal.innerHTML += `
      <img src="${imageUrl}" alt="${title}" class="toto"/>
      <i class="fas fa-trash-alt"></i>
      `;
      */

      trash.addEventListener("click", async function (e) {
        e.preventDefault();
        console.log("delete", id);
        try {
          await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }).then(getWorks(0));
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

function createFilterButton(value, text) {
  const button = document.createElement("button");
  button.className = "filter-option";
  button.textContent = text;
  button.value = value;
  return button;
}

document.addEventListener("DOMContentLoaded", () => {
  getFilters().then(() => {
    const allButton = document.querySelector('.filter-option[value="0"]');

    if (allButton) {
      allButton.classList.add("active");
    }

    getWorks(0).then(() => console.log("works loaded"));
  });
});

function setActiveFilter(button) {
  document
    .querySelectorAll(".filter-option")
    .forEach((b) => b.classList.remove("active"));
  button.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const modale = document.getElementById("modale");
  const editModale = document.getElementById("editModaleBtn");
  const close = document.getElementById("close");
  const addModale = document.getElementById("add-modale");
  const switchtoadd = document.getElementById("switch-addModale");
  const closeadd = document.getElementById("close-add");
  const switchModale = document.getElementById("switchToDel");

  switchtoadd.addEventListener("click", function () {
    modale.style.display = "none";
    addModale.style.display = "flex";
  });

  editModale.addEventListener("click", function () {
    modale.style.display = "block";
  });

  closeadd.addEventListener("click", function () {
    addModale.style.display = "none";
  });

  switchModale.addEventListener("click", function () {
    addModale.style.display = "none";
    modale.style.display = "flex";
  });

  close.addEventListener("click", function () {
    modale.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == modale) {
      modale.style.display = "none";
    }
    if (event.target == addModale) {
      addModale.style.display = "none";
    }
  });
});

/*
const photo = document.querySelector(".file").files[0];

const toto = new FormData();
toto.append("toto", "tata");
toto.append("categoryId", "1");
toto.append("image", photo);
*/

/* Faire la preview de l'image + verification taille */

document.addEventListener("DOMContentLoaded", function () {
  const uploadFile = document.getElementById("fileInput");
  const fileupload = document.getElementById("file-upload");
  const basePreview = document.getElementById("basePreview");
  const maxSize = 4 * 1024 * 1024; // 4 Mo en octets

  uploadFile.addEventListener("change", function (event) {
    const fileInput = event.target;
    const previewContainer = document.getElementById("previewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const file = fileInput.files[0];
    console.log(file);

    if (file) {
      if (file.size > maxSize) {
        alert("Le fichier est trop grand. La taille maximale est de 4 Mo.");
        fileInput.value = ""; // Réinitialise l'input file
        imagePreview.src = "";
        previewContainer.classList.add("hidden");
        return; // Exit
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        // Définition de la fonction onload
        imagePreview.src = e.target.result;
        fileupload.style.display = "none";
        basePreview.classList.remove("flex");
        basePreview.classList.add("hidden");
        previewContainer.classList.remove("hidden");
        previewContainer.style.display = "flex";
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "";
      fileupload.style.display = "flex";
      basePreview.classList.remove("flex");
      basePreview.classList.add("hidden");
      previewContainer.classList.add("hidden");
    }
  });
});

///////////////////////////////////////////////////////////////////
//                             EN                                //
//                            TEST                               //
///////////////////////////////////////////////////////////////////
// Envoie de l'image au serveur et ajout de la figure à la galerie
document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const image = document.getElementById("fileInput").files[0];
    const titleInput = document.getElementById("titleInput").value;
    const categorySelect = document.getElementById("categorySelect").value;

    if (!image || !titleInput || !categorySelect) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", titleInput);
    formData.append("category", categorySelect);

    for (let i of formData.entries()) {
      console.log(i[0] + ": " + i[1]);
    }

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        getWorks(0);
        document.getElementById("add-modale").style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
        alert("pause");
      }
    } catch (error) {
      console.error("Error adding work:", error);
      alert("Erreur lors de l'ajout du travail. Veuillez réessayer.");
    }
  });
});
