document.addEventListener("DOMContentLoaded", function () {
    const modify = document.getElementById("modifier");
    const modale = document.getElementById("modale");
    const span = document.getElementsByClassName("close");
    const imageContainer = document.getElementById("image-container");
    const add = document.getElementById("ajouter");
    const modaleAjout = document.getElementById("modale-ajout");
    const validate = document.getElementById("valider");
    const backToModale = document.getElementById("back-to-modale");

    async function displayWorksInModale() {
        const modalData = await getWorks();

        modalData.forEach(item => {
            console.log("Photo chargée", item);

            // Créer un élément figure
            const figure = document.createElement("figure");
            figure.classList.add("photo-item"); // Ajouter une classe pour le style si nécessaire

            // Créer un élément img
            const img = document.createElement("img");
            img.src = item.imageUrl; // Correspondre l'attribut "src" à l'URL d'un élément appelé via l'API
            img.alt = item.title; // Ajouter un texte alternatif

            // Créer un bouton de suppression sous forme de corbeille
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn"); // Ajouter une classe pour le style

            deleteButton.addEventListener("click", function () {
                imageContainer.removeChild(figure);
            });

            // Ajouter l'image et le bouton de suppression à l'élément figure
            figure.appendChild(img);
            figure.appendChild(deleteButton);

            // Ajouter l'élément figure au conteneur d'images
            imageContainer.appendChild(figure);
        });
    }

    displayWorksInModale();

    // Quand l'utilisateur clique sur "modifier", la modale s'affiche
    modify.addEventListener("click", function () {
        console.log("Ouverture modale");
        modale.style.display = "block";
    });

    // Quand l'utilisateur clique sur <span> (x), la modale se ferme
    for (var i = 0; i < span.length; i++) {
        span[i].addEventListener("click", function () {
            console.log("Fermeture modale");
            modale.style.display = "none";
            modaleAjout.style.display = "none";
        });
    }

    // Quand l'utilisateur clique en dehors de la modale, elle se ferme
    window.addEventListener("click", function (event) {
        if (event.target == modale || event.target == modaleAjout) {
            console.log("Fermeture modale en cliquant en dehors");
            modale.style.display = "none";
            modaleAjout.style.display = "none"
        }
    });

    // Quand l'utilisateur clique sur "ajouter", la première modale se cache et la deuxième s'affiche
    add.addEventListener("click", function () {
        console.log("Ouverture modale ajout");
        modale.style.display = "none";
        modaleAjout.style.display = "block";
    });

    // Quand l'utilisateur clique sur la flèche de retour, la deuxième modale se cache et la première s'affiche
    backToModale.addEventListener("click", function () {
        console.log("Retour à la première modale");
        modaleAjout.style.display = "none";
        modale.style.display = "block";
    });

    // Quand l'utilisateur clique sur "valider" dans la deuxième modale
    validate.addEventListener("click", function () {
        const photoUpload = document.getElementById("photo-upload").files[0];
        const photoTitle = document.getElementById("photo-title").value;
        const photoCategory = document.getElementById("photo-category").value;

        if (photoUpload && photoTitle && photoCategory) {

            addImage(newImageUrl, photoTitle, photoCategory);
        } else {
            alert("Veuillez remplir tous les champs et sélectionner une image.");
        }
    });

    function previewModalPicture() {
        const photoUpload = document.getElementById("photo-upload");

        photoUpload.addEventListener("change", function () {
            const reader = new FileReader();
            const imagePreview = document.getElementById("image-preview")
            const uploadLabel = document.querySelector(".upload-label")
            reader.onload = function (event) {
                const newImageUrl = event.target.result;
                imagePreview.src = newImageUrl
                uploadLabel.style.display = "none"
            };
            reader.readAsDataURL(photoUpload.files[0]);
        })
    }
    previewModalPicture();

    async function addImage(url, title, category) {
        try {
            console.log("Ajoute nouvelle image via l'URL:", url);
            let response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url: url, title: title, category: category })
            });
            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout de l'image: " + response.statusText);
            }
            console.log("Image ajoutée");
            getWorks();
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'image:", error);
        }
    }


});

async function deleteImage(id) {
    try {
        console.log("Suppression de l'image avec ID:", id);
        let response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la suppression de l'image: " + response.statusText);
        }
        console.log("Image supprimée");
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const addPhotoButton = document.querySelector('.upload-label');
    const imagePreview = document.getElementById('image-preview');
    const fileInfo = document.getElementById('file-info');

    addPhotoButton.addEventListener('click', async function () {
        try {
            // Appel à l'API pour récupérer les travaux
            const response = await fetch('http://localhost:5678/api/works');
            const works = await response.json();

            // Sélectionnez la première image disponible
            const firstWork = works[0];
            const imageUrl = firstWork.imageUrl;

            // Masquez le texte de la taille de fichier et affichez l'aperçu de l'image
            fileInfo.style.display = 'none';
            imagePreview.src = imageUrl;
            imagePreview.style.display = 'block';

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'image:', error);
        }
    });
});

