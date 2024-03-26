// PERMET DE MODIFIER LE FICHIER INFORMATIONS.JSON
const fs = require('fs');
const path = require('path');

class Product {
  constructor(numCommande, gabarit, paperType, template, paperImpression, paperQuantite, enveloppeType, enveloppeImpression, enveloppeQuantite, faconnage, rainage, massicot) {
      this.numCommande = numCommande;
      this.gabarit = gabarit;
      this.paperType = paperType;
      this.template = template;
      this.paperImpression = paperImpression;
      this.paperQuantite = paperQuantite;
      this.enveloppeType = enveloppeType;
      this.enveloppeImpression = enveloppeImpression;
      this.enveloppeQuantite = enveloppeQuantite;
      this.faconnage = faconnage;
      this.rainage = rainage;
      this.massicot = massicot;
    }
  }

function updateInformationFromRequest(req) {
  const filePath = path.join(__dirname, '../json/informations.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const jsonObject = JSON.parse(jsonData);

  // Mapping des champs 'statique' du formulaire aux propriétés du JSON
  const fieldMappings = {
    commande: ['date','numDossier', 'reference'],
    adressBlock: ['civility', 'lastName', 'firstName', 'deliveryPoint', 'buildingLocation', 'streetName', 'additionalLocation', 'postalCode', 'cityName'],
    expedition: ['conditionnement','option', 'routage'],
  };

    // Met à jour les données du JSON avec les valeurs du formulaire
    for (const [section, fields] of Object.entries(fieldMappings)) {
      for (const field of fields) {
        jsonObject[section][field] = req.body[field];
      }
    }

  // Mapping des champs 'dynamique' du formulaire aux propriétés du JSON
  const numberOfProducts = parseInt(req.body.numberOfProducts);
    
    jsonObject.products = [];


    // Créer une instance de class pour chaques produits
    for (let i = 1; i <= numberOfProducts; i++) {
      const numCommande = req.body[`numCommande_${i}`];
      const gabarit = req.body[`Gabarit_${i}`];
      const paperType = req.body[`paperType_${i}`];
      const template = req.body[`Template_${i}`];
      const paperImpression = req.body[`paperImpression_${i}`];
      const paperQuantite = req.body[`paperQuantite_${i}`];
      const enveloppeType = req.body[`enveloppeType_${i}`];
      const enveloppeImpression = req.body[`enveloppeImpression_${i}`];
      const enveloppeQuantite = req.body[`enveloppeQuantite_${i}`];
      const faconnage = req.body[`Faconnage_${i}`];
      const rainage = req.body[`Rainage_${i}`];
      const massicot = req.body[`Massicot_${i}`];
  
      const product = new Product(numCommande, gabarit, paperType, template, paperImpression, paperQuantite, enveloppeType, enveloppeImpression, enveloppeQuantite, faconnage, rainage, massicot);
      jsonObject.products.push(product);
    }
  
  const modifiedJsonData = JSON.stringify(jsonObject, null, 2);
  fs.writeFileSync(filePath, modifiedJsonData, 'utf-8');

  console.log('File "informations.json" updated successfully.');
}

module.exports = { updateInformationFromRequest };
