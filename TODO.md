Définition de l'Interface de la Méthode push dans Django :

Objectif : Spécifier clairement comment la méthode push dans src/backend/core/api/viewsets.py recevra les données du client.
Format de la Requête (JSON Body) :
La méthode push attendra une requête POST (ou PUT, à déterminer selon la sémantique de "push").
Le corps de la requête sera du JSON et devra contenir au minimum :
Un identifiant pour le document concerné (par exemple, document_id).
Le contenu Markdown converti (par exemple, markdown_content: "<string_markdown>").
Potentiellement d'autres métadonnées ou champs requis par la logique de push.
Exemple de corps de requête :
{
  "document_id": "xyz789",
  "markdown_content": "# Titre du Document\n\nCeci est le contenu en Markdown.\n\n- Point 1\n- Point 2",
  // "version_id": "optional_version_identifier",
  // "commit_message": "optional_commit_message"
}

json


En-têtes de la Requête :
Content-Type: application/json
Les en-têtes d'authentification/autorisation habituels de l'API Django (probablement gérés par le framework DRF et la configuration OIDC existante, pas besoin de clé API spécifique pour cette interaction si c'est un utilisateur authentifié qui "push").
Réponse de l'API :
Succès : 200 OK ou 201 Created ou 204 No Content, selon l'action exacte de push. Avec un corps de réponse approprié si nécessaire (par exemple, confirmation, nouvelle version).
Erreur : Codes d'erreur standard (400 Bad Request pour données manquantes/invalides, 401 Unauthorized, 403 Forbidden, 404 Not Found si document_id n'existe pas, 500 Internal Server Error).
Action : Documenter cette interface.
Considérations pour l'implémentation Frontend :

Objectif : S'assurer que le client sait comment préparer et envoyer les données.
Logique Client :
Récupérer les Block[] de l'éditeur BlockNote.
Utiliser await editor.blocksToMarkdownLossy(selectedBlocks) pour convertir en chaîne Markdown.
Construire l'objet JSON de la requête (comme défini ci-dessus).
Effectuer l'appel HTTP POST/PUT à l'endpoint de la méthode push de Django.
Gérer la réponse de l'API (succès, erreurs).
Action : Ces détails seront pour le développeur frontend, mais il est bon de les avoir à l'esprit pour s'assurer que l'interface API est utilisable.
Validation du Plan par l'Utilisateur :

Objectif : Confirmer que cette définition de l'approche "sale mais simple" convient.
Action : Présenter ce plan (points 1 et 2) à l'utilisateur.
Écriture du Plan dans un Fichier Markdown (si l'utilisateur le souhaite) :

Objectif : Documenter le plan agréé.
Action : Si l'utilisateur est d'accord, utiliser write_to_file.
Passage à l'Implémentation (Mode Code) :

Objectif : Suggérer de passer au mode "Code" pour implémenter la méthode push dans Django selon les spécifications.
Action : Utiliser switch_mode.
Je vais maintenant présenter ce plan à l'utilisateur, en me concentrant sur la définition de l'interface pour la méthode push.
Parfait, nous allons donc procéder avec l'approche où la conversion des "blocks" BlockNote en Markdown est effectuée côté client (frontend), et la méthode push dans Django reçoit directement le contenu Markdown.

Voici un plan détaillé pour cette approche :

1. Définition de l'Interface pour la Méthode push dans Django

La méthode push (située dans src/backend/core/api/viewsets.py ou un fichier similaire) devra être conçue pour accepter les données suivantes :

Méthode HTTP : POST (typiquement utilisé pour créer de nouvelles ressources ou soumettre des données pour traitement). Si "push" implique une mise à jour d'une ressource existante avec un ID connu, PUT pourrait aussi être envisagé, mais POST est souvent plus flexible.
Endpoint : À définir dans les URL de Django (par exemple, /api/documents/<document_id>/push/ ou /api/push-content/).
En-têtes de la Requête :
Content-Type: application/json (obligatoire car le corps sera en JSON).
Les en-têtes d'authentification standard de votre application Django/DRF (par exemple, Authorization: Bearer <token_jwt> si vous utilisez JWT avec OIDC).
Corps de la Requête (JSON) :
{
  "document_id": "string", // Identifiant unique du document concerné
  "markdown_content": "string", // Contenu du document au format Markdown
  // Optionnel : Autres champs que la méthode "push" pourrait nécessiter
  // "version_name": "string", // Par exemple, un nom ou un tag pour cette version/push
  // "source_commit_id": "string" // Si pertinent pour votre logique de "push"
}

json


document_id : Pour identifier à quel document ce contenu appartient.
markdown_content : La chaîne de caractères contenant le Markdown généré par le client.
Réponse de l'API (Exemples) :
En cas de succès :
200 OK ou 202 Accepted : Si la soumission est acceptée pour traitement.
{
  "status": "success",
  "message": "Contenu reçu et en cours de traitement.",
  // "new_version_id": "v2_abc" // Si une nouvelle version est créée
}

json


204 No Content : Si l'action est réussie mais qu'il n'y a pas de contenu à retourner.
En cas d'erreur :
400 Bad Request : Si des champs requis sont manquants (document_id, markdown_content) ou si les données sont invalides.
{
  "error": "markdown_content is required."
}

json


401 Unauthorized / 403 Forbidden : Problèmes d'authentification/autorisation.
404 Not Found : Si le document_id fourni ne correspond à aucun document existant.
500 Internal Server Error : Pour les erreurs serveur inattendues.
2. Logique Côté Client (Frontend)

Pour rappel, le client devra :
a. Obtenir les Block[] de l'éditeur BlockNote.
b. Utiliser await editor.blocksToMarkdownLossy(blocks) pour les convertir en une chaîne Markdown.
c. Construire l'objet JSON (comme décrit ci-dessus) avec document_id et markdown_content.
d. Envoyer la requête POST à l'endpoint Django.
e. Gérer la réponse.

