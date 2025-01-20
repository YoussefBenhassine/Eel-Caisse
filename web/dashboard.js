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

        // Add the event listener after populating the dropdown
        select.addEventListener("change", () => {
            const selectedAction = select.value;
            console.log("Selected action for graph update:", selectedAction);  // Debugging
            if (selectedAction) {
                eel.mettre_a_jour_graphique_caisse_membre(selectedAction);
            }
        });
    } else {
        console.error("Dropdown element with id 'action-caisse-membre' not found.");
    }
}



eel.expose(updateGraphiqueCaisseMembre);
function updateGraphiqueCaisseMembre(totalEntrees, totalSorties) {
    console.log("Received graph data for Caisse Membre:", totalEntrees, totalSorties);  // Debugging

    const canvas = document.getElementById("graphique-caisse-membre");
    if (canvas) {
        console.log("Canvas element found.");

        // Get the 2D rendering context
        const ctx = canvas.getContext("2d");
        if (ctx) {
            console.log("2D context successfully retrieved.");

            // Destroy existing chart instance if it exists
            if (window.myChartCaisseMembre) {
                window.myChartCaisseMembre.destroy();
            }

            // Create gradient for "Entrées"
            const gradientEntrees = ctx.createLinearGradient(0, 0, 0, 400);
            gradientEntrees.addColorStop(0, 'rgba(75, 192, 192, 0.8)'); // Light color
            gradientEntrees.addColorStop(1, 'rgba(75, 192, 192, 0.2)'); // Dark color

            // Create gradient for "Sorties"
            const gradientSorties = ctx.createLinearGradient(0, 0, 0, 400);
            gradientSorties.addColorStop(0, 'rgba(255, 99, 132, 0.8)'); // Light color
            gradientSorties.addColorStop(1, 'rgba(255, 99, 132, 0.2)'); // Dark color

            // Create new chart with provided data
            window.myChartCaisseMembre = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Entrées", "Sorties"],
                    datasets: [{
                        label: 'Montant (DT)',
                        data: [totalEntrees || 0, totalSorties || 0],  // Use default 0 if no data
                        backgroundColor: [gradientEntrees, gradientSorties], // Use gradients
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'], // Border colors
                        borderWidth: 1,
                        borderRadius: 10, // Rounded corners
                        hoverBackgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'], // Hover effect
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false, // Hide legend
                        },
                        title: {
                            display: true,
                            text: 'Caisse Membre', // Chart title
                            font: {
                                size: 18,
                                weight: 'bold',
                            },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(200, 200, 200, 0.2)', // Light grid lines
                            },
                            ticks: {
                                font: {
                                    size: 14,
                                },
                            },
                        },
                        x: {
                            grid: {
                                display: false, // Hide x-axis grid lines
                            },
                            ticks: {
                                font: {
                                    size: 14,
                                },
                            },
                        },
                    },
                    animation: {
                        duration: 1000, // Animation duration
                        easing: 'easeInOutQuart', // Smooth animation
                    },
                }
            });
        } else {
            console.error("Failed to get 2D context.");
        }
    } else {
        console.error("Canvas element not found.");
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

    const canvas = document.getElementById("graphique-caisse-action");
    if (canvas) {
        console.log("Canvas element found.");

        // Get the 2D rendering context
        const ctx = canvas.getContext("2d");
        if (ctx) {
            console.log("2D context successfully retrieved.");

            // Destroy existing chart instance if it exists
            if (window.myChartCaisseAction) {
                window.myChartCaisseAction.destroy();
            }

            // Create gradient for "Entrées"
            const gradientEntrees = ctx.createLinearGradient(0, 0, 0, 400);
            gradientEntrees.addColorStop(0, 'rgba(75, 192, 192, 0.8)'); // Light color
            gradientEntrees.addColorStop(1, 'rgba(75, 192, 192, 0.2)'); // Dark color

            // Create gradient for "Sorties"
            const gradientSorties = ctx.createLinearGradient(0, 0, 0, 400);
            gradientSorties.addColorStop(0, 'rgba(255, 99, 132, 0.8)'); // Light color
            gradientSorties.addColorStop(1, 'rgba(255, 99, 132, 0.2)'); // Dark color

            // Create new chart with provided data
            window.myChartCaisseAction = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Entrées", "Sorties"],
                    datasets: [{
                        label: 'Montant (DT)',
                        data: [totalEntrees, totalSorties],
                        backgroundColor: [gradientEntrees, gradientSorties], // Use gradients
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'], // Border colors
                        borderWidth: 1,
                        borderRadius: 10, // Rounded corners
                        hoverBackgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'], // Hover effect
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false, // Hide legend
                        },
                        title: {
                            display: true,
                            text: 'Caisse Action', // Chart title
                            font: {
                                size: 18,
                                weight: 'bold',
                            },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(200, 200, 200, 0.2)', // Light grid lines
                            },
                            ticks: {
                                font: {
                                    size: 14,
                                },
                            },
                        },
                        x: {
                            grid: {
                                display: false, // Hide x-axis grid lines
                            },
                            ticks: {
                                font: {
                                    size: 14,
                                },
                            },
                        },
                    },
                    animation: {
                        duration: 1000, // Animation duration
                        easing: 'easeInOutQuart', // Smooth animation
                    },
                }
            });
        } else {
            console.error("Failed to get 2D context.");
        }
    } else {
        console.error("Canvas element not found.");
    }
}

// Fetch data when the page loads
document.addEventListener("DOMContentLoaded", () => {
    eel.mettre_a_jour_dashboard_caisse_membre();  // Fetch data for Caisse Membre dashboard
    eel.mettre_a_jour_dashboard_caisse_action();  // Fetch data for Caisse Action dashboard
    const actionCaisseMembreSelect = document.getElementById("action-caisse-membre");
    if (actionCaisseMembreSelect) {
        actionCaisseMembreSelect.addEventListener("change", () => {
            const selectedAction = actionCaisseMembreSelect.value;
            console.log("Selected action for graph update:", selectedAction);  // Debugging
            if (selectedAction) {
                eel.mettre_a_jour_graphique_caisse_membre(selectedAction);
            }
        });
    } else {
        console.error("Dropdown element with id 'action-caisse-membre' not found during DOMContentLoaded.");
    }
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
