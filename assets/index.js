async function getWorks() { // Déclare une fonction asynchrone
    const response = await fetch("http://localhost:5678/api/works"); // Envoie une requête à l'API et attends une réponse
    const works = await response.json(); // Convertit la réponse en language compréhensible par JS
    return works;
}

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
}

async function displayWorks(categoryId = -1) { // Rajoute le paramètre "Tous"(-1) en valeur par défaut
    const galleryData = await getWorks(); // Récupère tous les éléments dans le fichier works de l'API
    const galleryContainer = document.querySelector(".gallery"); //Sélectionne l'élément HTML avec la classe gallery 
    // et le stocke dans galleryContainer.
    galleryContainer.innerHTML = ''; // Vide le contenu de galleryContainer pour préparer l'affichage des nouvelles œuvres.

    galleryData.forEach(item => { // Boucle pour chaque éléments "items" dans galleryData
        if (categoryId === -1 || item.categoryId === categoryId) {
            // || = opérateur logique OU, sert a vérifier si l'une ou l'autre des conditions est vraie. 
            // Si categoryId n'est pas -1,alors la condition item.categoryId === categoryId vérifie si 
            // l'élément appartient à la catégorie sélectionnée et cela permet de sélectionner uniquement 
            // les éléments qui appartiennent à la catégorie spécifiée.
            // En résumé, cette ligne de code permet de filtrer une collection d'éléments en fonction d'un 
            // critère de catégorie, tout en offrant la possibilité de sélectionner tous les éléments lorsque 
            // categoryId est égal à -1.
            const figure = document.createElement("figure");
            //Créer un élément figure
            const img = document.createElement("img");
            // Créer un élément img
            img.src = item.imageUrl; // Fais correspondre l'attribut "src" à l'URL d'un élément appelé via l'API
            img.alt = item.title; // Fais correspondre l'attribut "alt" au titre correspondant à lélément appelé

            const figcaption = document.createElement("figcaption"); //Crée un élément "figcaption"
            figcaption.textContent = item.title; // Fais correspondre le contenu du texte figcaption avec le titre
            // de l'élément séléctionné

            figure.appendChild(img);
            figure.appendChild(figcaption);
            galleryContainer.appendChild(figure);
        }
    });
}

async function displayCategories() {
    const categoriesData = await getCategories();
    categoriesData.unshift({ id: -1, name: "Tous" }); // Ajoute une catégorie en début de liste
    const categoriesContainer = document.querySelector(".categories"); // Selectionne le container "categories" dans le HTML pour afficher les filtres

    categoriesData.forEach(item => {
        const div = document.createElement("div"); // Créer une div pour chaque éléments présent dans categoriesData
        div.classList.add("category-item"); // Lui ajoute la classe "category-item"
        div.textContent = item.name; // Fais correspondre le nom de la categorie au texte de la div assignée
        categoriesContainer.appendChild(div);

        div.addEventListener("click", function () {
            document.querySelectorAll(".category-item").forEach(category => { // Selectionne tous les éléments qui ont la classe "category-item"
                // et boucle pour que pour chaque élément avec cette classe soit séléctionnés.
                category.classList.remove("active");
                // pour supprimer la classe "active" de tous les éléments de catégorie avant de mettre à jour l'élément cliqué
            });
            div.classList.add("active"); // Ajoute la classe "active" sur la div cliquée
            displayWorks(item.id);
        });
    });
}

// Vérifie si l'utilisateur est connecté
function isConnected() {

    // Retourne vrai si le token existe dans le sessionStorage, faux sinon
    return sessionStorage.getItem("token") !== null;
}
if (isConnected()) {
    // L'utilisateur est connecté
    console.log("Utilisateur connecté");
} else {
    // L'utilisateur n'est pas connecté
    console.log("Utilisateur non connecté");
}
// Gère le bouton de connexion/déconnexion en fonction de l'état de connexion

function handleLoginButton() {
    const loginButton = document.getElementById("login-button");
    if (isConnected()) {
        loginButton.innerText = "logout"; // Change le login en logout si connexion
        loginButton.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            window.location.href = "./index.html"; // Redirige vers l'accueil après déconnexion
        });
    } else {
        loginButton.innerText = "login";

    }
}
function adjustDisplayIfLogin() {
    const adminElements = document.querySelectorAll(".admin");
    const hideCategories = document.querySelectorAll(".hide")
    const loggedIn = isConnected();

    function toggleVisibility(elements, condition) { // Elle prend deux arguments : 
        //une liste d'éléments (ici soit adminElements, soit hideCategories) et une 
        //condition (vrai ou faux) basée sur l'état de connexion.
        elements.forEach((element) => {
            if (condition) {
                element.classList.remove("hidden");

            } else {
                element.classList.add("hidden");
            }
        });
    }
    toggleVisibility(adminElements, loggedIn);
    toggleVisibility(hideCategories, !loggedIn);
}

function toggleErrorMsg(visibility, idSelector, errorMessage = "") {
    //gère l'affichage d'un message d'erreur, informe l'utilisateur en cas de problème
    const errorMsg = document.getElementById(idSelector)
    if (visibility === "add") {
        errorMsg.classList.add("hidden")
    }
    else if (visibility === "remove") {
        errorMsg.classList.remove("hidden")
    }

    errorMsg.textContent = errorMessage


}


getWorks();
isConnected();
handleLoginButton();
adjustDisplayIfLogin();
displayCategories();
displayWorks();
