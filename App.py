import eel
from pymongo import MongoClient
from datetime import datetime
import logging

# Initialize Eel
eel.init('web')

# MongoDB connection
client = MongoClient("", serverSelectionTimeoutMS=5000)
db = client["Leo"]
collection_cotisations = db["cotisations"]
collection_caisse_membre = db["caisse_membre"]
collection_actions = db["actions"]
try:
    test_data = collection_cotisations.find_one()
    print("Test data from MongoDB:", test_data)
except Exception as e:
    print("Error connecting to MongoDB:", str(e))
# Expose Python functions to JavaScript
@eel.expose
def ajouter_cotisation(nom, montant):
    try:
        membre = collection_cotisations.find_one({"nom": nom})
        if membre:
            nouveau_montant = float(membre.get("cotisation", 0)) + montant
            collection_cotisations.update_one({"nom": nom}, {"$set": {"cotisation": nouveau_montant}})
        else:
            numero = collection_cotisations.count_documents({}) + 1
            collection_cotisations.insert_one({"numero": numero, "nom": nom, "cotisation": montant})

        total_cotisations = sum(membre["cotisation"] for membre in collection_cotisations.find())
        collection_caisse_membre.delete_many({"libelle": {"$regex": "Total des cotisations"}})
        transaction = {
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "libelle": f"Total des cotisations : {total_cotisations:.2f} DT",
            "entree": montant,
            "sortie": 0,
            "total": total_cotisations,
        }
        collection_caisse_membre.insert_one(transaction)

        eel.showSuccess("Cotisation enregistrée avec succès !")
        eel.rafraichir_cotisations()
        eel.rafraichir_caisse_membre()
        eel.mettre_a_jour_total_cotisations()
    except Exception as e:
        eel.showError(f"Erreur lors de l'ajout de la cotisation : {str(e)}")

@eel.expose
def rafraichir_cotisations():
    try:
        cotisations = list(collection_cotisations.find().sort("_id", -1).limit(100))
        eel.updateCotisations([{"numero": m["numero"], "nom": m["nom"], "cotisation": m["cotisation"]} for m in cotisations])
    except Exception as e:
        eel.showError(f"Erreur lors du rafraîchissement des cotisations : {str(e)}")

@eel.expose
def ajouter_transaction_caisse_membre(libelle, montant, type_transaction):
    try:
        if type_transaction not in ["entrée", "sortie"]:
            eel.showError("Type invalide. Veuillez choisir 'entrée' ou 'sortie'.")
            return

        derniere_transaction = collection_caisse_membre.find_one(sort=[("_id", -1)])
        total_actuel = derniere_transaction["total"] if derniere_transaction else 0
        if type_transaction == "entrée":
            total_actuel += montant
        else:
            total_actuel -= montant

        transaction = {
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "libelle": libelle,
            "entree": montant if type_transaction == "entrée" else 0,
            "sortie": montant if type_transaction == "sortie" else 0,
            "total": total_actuel,
        }
        collection_caisse_membre.insert_one(transaction)

        eel.showSuccess("Transaction enregistrée avec succès !")
        eel.rafraichir_caisse_membre()
    except Exception as e:
        eel.showError(f"Erreur lors de l'ajout de la transaction : {str(e)}")

@eel.expose
def rafraichir_caisse_membre():
    try:
        transactions = list(collection_caisse_membre.find().sort("date", -1).limit(100))
        eel.updateCaisseMembre([{"date": t["date"], "libelle": t["libelle"], "entree": t["entree"], "sortie": t["sortie"], "total": t["total"]} for t in transactions])
    except Exception as e:
        eel.showError(f"Erreur lors du rafraîchissement de la caisse membre : {str(e)}")

@eel.expose
def ajouter_transaction_action(action, libelle, montant, type_transaction):
    try:
        # Debug: Print received data
        print(f"Received data - Action: {action}, Libellé: {libelle}, Montant: {montant}, Type: {type_transaction}")

        # Validate the transaction type
        if type_transaction not in ["entrée", "sortie"]:
            eel.showError("Type invalide. Veuillez choisir 'entrée' ou 'sortie'.")
            return

        # Create the transaction document
        transaction = {
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "action": action,
            "libelle": libelle,
            "montant": montant,
            "type": type_transaction,
        }

        # Insert the transaction into the database
        result = collection_actions.insert_one(transaction)
        print(f"Transaction inserted with ID: {result.inserted_id}")  # Debug

        # Verify that the transaction was inserted
        if result.inserted_id:
            print("Transaction successfully inserted into MongoDB.")
        else:
            print("Failed to insert transaction into MongoDB.")

        # Notify the frontend
        eel.showSuccess("Transaction enregistrée avec succès !")
        
        # Refresh the transactions list
        eel.rafraichir_actions()
    except Exception as e:
        print(f"Error inserting transaction into MongoDB: {str(e)}")  # Debug
        eel.showError(f"Erreur lors de l'ajout de la transaction : {str(e)}")

@eel.expose
def afficher_historique_action(action):
    try:
        transactions = list(collection_actions.find({"action": action}))
        eel.updateActions([{"date": t["date"], "libelle": t["libelle"], "type": t["type"], "montant": t["montant"]} for t in transactions])
    except Exception as e:
        eel.showError(f"Erreur lors de l'affichage de l'historique : {str(e)}")

@eel.expose
def rafraichir_actions():
    try:
        # Fetch the latest transactions from the database
        transactions = list(collection_actions.find().sort("date", -1).limit(100))
        
        # Send the transactions to the frontend
        eel.updateActions([{
            "date": t["date"],
            "libelle": t["libelle"],
            "type": t["type"],
            "montant": t["montant"]
        } for t in transactions])
    except Exception as e:
        eel.showError(f"Erreur lors du rafraîchissement des actions : {str(e)}")

@eel.expose
def mettre_a_jour_total_cotisations():
    try:
        total_cotisations = sum(membre["cotisation"] for membre in collection_cotisations.find())
        eel.updateTotalCotisations(total_cotisations)
    except Exception as e:
        eel.showError(f"Erreur lors de la mise à jour du total des cotisations : {str(e)}")

@eel.expose
def mettre_a_jour_dashboard_caisse_membre():
    try:
        actions = collection_actions.distinct("action")
        eel.updateDashboardCaisseMembre(actions)  # Send actions to JavaScript

        # Initialize the chart with zero data until an action is selected
        eel.updateGraphiqueCaisseMembre(0, 0)  # Set default empty graph
        return {"status": "success"}  # Always return a value
    except Exception as e:
        return {"status": "error", "message": str(e)}  # Return an error message if something goes wrong


@eel.expose
def mettre_a_jour_dashboard_caisse_action():
    try:
        transactions = list(collection_actions.find())
        total_entrees = sum(t["montant"] for t in transactions if t["type"] == "entrée")
        total_sorties = sum(t["montant"] for t in transactions if t["type"] == "sortie")
        solde = total_entrees - total_sorties

        eel.updateDashboardCaisseAction(total_entrees, total_sorties, solde)
        eel.updateGraphiqueCaisseAction(total_entrees, total_sorties)
        return {"status": "success"}  # Always return a value
    except Exception as e:
        return {"status": "error", "message": str(e)}  # Return an error message if something goes wrong

@eel.expose
def mettre_a_jour_graphique_caisse_membre(action):
    try:
        # Fetch transactions for the selected action
        transactions = list(collection_actions.find({"action": action}))
        print(f"Transactions for action '{action}':", transactions)  # Debugging

        # Calculate total entrées and sorties
        total_entrees = sum(t.get("montant", 0) for t in transactions if t.get("type") == "entrée")
        total_sorties = sum(t.get("montant", 0) for t in transactions if t.get("type") == "sortie")
        print(f"Calculated totals - Entrées: {total_entrees}, Sorties: {total_sorties}")  # Debugging

        # Send data to the frontend
        eel.updateGraphiqueCaisseMembre(total_entrees, total_sorties)
    except Exception as e:
        print(f"Error in mettre_a_jour_graphique_caisse_membre: {str(e)}")
        eel.showError(f"Erreur lors de la mise à jour du graphique : {str(e)}")



@eel.expose
def mettre_a_jour_graphique_caisse_action():
    try:
        transactions = list(collection_actions.find())
        total_entrees = sum(t["montant"] for t in transactions if t["type"] == "entrée")
        total_sorties = sum(t["montant"] for t in transactions if t["type"] == "sortie")
        eel.updateGraphiqueCaisseAction(total_entrees, total_sorties)
    except Exception as e:
        eel.showError(f"Erreur lors de la mise à jour du graphique : {str(e)}")

@eel.expose
def mettre_a_jour_liste_actions():
    try:
        actions = collection_actions.distinct("action")
        eel.updateListeActions(actions)
    except Exception as e:
        eel.showError(f"Erreur lors de la mise à jour de la liste des actions : {str(e)}")

logging.basicConfig(level=logging.DEBUG)
def _process_message(message):
    logging.debug(f"Received message: {message}")
    if 'value' not in message:
        logging.error("Missing 'value' key in message")



# Start the Eel application
mettre_a_jour_liste_actions()
mettre_a_jour_dashboard_caisse_membre()
mettre_a_jour_dashboard_caisse_action()
eel.start('home.html', size=(1200, 700),mode='edge', port=0)
