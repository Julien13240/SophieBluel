async function getWorks(){
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()
    return works
}
async function displayWorks(){
    const works = await getWorks()
    console.log(works)
}
displayWorks()

document.addEventListener("DOMContentLoaded", function() {
    const galleryData = [
        { src: "assets/images/abajour-tahina.png", alt: "Abajour Tahina", caption: "Abajour Tahina" },
        { src: "assets/images/appartement-paris-v.png", alt: "Appartement Paris V", caption: "Appartement Paris V" },
        { src: "assets/images/restaurant-sushisen-londres.png", alt: "Restaurant Sushisen - Londres", caption: "Restaurant Sushisen - Londres" },
        { src: "assets/images/la-balisiere.png", alt: "Villa “La Balisiere” - Port Louis", caption: "Villa “La Balisiere” - Port Louis" },
        { src: "assets/images/structures-thermopolis.png", alt: "Structures Thermopolis", caption: "Structures Thermopolis" },
        { src: "assets/images/appartement-paris-x.png", alt: "Appartement Paris X", caption: "Appartement Paris X" },
        { src: "assets/images/le-coteau-cassis.png", alt: "Pavillon “Le coteau” - Cassis", caption: "Pavillon “Le coteau” - Cassis" },
        { src: "assets/images/villa-ferneze.png", alt: "Villa Ferneze - Isola d’Elba", caption: "Villa Ferneze - Isola d’Elba" },
        { src: "assets/images/appartement-paris-xviii.png", alt: "Appartement Paris XVIII", caption: "Appartement Paris XVIII" },
        { src: "assets/images/bar-lullaby-paris.png", alt: "Bar “Lullaby” - Paris", caption: "Bar “Lullaby” - Paris" },
        { src: "assets/images/hotel-first-arte-new-delhi.png", alt: "Hotel First Arte - New Delhi", caption: "Hotel First Arte - New Delhi" }
    ];

    const galleryContainer = document.querySelector(".gallery");

    galleryData.forEach(item => {
        const figure = document.createElement("figure");
        
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt;
        
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = item.caption;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        galleryContainer.appendChild(figure);
    });
});
