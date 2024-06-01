// 1 : Récupérer les filtres depuis l'API
// 2 : Créer les boutons dans le DOM
// 3 : Au clic sur un bouton trier les catégories

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const banner = document.getElementById("banner");
  const login = document.getElementById("login");
  const logout = document.getElementById("logout");

  function CheckToken() {
    if (localStorage.getItem("token")) {
      banner.style.display = "flex";
      login.style.display = "none";
      logout.style.display = "block";
    } else {
      banner.style.display = "none";
      login.style.display = "block";
      logout.style.display = "none";
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
    gallery.innerHTML = "";

    const filterData = data.filter(
      (work) => work.categoryId === Number(categoryId) || categoryId === 0
    );

    const figures = filterData.map(({ id, imageUrl, title }) => {
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
