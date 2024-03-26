// 1. Importation des modules nécessaires 
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');

// Imporation des scripts nécessaires
const { updateInformationFromRequest } = require('./src/scripts/updateInformation');

// 2. Configuration initiale d'Express
const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

// 3. Gestion des fichiers statiques
app.use(express.static(path.join(__dirname)));
app.use('/scripts', express.static(path.join(__dirname, 'src', 'scripts')));
app.use('/styles', express.static(path.join(__dirname, 'src', 'styles')));
app.use('/json', express.static(path.join(__dirname, 'src', 'json')));

// 4. Definition des routes
// Route pour exécuter le script csvToJson après le chargement de la page index.html
app.get('/run-csv-to-json', (req, res) => {
  // Appeler la fonction csvToJson pour exécuter le script
  csvToJson();
  // Renvoyer une réponse indiquant que le script a été exécuté avec succès
  res.send('Le script csvToJson a été exécuté avec succès!');
});

// Route pour le script d'exécution (formulaire)
app.post('/executer-script', (req, res) => {
  // Appel de la fonction pour mettre à jour les informations à partir de la requête
  updateInformationFromRequest(req);
  res.send('Script exécuté avec succès!');
});

// Route pour générer et télécharger le fichier PDF
app.get('/generate-pdf', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Attendez que le DOM soit chargé, y compris les ressources supplémentaires chargées dynamiquement.
  await page.goto('file://' + __dirname + '/public/BDC.html', { waitUntil: 'load' });

  const pdfPath = 'bon_de_commande.pdf';
  await page.pdf({ path: pdfPath, format: 'A4' });
  
  await browser.close();

  const pdfData = fs.readFileSync(pdfPath);
  res.contentType("application/pdf");
  res.send(pdfData);
  fs.unlinkSync(pdfPath); // Supprimer le fichier PDF après l'envoi
});

// 5. Exécution du serveur :
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
