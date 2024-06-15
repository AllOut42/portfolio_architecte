// Écouteur d'événements pour l'événement DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Récupération des éléments HTML nécessaires
  const email = document.getElementById("email");
  const mdp = document.getElementById("mdp");
  const myLogin = document.getElementById("myLogin");

  // Fonction de vérification des champs
  function checkField() {
    if (email.value === "" || mdp.value === "") {
      alert("Veuillez remplir tous les champs");
      return false;
    }
    return true;
  }

  // Fonction de validation de l'email
  function emailValid(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex pour valider un email
    return emailPattern.test(email);
  }

  // Écouteur d'événement pour le bouton de connexion
  myLogin.addEventListener("click", async function (e) {
    e.preventDefault(); // Empêche le rechargement de la page

    // Vérification des champs
    if (!checkField()) {
      return;
    }

    // Validation de l'email
    if (!emailValid(email.value)) {
      alert("Veuillez entrer un email valide");
      return;
    }

    // Création des informations à envoyer
    const infos = {
      email: email.value,
      password: mdp.value,
    };

    // Envoi des informations au serveur
    await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(infos),
    })
      .then((response) => {
        // Vérification de la réponse du serveur
        if (response.status !== 200) {
          alert("Email ou mot de passe incorrect");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        // Stockage du token dans le localStorage et redirection vers la page d'accueil
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      })
      .catch((error) => {
        // Gestion des erreurs
        console.log(error);
      });
  });
});
