import { createApp } from 'vue';
import BDC from '../components/BDC.vue';
import axios from 'axios';

// Fonction générique pour récupérer des données à partir d'une liste de liens
async function fetchData(urls, key) {
  try {
    for (let url of urls) {
      const response = await axios.get(url);
      if (response.data.hasOwnProperty(key)) {
        return response.data[key];
      }
    }
    throw new Error(`La clé '${key}' n'a pas été trouvée dans les données.`);
  } catch (error) {
    throw new Error(`Une erreur s'est produite lors du chargement des données : ${error.message}`);
  }
}

// Récupération des données pour chaque produit
async function fetchProductData(product) {
  const templateUrl = '../src/json/reference/template.json';
  const rainageUrl = '../src/json/reference/rainage.json';
  const faconnageUrl = '../src/json/reference/faconnage.json';
  const massicotUrl = '../src/json/reference/massicot.json';

  try {
    const templatePromise = fetchData([templateUrl], product['template']);
    const rainagePromise = fetchData([rainageUrl], product['rainage']);
    const faconnagePromise = fetchData([faconnageUrl], product['faconnage']);
    const massicotPromise = fetchData([massicotUrl], product['massicot']);

    return await Promise.all([templatePromise, rainagePromise, faconnagePromise, massicotPromise]);
  } catch (error) {
    throw new Error(`Une erreur s'est produite lors de la récupération des données pour le produit : ${error.message}`);
  }
}

async function fetchInfoData(product) {
  const enveloppeUrl = '../src/json/reference/enveloppes.json';
  const impressionUrl = '../src/json/reference/impression.json';
  const papersUrl = '../src/json/reference/papers.json';

  try {
    const enveloppePromise = fetchData([enveloppeUrl], product['enveloppeType']);
    const paperImpressionPromise = fetchData([impressionUrl], product['paperImpression']);
    const paperPromise = fetchData([papersUrl], product['paperType']);
    const enveloppeImpressionPromise = fetchData([impressionUrl], product['enveloppeImpression']);

    return await Promise.all([enveloppePromise, paperImpressionPromise, paperPromise, enveloppeImpressionPromise]);
  } catch (error) {
    throw new Error(`Une erreur s'est produite lors de la récupération des informations pour le produit : ${error.message}`);
  }
}

// Récupération des données pour tous les produits
async function fetchTemplates(products) {
  const productDataPromises = products.map(product => fetchProductData(product));
  return Promise.all(productDataPromises);
}

async function fetchInformations(products) {
  const infoDataPromises = products.map(product => fetchInfoData(product));
  return Promise.all(infoDataPromises);
}

// Récupération des informations de commande
axios.get('../src/json/informations.json')
  .then(response => {
    console.log('Information.js est chargé')
    const informations = response.data;
    const commande = informations['commande'];
    const adresse = informations['adressBlock'];
    const products = informations['products'];

    console.log(products)

    // Récupération des templates et des informations supplémentaires
    Promise.all([fetchTemplates(products), fetchInformations(products)])
      .then(([productData, infoData]) => {
        // Utilisation des données récupérées
        const app = createApp(BDC, {
          commande,
          adresse,
          products,
          productData,
          infoData
        });

        app.mount('#BDC');
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données supplémentaires :', error);
      });
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors du chargement des données :', error);
  });



