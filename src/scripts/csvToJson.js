// CONVERTI ET PLACE LES FICHIERS DE CSV A JSON
// Importation des modules nécessaires
const fs = require('fs'); // Pour interagir avec le système de fichiers
const csv = require('csvtojson'); // Pour convertir CSV en JSON
const path = require('path'); // Pour manipuler les chemins de fichiers

// Chemins des dossiers de travail
const csvFolder = './public/csv'; // Dossier contenant les fichiers CSV
const jsonFolder = './src/json'; // Dossier où seront stockés les fichiers JSON

// Vérifie si un dossier existe
const folderExists = (folderPath) => {
  try {
    return fs.statSync(folderPath).isDirectory();
  } catch (error) {
    return false;
  }
};

// Crée un dossier s'il n'existe pas
const createFolderIfNotExists = (folderPath) => {
  // Vérifie si le dossier n'existe pas
  if (!folderExists(folderPath)) {
    // Crée le dossier avec l'option recursive: true
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Convertit un fichier CSV en JSON
const convertCsvToJson = async (csvFilePath, jsonFolderPath) => {
  // Conversion CSV en JSON
  const jsonArray = await csv({
    delimiter: ';',
    output: 'json'
  }).fromFile(csvFilePath);

  // Modification de la structure JSON
  const modifiedJsonArray = jsonArray.reduce((acc, row) => {
    const field1 = row['field1'];
    delete row['field1'];
    acc[field1] = row;
    return acc;
  }, {});


  // Création du fichier JSON
  const fileName = path.parse(csvFilePath).name + '.json';
  const jsonFilePath = path.join(jsonFolderPath, fileName);
  fs.writeFileSync(jsonFilePath, JSON.stringify(modifiedJsonArray, null, 2));
  //console.log(`Le fichier ${csvFilePath} a été converti en JSON avec le séparateur ';' et placé dans ${jsonFilePath}`);
};

// Parcourt les fichiers CSV et les convertit en JSON
const processCsvFiles = async (currentPath = csvFolder, jsonCurrentPath = jsonFolder) => {
  // Vérifie si le dossier CSV existe
  if (folderExists(currentPath)) {
    // Liste les éléments (fichiers et dossiers) du dossier actuel
    const elements = fs.readdirSync(currentPath);
    // Parcourt chaque élément
    for (const element of elements) {
      const elementPath = path.join(currentPath, element);
      const jsonElementPath = path.join(jsonCurrentPath, element);
      // Vérifie si l'élément est un dossier
      if (folderExists(elementPath)) {
        // Crée le dossier correspondant dans le dossier JSON
        createFolderIfNotExists(jsonElementPath);
        // Parcourt récursivement les fichiers et dossiers dans ce sous-dossier
        await processCsvFiles(elementPath, jsonElementPath);
      } else {
        // Vérifie si le chemin est un fichier CSV
        if (path.extname(elementPath).toLowerCase() === '.csv') {
          // Convertit le fichier CSV en JSON
          await convertCsvToJson(elementPath, jsonCurrentPath);
        }
      }
    }
  } else {
    console.error(`Le dossier spécifié "${currentPath}" n'existe pas.`);
  }
};

// Appel de la fonction pour démarrer le traitement des fichiers CSV
processCsvFiles();

