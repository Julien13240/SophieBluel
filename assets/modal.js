document.addEventListener("DOMContentLoaded", function () {
    const modify = document.getElementById("modifier");
    const modale = document.getElementById("modale");
    const span = document.getElementsByClassName("close");
    const imageContainer = document.getElementById("image-container");
    const add = document.getElementById("ajouter");
    const modaleAjout = document.getElementById("modale-ajout");
    const validate = document.getElementById("valider");
    const backToModale = document.getElementById("back-to-modale");
    //  S'assure que le script ne s'exécute qu'une fois le DOM complètement chargé.
    //  Cela garantit que tous les éléments HTML nécessaires sont disponibles pour être manipulés.



    // Fonction pour afficher les images existantes dans la modale
    async function displayWorksInModale() {
        const modalData = await getWorks();
        //fonction asynchrone qui fait appel à une API via getWorks pour 
        //récupérer les images déjà présentes
        imageContainer.innerHTML = ''; // Vider le conteneur pour éviter les doublons

        modalData.forEach(item => {
            // Créer un élément figure pour chaque image
            const figure = document.createElement("figure");
            figure.classList.add("photo-item");

            const img = document.createElement("img");
            img.src = item.imageUrl;
            img.alt = item.title;

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn");

            // Pour chaque image récupérée, un élément "figure" est créé, contenant l'image elle-même et un bouton de suppression 

            deleteButton.addEventListener("click", function () {
                deleteImage(item.id)
                // Le bouton de suppression est lié à un événement click qui appelle la fonction deleteImage(item.id)
                //  pour supprimer l'image correspondante.
            });

            figure.appendChild(img);
            figure.appendChild(deleteButton);
            imageContainer.appendChild(figure);
            // Pour chaque image récupérée, un élément figure est créé, 
            // contenant l'image et un bouton de suppression.
        });
    }

    // Initialisation de l'affichage des images dans la modale
    displayWorksInModale();

    // Gestion des événements pour l'affichage et la fermeture des modales
    modify.addEventListener("click", function () {
        modale.style.display = "block";
    });
    // Affiche la première modale lorsqu'on clique sur un bouton avec l'ID "modifier"


    //Itère sur le span "close"
    for (var i = 0; i < span.length; i++) {
        span[i].addEventListener("click", function () {
            modale.style.display = "none";
            modaleAjout.style.display = "none";
        });
        // Les éléments avec la classe "close" sont utilisés pour fermer les modales. 
        // Une boucle for est utilisée pour parcourir tous les éléments span ayant la classe "close", 
        // et leur associer un événement click.
    }

    window.addEventListener("click", function (event) {
        if (event.target == modale || event.target == modaleAjout) {
            modale.style.display = "none";
            modaleAjout.style.display = "none";

            // Ferme les modales si l'utilisateur clique en dehors de celles-ci.
        }
    });
    // Clic sur ajouter dans la 1ere modale, ferme la 1ere modale et affiche la 2eme
    add.addEventListener("click", function () {
        modale.style.display = "none";
        modaleAjout.style.display = "block";
    });
    // Clic sur la fleche dans la 2eme modale pour revenir dans la 1ere
    backToModale.addEventListener("click", function () {
        modaleAjout.style.display = "none";
        modale.style.display = "block";
    });

    // Gestion de l'ajout d'une nouvelle image
    validate.addEventListener("click", async function (event) {
        event.preventDefault();
        const photoUpload = document.getElementById("photo-upload").files[0];
        const photoTitle = document.getElementById("photo-title").value;
        const photoCategory = document.getElementById("photo-category").value;

        if (photoUpload && photoTitle && photoCategory) {
            // Le code vérifie d'abord si tous les champs nécessaires (image, titre, catégorie) sont remplis. 
            // Si ce n'est pas le cas, une alerte est affichée (ligne 137)
            const formData = new FormData();
            formData.append("image", photoUpload);
            formData.append("title", photoTitle);
            formData.append("category", photoCategory);

            // Si les champs sont remplis, un objet FormData est créé pour envoyer les données de l'image (fichier, titre, catégorie) 
            // via une requête POST à l'API.

            try {
                const response = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.getItem("token")
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de l'ajout de l'image: " + response.statusText);
                }
                toggleErrorMsg("add", "error-msg-picture");
                displayWorks();
                displayWorksInModale();
                // En cas de succès, la fonction displayWorksInModale() est appelée pour mettre à jour l'affichage des images dans la modale. 
                // La modale est ensuite réinitialisée et la première modale est réaffichée.


                // Réinitialiser la deuxième modale et revenir à la première
                resetAjoutModale();
                modaleAjout.style.display = "none";
                modale.style.display = "block";

            } catch (error) {
                console.error("Erreur lors de l'ajout de l'image:", error);
                toggleErrorMsg("remove", "error-msg-picture", "Une erreur est survenue")
            }
        } else {
            alert("Veuillez remplir tous les champs et sélectionner une image.");
        }
    });

    function handleSubmitButton() {
        const photoUpload = document.getElementById("photo-upload");
        const photoTitle = document.getElementById("photo-title");
        const photoCategory = document.getElementById("photo-category");
        let inputPhotoFill = false
        let inputTitleFill = false
        let inputCategoryFill = false
        // Variables booléennes qui indiquent si chaque champ a été rempli.
        photoUpload.addEventListener("change", function (event) {
            inputPhotoFill = !!event.target.files
            disabledSubmitButton(!inputPhotoFill || !inputTitleFill || !inputCategoryFill)
            // Cet événement vérifie si un fichier a été sélectionné pour l'upload, puis met à jour la variable inputPhotoFill en conséquence.
        })
        photoTitle.addEventListener("input", function (event) {
            inputTitleFill = !!event.target.value
            disabledSubmitButton(!inputPhotoFill || !inputTitleFill || !inputCategoryFill)
            // Cet événement vérifie si un titre a été saisi.
        })
        photoCategory.addEventListener("input", function (event) {
            inputCategoryFill = !!event.target.value
            disabledSubmitButton(!inputPhotoFill || !inputTitleFill || !inputCategoryFill)
            // Cet événement vérifie si une catégorie a été sélectionnée.
        })
    }
    function disabledSubmitButton(disabled) {
        document.getElementById("valider").disabled = disabled
        // La fonction disabledSubmitButton() active ou désactive le bouton "valider" en fonction de si tous les champs sont remplis. 
        // Si l'un des champs n'est pas rempli, le bouton est désactivé, empêchant ainsi l'utilisateur de soumettre le formulaire.
    }
    handleSubmitButton();


    // Prévisualisation de l'image dans la modale avant validation
    function previewModalPicture() {
        const photoUpload = document.getElementById("photo-upload");

        photoUpload.addEventListener("change", function () {
            const reader = new FileReader();
            // Utilise un FileReader pour lire le fichier image sélectionné par l'utilisateur.
            const imagePreview = document.getElementById("image-preview");
            const previewContainer = document.querySelector(".preview-container");

            reader.onload = function (event) { // Lorsque le fichier est complètement lu, l'événement onload est déclenché
                const newImageUrl = event.target.result;
                imagePreview.src = newImageUrl; //  Met à jour la source (src) de l'élément <img>, ce qui provoque l'affichage de l'image sélectionnée.
                previewContainer.style.display = "none"; //  Cache le conteneur
                imagePreview.style.display = "block"; // Affiche l'image à la place du conteneur
            };
            // Une fois le fichier chargé, l'image est affichée dans un élément <img> spécifié par imagePreview, 
            // permettant à l'utilisateur de visualiser l'image avant de l'ajouter.

            reader.readAsDataURL(photoUpload.files[0]);
            // Cette ligne déclenche la lecture du premier fichier sélectionné
        });
    }
    previewModalPicture();


    // Fonction pour réinitialiser les champs de la deuxième modale
    function resetAjoutModale() {
        // Cette fonction réinitialise tous les champs et états associés dans la modale d'ajout d'image après soumission ou lorsque l'utilisateur annule 
        // l'ajout
        document.getElementById("photo-upload").files = null; //l'image est retirée
        document.getElementById("photo-title").value = "";
        document.getElementById("photo-category").value = ""; // Les champs sont vidés
        document.getElementById("image-preview").style.display = "none"; // L'aperçu est caché
        const previewContainer = document.querySelector(".preview-container");
        previewContainer.style.display = "flex"; // Le conteneur d'aperçu est réaffiché

        disabledSubmitButton(true);
        // Le bouton "valider" est désactivé (disabledSubmitButton(true);), forçant l'utilisateur à re-remplir les champs
        //  avant de pouvoir soumettre à nouveau.
    }



    // Fonction pour supprimer une image via l'API
    async function deleteImage(id) {
        // La fonction asynchrone deleteImage(id) envoie une requête DELETE à l'API pour supprimer l'image correspondant à l'ID donné.
        try {
            let response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                },
            });
            if (!response.ok) {

                throw new Error("Erreur lors de la suppression de l'image: " + response.statusText);
            }

            toggleErrorMsg("add", "error-remove-msg");
            displayWorks();
            displayWorksInModale();
        } catch (error) {
            toggleErrorMsg("remove", "error-remove-msg", "Une erreur est survenue")
            console.error("Erreur lors de la suppression de l'image:", error);
        }
        // En cas de succès, l'affichage des images est mis à jour pour refléter la suppression. En cas d'échec, un message d'erreur est affiché.
    }

    // Génère dynamiquement les options pour le champ de sélection de la catégorie
    async function generatePhotoCategorySelect() {
        const categories = await getCategories()
        // Fonction asynchrone qui appelle une API pour obtenir la liste des catégories disponibles.
        const photoCategory = document.getElementById("photo-category")

        for (let category of categories) { //  Boucle sur chaque élément (chaque catégorie) de la liste categories. 
            // Chaque élément est stocké temporairement dans la variable category pour être utilisé dans les itérations de la boucle.
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            // Pour chaque catégorie reçue, une nouvelle option (<option>) est créée avec l'ID de la catégorie 
            // comme valeur (option.value) et le nom de la catégorie comme texte (option.textContent).

            photoCategory.appendChild(option);
            // Chaque option est ensuite ajoutée au champ de sélection (photoCategory.appendChild(option);), 
            // permettant ainsi à l'utilisateur de choisir parmi les catégories disponibles.
        }
    }
    generatePhotoCategorySelect();
});


