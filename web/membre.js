// caisse_membre.js
/*document.getElementById("ajouter-cotisation").addEventListener("click", () => {
    const nom = document.getElementById("nom").value;
    const montant = parseFloat(document.getElementById("montant").value);

    if (nom && !isNaN(montant)) {
        eel.ajouter_cotisation(nom, montant);

        // Clear input fields after adding cotisation
        document.getElementById("nom").value = "";
        document.getElementById("montant").value = "";
    } else {
        alert("Veuillez remplir tous les champs correctement.");
    }
});*/

document.getElementById("ajouter-transaction").addEventListener("click", () => {
    const libelle = document.getElementById("libelle").value;
    const montant = parseFloat(document.getElementById("montant-transaction").value);
    const type = document.getElementById("type-transaction").value;

    if (libelle && !isNaN(montant) && type) {
        eel.ajouter_transaction_caisse_membre(libelle, montant, type);

        // Clear input fields after adding transaction
        document.getElementById("libelle").value = "";
        document.getElementById("montant-transaction").value = "";
        document.getElementById("type-transaction").value = "entrée"; // Reset to default value
    } else {
        alert("Veuillez remplir tous les champs correctement.");
    }
});
// Expose functions to Python
eel.expose(updateCotisations);
function updateCotisations(data) {
    console.log("Received cotisations data:", data);  // Debugging
    const tbody = document.querySelector("#table-cotisations tbody");
    if (tbody) {
        tbody.innerHTML = "";
        data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${row.numero}</td><td>${row.nom}</td><td>${row.cotisation}</td>`;
            tbody.appendChild(tr);
        });
    }
}

eel.expose(updateCaisseMembre);
function updateCaisseMembre(data) {
    console.log("Received caisse membre data:", data);  // Debugging
    const tbody = document.querySelector("#table-caisse-membre tbody");
    if (tbody) {
        tbody.innerHTML = "";
        data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${row.date}</td><td>${row.libelle}</td><td>${row.entree}</td><td>${row.sortie}</td><td>${row.total}</td>`;
            tbody.appendChild(tr);
        });
    }
}

// Fetch data when the page loads
document.addEventListener("DOMContentLoaded", () => {
    eel.rafraichir_cotisations();  // Fetch cotisations data
    eel.rafraichir_caisse_membre();  // Fetch caisse membre data
});

// Add event listeners for buttons
const ajouterCotisationBtn = document.getElementById("ajouter-cotisation");
if (ajouterCotisationBtn) {
    ajouterCotisationBtn.addEventListener("click", () => {
        const nom = document.getElementById("nom").value;
        const montant = parseFloat(document.getElementById("montant").value);
        document.getElementById("nom").value = "";
        document.getElementById("montant").value = "";
        eel.ajouter_cotisation(nom, montant);
    });
}

const rafraichirCotisationsBtn = document.getElementById("rafraichir-cotisations");
if (rafraichirCotisationsBtn) {
    rafraichirCotisationsBtn.addEventListener("click", () => {
        eel.rafraichir_cotisations();
    });
}

const ajouterTransactionBtn = document.getElementById("ajouter-transaction");
if (ajouterTransactionBtn) {
    ajouterTransactionBtn.addEventListener("click", () => {
        const libelle = document.getElementById("libelle").value;
        const montant = parseFloat(document.getElementById("montant-transaction").value);
        const type = document.getElementById("type-transaction").value;
        eel.ajouter_transaction_caisse_membre(libelle, montant, type);
    });
}

const rafraichirCaisseMembreBtn = document.getElementById("rafraichir-caisse-membre");
if (rafraichirCaisseMembreBtn) {
    rafraichirCaisseMembreBtn.addEventListener("click", () => {
        eel.rafraichir_caisse_membre();
    });
}