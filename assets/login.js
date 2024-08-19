document.addEventListener("DOMContentLoaded", () => {// ajoute un écouteur d'événement qui 
  //attend que le DOM (Document Object Model) soit complètement chargé avant d'exécuter la 
  //fonction fournie. Cela garantit que tous les éléments du formulaire sont disponibles pour 
  //être sélectionnés et manipulés.
  const loginForm = document.querySelector("form"); // Sélectionne l'élément "form" du HTML et
  //le stocke dans une variable "loginForm"

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();// Empeche la fonction d'être exectuée au click sur "Se connecter"

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    // Sélectionnent les éléments avec les identifiants email et password, récupèrent leurs 
    //valeurs (c'est-à-dire ce que l'utilisateur a saisi), et les stockent respectivement 
    //dans les variables email et password.

    // Fonction pour authentifier en utilisant l'API

    authenticate(email, password);
  });
  async function authenticate(email, password) {
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {// Ces lignes 
        // effectuent une requête POST à l'URL de l'API
        method: "POST", // Spécifie que la methode HTTP utilisée est "POST"
        headers: {
          "Content-Type": "application/json" // Indique que le corps de la requête sera au 
          //format JSON.
        },
        body: JSON.stringify({ email, password })
      });
      const logs = await response.json();
      console.log(response);
      if (response.status === 200) {
        sessionStorage.setItem("token", logs.token);
        toggleErrorMsg("remove", "error-message");
        alert("Vous etes connecté ! Redirection en cours ...")
        window.location.href = "index.html";
      }
      else {
        toggleErrorMsg("add", "error-message", "E-mail ou mot de passe incorrect");
      }


    } catch (error) {
      console.error("Erreur:", error);

    }
  }


});

function toggleErrorMsg(visibility, idSelector, errorMessage = "") {

  const errorMsg = document.getElementById(idSelector)
  if (visibility === "add") {
    errorMsg.classList.add("hidden")
  }
  else if (visibility === "remove") {
    errorMsg.classList.remove("hidden")
  }

  errorMsg.textContent = errorMessage


}
