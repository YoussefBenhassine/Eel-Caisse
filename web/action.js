
document.getElementById("ajouter-transaction-action-btn").addEventListener("click", () => {
    const action = document.getElementById("action").value;
    const libelle = document.getElementById("libelle-action").value;
    const montant = parseFloat(document.getElementById("montant-action").value);
    const type = document.getElementById("type-action").value;

    
    console.log("Action:", action);
    console.log("Libellé:", libelle);
    console.log("Montant:", montant);
    console.log("Type:", type);

    
    if (action && libelle && !isNaN(montant) && type) {
        
        eel.ajouter_transaction_action(action, libelle, montant, type);
    } else {
        alert("Veuillez remplir tous les champs correctement.");
    }
    
    document.getElementById("action").value = "";
    document.getElementById("libelle-action").value = "";
    document.getElementById("montant-action").value = "";
    document.getElementById("type-action").value = "entrée"; 
});


eel.expose(updateActions);
function updateActions(data) {
    console.log("Received transaction history:", data);  
    const tbody = document.querySelector("#table-actions tbody");
    if (tbody) {
        tbody.innerHTML = "";  
        data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${row.date}</td><td>${row.libelle}</td><td>${row.type}</td><td>${row.montant}</td>`;
            tbody.appendChild(tr);
        });
    }
}


eel.expose(updateListeActions);
function updateListeActions(actions) {
    console.log("Received actions for dropdown:", actions);  
    const select = document.getElementById("action-historique");
    if (select) {
        select.innerHTML = "";  
        actions.forEach(action => {
            const option = document.createElement("option");
            option.value = action;
            option.textContent = action;
            select.appendChild(option);
        });
    }
}


document.addEventListener("DOMContentLoaded", () => {
    eel.mettre_a_jour_liste_actions();  
});

document.addEventListener("DOMContentLoaded", () => {
    eel.rafraichir_actions(); 
});

const afficherHistoriqueBtn = document.getElementById("afficher-historique");
if (afficherHistoriqueBtn) {
    afficherHistoriqueBtn.addEventListener("click", () => {
        const action = document.getElementById("action-historique").value;
        eel.afficher_historique_action(action);
    });
}

const rafraichirActionsBtn = document.getElementById("rafraichir-actions");
if (rafraichirActionsBtn) {
    rafraichirActionsBtn.addEventListener("click", () => {
        eel.rafraichir_actions();
    });
}
