// dashboards.js

// Expose functions to Python
eel.expose(updateDashboardCaisseMembre);
function updateDashboardCaisseMembre(actions) {
    console.log("Received actions for dashboard:", actions);  // Debugging
    const select = document.getElementById("action-caisse-membre");
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

eel.expose(updateGraphiqueCaisseMembre);
function updateGraphiqueCaisseMembre(totalEntrees, totalSorties) {
    console.log("Received graph data for Caisse Membre:", totalEntrees, totalSorties);  // Debugging
    const ctx = document.getElementById("graphique-caisse-membre");
    if (ctx) {
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
    }
}

eel.expose(updateDashboardCaisseAction);
function updateDashboardCaisseAction(totalEntrees, totalSorties, solde) {
    console.log("Received totals for Caisse Action:", totalEntrees, totalSorties, solde);  // Debugging
    const totalEntreesElement = document.getElementById("total-entrees-caisse-action");
    const totalSortiesElement = document.getElementById("total-sorties-caisse-action");
    const soldeElement = document.getElementById("solde-caisse-action");

    if (totalEntreesElement && totalSortiesElement && soldeElement) {
        totalEntreesElement.textContent = `Total des entrées : ${totalEntrees.toFixed(2)} DT`;
        totalSortiesElement.textContent = `Total des sorties : ${totalSorties.toFixed(2)} DT`;
        soldeElement.textContent = `Solde actuel : ${solde.toFixed(2)} DT`;
    }
}

eel.expose(updateGraphiqueCaisseAction);
function updateGraphiqueCaisseAction(totalEntrees, totalSorties) {
    console.log("Received graph data for Caisse Action:", totalEntrees, totalSorties);  // Debugging
    const ctx = document.getElementById("graphique-caisse-action");
    if (ctx) {
        // Destroy existing chart instance if it exists
        if (window.myChartCaisseAction) {
            window.myChartCaisseAction.destroy();
        }

        // Create new chart with provided data
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
    }
}

// Fetch data when the page loads
document.addEventListener("DOMContentLoaded", () => {
    eel.mettre_a_jour_dashboard_caisse_membre();  // Fetch data for Caisse Membre dashboard
    eel.mettre_a_jour_dashboard_caisse_action();  // Fetch data for Caisse Action dashboard
});

// Add event listener for action selection
const actionCaisseMembreSelect = document.getElementById("action-caisse-membre");
if (actionCaisseMembreSelect) {
    actionCaisseMembreSelect.addEventListener("change", () => {
        const selectedAction = actionCaisseMembreSelect.value;
        if (selectedAction) {
            eel.mettre_a_jour_graphique_caisse_membre(selectedAction);
        }
    });
}