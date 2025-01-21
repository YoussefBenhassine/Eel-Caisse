// dashboards.js


eel.expose(updateDashboardCaisseMembre);
function updateDashboardCaisseMembre(actions) {
    console.log("Received actions for dashboard:", actions);  
    const select = document.getElementById("action-caisse-membre");
    if (select) {
        select.innerHTML = "";
        actions.forEach(action => {
            const option = document.createElement("option");
            option.value = action;
            option.textContent = action;
            select.appendChild(option);
        });


        select.addEventListener("change", () => {
            const selectedAction = select.value;
            console.log("Selected action for graph update:", selectedAction);  
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
    console.log("Received graph data for Caisse Membre:", totalEntrees, totalSorties);  

    const canvas = document.getElementById("graphique-caisse-membre");
    if (canvas) {
        console.log("Canvas element found.");


        const ctx = canvas.getContext("2d");
        if (ctx) {
            console.log("2D context successfully retrieved.");

            if (window.myChartCaisseMembre) {
                window.myChartCaisseMembre.destroy();
            }

            const gradientEntrees = ctx.createLinearGradient(0, 0, 0, 400);
            gradientEntrees.addColorStop(0, 'rgba(75, 192, 192, 0.8)'); 
            gradientEntrees.addColorStop(1, 'rgba(75, 192, 192, 0.2)'); 


            const gradientSorties = ctx.createLinearGradient(0, 0, 0, 400);
            gradientSorties.addColorStop(0, 'rgba(255, 99, 132, 0.8)'); 
            gradientSorties.addColorStop(1, 'rgba(255, 99, 132, 0.2)'); 

   
            window.myChartCaisseMembre = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Entrées", "Sorties"],
                    datasets: [{
                        label: 'Montant (DT)',
                        data: [totalEntrees || 0, totalSorties || 0],  
                        backgroundColor: [gradientEntrees, gradientSorties],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'], 
                        borderWidth: 1,
                        borderRadius: 10,
                        hoverBackgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'], 
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false, 
                        },
                        title: {
                            display: true,
                            text: 'Caisse Membre', 
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
                                color: 'rgba(200, 200, 200, 0.2)', 
                            },
                            ticks: {
                                font: {
                                    size: 14,
                                },
                            },
                        },
                        x: {
                            grid: {
                                display: false, 
                            },
                            ticks: {
                                font: {
                                    size: 14,
                                },
                            },
                        },
                    },
                    animation: {
                        duration: 1000, 
                        easing: 'easeInOutQuart',
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
    console.log("Received totals for Caisse Action:", totalEntrees, totalSorties, solde);  
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
    console.log("Received graph data for Caisse Action:", totalEntrees, totalSorties);  

    const canvas = document.getElementById("graphique-caisse-action");
    if (canvas) {
        console.log("Canvas element found.");

 
        const ctx = canvas.getContext("2d");
        if (ctx) {
            console.log("2D context successfully retrieved.");

         
            if (window.myChartCaisseAction) {
                window.myChartCaisseAction.destroy();
            }

            
            const gradientEntrees = ctx.createLinearGradient(0, 0, 0, 400);
            gradientEntrees.addColorStop(0, 'rgba(75, 192, 192, 0.8)'); 
            gradientEntrees.addColorStop(1, 'rgba(75, 192, 192, 0.2)'); 

           
            const gradientSorties = ctx.createLinearGradient(0, 0, 0, 400);
            gradientSorties.addColorStop(0, 'rgba(255, 99, 132, 0.8)'); 
            gradientSorties.addColorStop(1, 'rgba(255, 99, 132, 0.2)'); 

            
            window.myChartCaisseAction = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Entrées", "Sorties"],
                    datasets: [{
                        label: 'Montant (DT)',
                        data: [totalEntrees, totalSorties],
                        backgroundColor: [gradientEntrees, gradientSorties], 
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'], 
                        borderWidth: 1,
                        borderRadius: 10, 
                        hoverBackgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'], 
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false, 
                        },
                        title: {
                            display: true,
                            text: 'Caisse Action', 
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
                                color: 'rgba(200, 200, 200, 0.2)', 
                            },
                            ticks: {
                                font: {
                                    size: 14,
                                },
                            },
                        },
                        x: {
                            grid: {
                                display: false, 
                            },
                            ticks: {
                                font: {
                                    size: 14,
                                },
                            },
                        },
                    },
                    animation: {
                        duration: 1000, 
                        easing: 'easeInOutQuart', 
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


document.addEventListener("DOMContentLoaded", () => {
    eel.mettre_a_jour_dashboard_caisse_membre();  
    eel.mettre_a_jour_dashboard_caisse_action(); 
    const actionCaisseMembreSelect = document.getElementById("action-caisse-membre");
    if (actionCaisseMembreSelect) {
        actionCaisseMembreSelect.addEventListener("change", () => {
            const selectedAction = actionCaisseMembreSelect.value;
            console.log("Selected action for graph update:", selectedAction);  
            if (selectedAction) {
                eel.mettre_a_jour_graphique_caisse_membre(selectedAction);
            }
        });
    } else {
        console.error("Dropdown element with id 'action-caisse-membre' not found during DOMContentLoaded.");
    }
});


const actionCaisseMembreSelect = document.getElementById("action-caisse-membre");
if (actionCaisseMembreSelect) {
    actionCaisseMembreSelect.addEventListener("change", () => {
        const selectedAction = actionCaisseMembreSelect.value;
        if (selectedAction) {
            eel.mettre_a_jour_graphique_caisse_membre(selectedAction);
        }
    });
}
