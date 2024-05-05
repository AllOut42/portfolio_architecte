// 1 : Récupérer les filtres depuis l'API
// 2 : Créer les boutons dans le DOM
// 3 : Au clic sur un bouton trier les catégories

async function getFilters() {
  const response = await fetch("htttp://localhost:5678/api/categories");
  const data = await response.json();

  console.log(data);

  const filters = document.getElementById("filters");

  data.forEach((item) => {
    const button = createFilterButton(item.id, item.name);
    filters.appendChild(button);
  });

  filters.addEventListener("click", (event) => {
    console.log(event);
    if (event.target.tagName === "BUTTON") {
    }
  });
}

async function getWorks() {
  const response = await fetch("htttp://localhost:5678/api/works");
  const data = await response.json();

  console.log(data);

  // Afficher les works dans le DOM en respectant le template
  /*

   <figure>
            <img src="assets/images/abajour-tahina.png" alt="Abajour Tahina" />
            <figcaption>Abajour Tahina</figcaption>
   </figure>


  */
}

getFilters();
getWorks();
