document.addEventListener("DOMContentLoaded", () => {
  const email = document.getElementById("email");
  const mdp = document.getElementById("mdp");
  const myLogin = document.getElementById("myLogin");

  function checkField() {
    if (email.value == "" || mdp.value == "") {
      alert("Veuillez remplir tous les champs");
      return false;
    }
    return true;
  }

  function emailValid(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regexer / regex101
    return emailPattern.test(email);
  }

  myLogin.addEventListener("click", async function (e) {
    e.preventDefault();
    if (!checkField()) {
      return;
    }

    if (!emailValid(email.value)) {
      alert("Veuillez entrer un email valide");
      return;
    }

    const infos = {
      email: email.value,
      password: mdp.value,
    };

    await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(infos),
    })
      .then((response) => {
        if (response.status != 200) {
          alert("Email ou mot de passe incorrect");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
