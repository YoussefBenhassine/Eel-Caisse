eel.expose(updateCotisations);
function updateCotisations(data) {
    const tbody = document.querySelector("#table-cotisations tbody");
    tbody.innerHTML = "";
    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.numero}</td><td>${row.nom}</td><td>${row.cotisation}</td>`;
        tbody.appendChild(tr);
    });
}

eel.expose(updateCaisseMembre);
function updateCaisseMembre(data) {
    const tbody = document.querySelector("#table-caisse-membre tbody");
    tbody.innerHTML = "";
    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.date}</td><td>${row.libelle}</td><td>${row.entree}</td><td>${row.sortie}</td><td>${row.total}</td>`;
        tbody.appendChild(tr);
    });
}

eel.expose(updateActions);
function updateActions(data) {
    const tbody = document.querySelector("#table-actions tbody");
    tbody.innerHTML = "";
    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.date}</td><td>${row.libelle}</td><td>${row.type}</td><td>${row.montant}</td>`;
        tbody.appendChild(tr);
    });
}

document.getElementById("ajouter-cotisation").addEventListener("click", () => {
    const nom = document.getElementById("nom").value;
    const montant = parseFloat(document.getElementById("montant").value);
    eel.ajouter_cotisation(nom, montant);
});

document.getElementById("action-caisse-membre").addEventListener("change", () => {
    const selectedAction = document.getElementById("action-caisse-membre").value;
    if (selectedAction) {
        eel.mettre_a_jour_graphique_caisse_membre(selectedAction);
    }
});


document.getElementById("rafraichir-cotisations").addEventListener("click", () => {
    eel.rafraichir_cotisations();
});

document.getElementById("ajouter-transaction").addEventListener("click", () => {
    const libelle = document.getElementById("libelle").value;
    const montant = parseFloat(document.getElementById("montant-transaction").value);
    const type = document.getElementById("type-transaction").value;
    eel.ajouter_transaction_caisse_membre(libelle, montant, type);
});

document.getElementById("rafraichir-caisse-membre").addEventListener("click", () => {
    eel.rafraichir_caisse_membre();
});

document.getElementById("ajouter-transaction-action-btn").addEventListener("click", () => {
    const action = document.getElementById("action").value;
    const libelle = document.getElementById("libelle-action").value;
    const montant = parseFloat(document.getElementById("montant-action").value);
    const type = document.getElementById("type-action").value;
    eel.ajouter_transaction_action(action, libelle, montant, type);
});

document.getElementById("afficher-historique").addEventListener("click", () => {
    const action = document.getElementById("action-historique").value;
    eel.afficher_historique_action(action);
});

document.getElementById("rafraichir-actions").addEventListener("click", () => {
    eel.rafraichir_actions();
});

eel.expose(updateDashboardCaisseMembre);
function updateDashboardCaisseMembre(actions) {
    console.log("Actions received:", actions);  // Debug
    const select = document.getElementById("action-caisse-membre");
    select.innerHTML = "";
    actions.forEach(action => {
        const option = document.createElement("option");
        option.value = action;
        option.textContent = action;
        select.appendChild(option);
    });
    return "Dashboard updated";  // Always return a value
}

eel.expose(updateDashboardCaisseMembre);
function updateDashboardCaisseMembre(actions) {
    console.log("Actions received:", actions);  // Debug
    const select = document.getElementById("action-caisse-membre");
    select.innerHTML = "";
    actions.forEach(action => {
        const option = document.createElement("option");
        option.value = action;
        option.textContent = action;
        select.appendChild(option);
    });
    return "Dashboard updated";  // Always return a value
}

eel.expose(updateGraphiqueCaisseMembre);
function updateGraphiqueCaisseMembre(totalEntrees, totalSorties) {
    console.log("Graph data received for Caisse Membre:", totalEntrees, totalSorties);  // Debug

    const ctx = document.getElementById("graphique-caisse-membre").getContext("2d");

    // Destroy existing chart instance if it exists
    if (window.myChartCaisseMembre) {
        window.myChartCaisseMembre.destroy();
    }

    // Create new chart with provided data
    window.myChartCaisseMembre = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Entrées", "Sorties"],
            datasets: [{
                label: 'Montant (DT)',
                data: [totalEntrees || 0, totalSorties || 0],  // Use default 0 if no data
                backgroundColor: ['green', 'red']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    console.log("Caisse Membre chart updated successfully");
    return "Graph updated";
}


eel.expose(updateDashboardCaisseAction);
function updateDashboardCaisseAction(totalEntrees, totalSorties, solde) {
    // Mettre à jour les labels
    document.getElementById("total-entrees-caisse-action").textContent = `Total des entrées : ${totalEntrees.toFixed(2)} DT`;
    document.getElementById("total-sorties-caisse-action").textContent = `Total des sorties : ${totalSorties.toFixed(2)} DT`;
    document.getElementById("solde-caisse-action").textContent = `Solde actuel : ${solde.toFixed(2)} DT`;
}

eel.expose(updateGraphiqueCaisseAction);
function updateGraphiqueCaisseAction(totalEntrees, totalSorties) {
    console.log("Graph data received for Caisse Action:", totalEntrees, totalSorties);  // Debug
    const ctx = document.getElementById("graphique-caisse-action").getContext("2d");

    // Destroy existing chart instance if it exists
    if (window.myChartCaisseAction) {
        window.myChartCaisseAction.destroy();
    }

    // Create new chart
    window.myChartCaisseAction = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Entrées", "Sorties"],
            datasets: [{
                label: 'Montant (DT)',
                data: [totalEntrees, totalSorties],
                backgroundColor: ['green', 'red']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    return "Graph updated";  // Always return a value
}

eel.expose(updateListeActions);
function updateListeActions(actions) {
    const select = document.getElementById("action-historique");
    select.innerHTML = "";
    actions.forEach(action => {
        const option = document.createElement("option");
        option.value = action;
        option.textContent = action;
        select.appendChild(option);
    });
}

eel.expose(showError);
function showError(message) {
    alert(message);
}

eel.expose(showSuccess);
function showSuccess(message) {
    alert(message);
}

eel.expose(myFunction);
function myFunction() {
    console.log("JavaScript function called");
    return "Hello from JavaScript";  // Always return a value
}