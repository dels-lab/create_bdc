// CREATION DES ENTREES DU TABLEAUX + CONFIGURATION
  // Créer les containers d'informations produits
  function initProduct (counter) {
    const mainContainer = document.getElementById('detailsFab');
    mainContainer.innerHTML= "";

    for (let i = 1; i <= counter; i++) {
      // Création article
      let newArticle = document.createElement('article');
      mainContainer.appendChild(newArticle);

      // Création title
      let newTitle = document.createElement('h3');
      newTitle.textContent = "Article N°" + i;
      newArticle.appendChild(newTitle);

      // Création container
      let subContainer = document.createElement('div');
      subContainer.setAttribute('id', 'product_' + i);
      newArticle.appendChild(subContainer);

      // Création container 'secret'
      let secretContainer = document.createElement('div');
      secretContainer.classList.add('secretContainer', 'gridColumn');
      newArticle.appendChild(secretContainer);


      // Création Gabarit
      createEntry(i, 'input', 'text', "Code gabarit", 'Gabarit', subContainer, 'MAR-F-DIV-MAN', 'required');

      createEntry(i, 'select', 'select', "Papier", 'paperType', subContainer, 'P000', 'required');
      createEntry(i, 'select', 'select', "Type d'impression", 'paperImpression', subContainer, 'I000', 'required');
      createEntry(i, 'input', 'number', "Quantité d'impression", 'paperQuantite', subContainer, '0', 'required');

      createEntry(i, 'select', 'select', "Enveloppe", 'enveloppeType', subContainer, 'E000', 'required');
      createEntry(i, 'select', 'select', "Type d'impression", 'enveloppeImpression', subContainer, 'I000', 'required');
      createEntry(i, 'input', 'number', "Quantité d'enveloppe", 'enveloppeQuantite', subContainer, '0', 'readonly');

      createEntry(i, 'input', 'checkbox', "Active 'Quantité enveloppe'", 'customQuantity', secretContainer);

      createEntry(i, 'input', 'text', 'N° Commande', 'Commande', secretContainer, 'M0710930000068', 'readonly');
      createEntry(i, 'input', 'text', 'Ref. template', 'Template', secretContainer, 'T000', 'readonly');
      createEntry(i, 'input', 'text', 'Ref. faconnage', 'Faconnage', secretContainer, 'F000', 'readonly');
      createEntry(i, 'input', 'text', 'Ref. rainage', 'Rainage', secretContainer, 'R000', 'readonly');
      createEntry(i, 'input', 'text', 'Ref. massicot', 'Massicot', secretContainer, 'M000', 'readonly');
    }
  }

  // Entrées pour renseigner les informations produits
  function createEntry (index, element, type, labelName, name, parent, placeholder, attribute) {
    let newContainer = document.createElement('div');
    newContainer.setAttribute('class', name)

    let newLabel = document.createElement('label');
    newLabel.textContent = labelName;

    let newInput = document.createElement(element);
    newInput.setAttribute('type', type);
    newInput.setAttribute('id', name + '_' + index);
    newInput.setAttribute('name', name + '_' + index);
    newInput.setAttribute('placeholder', placeholder);
    newInput.setAttribute(attribute, true)

    newContainer.appendChild(newLabel);
    newContainer.appendChild(newInput);
    parent.appendChild(newContainer);

    // Configuration spéciale pour l'input Gabarit
    // Affecte le n° de commande, template, rainage ...
    if (name == 'Gabarit') {
      newInput.addEventListener('change', function() {
        let productInfo = (newInput.value).split("-"); // (ex: ["MAR", "F", "CLA", "NOE"])
        let category = productInfo[0]; // (ex: MAR )
        let type = productInfo[1]; // (ex: F )
        let modele = productInfo[2] // (ex: CLA )

        if (category == 'PRO') {
          var productURL = '/src/json/products/' + category + '/' + type + '/' + modele + '/' + category + '-' + type + '-' + modele + '.json'
        } else {
          var productURL = '/src/json/products/' + category + '/' + type + '/' + category + '-' + type + '-' + modele + '.json'
        }
        
        // Fait remonter les infos template/rainage/faconnage/massicot selon gabarit
        fetchDataFromJsonFile(productURL, newInput.value)
        .then(data => {
          if (data.length > 0) {
            
            function setData (name) {
              let newData = document.getElementById(name + '_' + index);
              newData.value = data[0].values[name];
            }

            setData ('Template');
            setData ('Rainage');
            setData ('Massicot');
            setData ('Faconnage');

          } else {
            alert("Aucun modèle ne corresponds à cette valeur");
            newInput.value = ''
          }
          
        })

        // Met à jour le N° de commande
        let numCommande = document.getElementById('Commande_' + index);
        let getDate = document.getElementById('selectDate');
        dateObjet = new Date(getDate.value); 
        let commandeDate = customDate('2-digit', '2-digit', '2-digit').replaceAll('/', '');
        numCommande.value = (((newInput.value).toLocaleUpperCase()).charAt(0)) + commandeDate + '0000068';

      })
    }

    // Création des listes déroulantes
    // Impression, papier, enveloppes ...
    if (element === 'select') {
      if (checkPattern(placeholder) === true) {
        let firstLetter = placeholder.charAt(0);
        fetchDataFromJsonFile(getReference(firstLetter))
        .then(data => {

          function createOption (data) {
            let createOption = document.createElement('option');
            createOption.setAttribute('value', data.key);
            createOption.textContent = data.values['Libellé'];
            newInput.appendChild(createOption);
          }

          // Rempli les listes déroulantes
          if (firstLetter == 'I' && name.includes('paper')) {
            for (let entry of data) {
              if (entry.values['Standard'] == 'true' && (entry.values['Type'] == 'RICOH' || entry.values['Type'] == 'Aucun')) {
                createOption(entry);
              }
            }
          } else if (firstLetter == 'I' && name.includes('enveloppe')) {
            for (let entry of data) {
              if (entry.values['Standard'] == 'true' && (entry.values['Type'] == 'NERYOS' || entry.values['Type'] == 'Aucun'))  {
                createOption(entry);
              }
            }
          } else if (firstLetter != 'I') {
            for (let entry of data) {
              if (entry.values['Standard'] == 'true') {
                createOption(entry);
              }
            }
          }

        });
      }
    }

    // Contrôle des quantités
    if (name == 'paperQuantite' || name == 'customQuantity') {
      newInput.addEventListener('change', function() {
        let enveloppeQte = document.getElementById('enveloppeQuantite_' + index);

        // Attribue automatiquement la valeur de paperQte à enveloppeQte
        if (name == 'paperQuantite') {
          enveloppeQte.value = newInput.value
        }

        // Bouton pour activer la possibilité de changer la quantité pour l'enveloppe
        if (name == 'customQuantity') {
          let paperQte = document.getElementById('enveloppeQuantite_' + index);

          if (newInput.checked) {
            enveloppeQte.removeAttribute('readonly');
            enveloppeQte.setAttribute('required', 'required');
            enveloppeQte.style.border = '1px solid grey'
            enveloppeQte.style.color = 'black'

          } else {
            enveloppeQte.setAttribute('readonly', true);
            enveloppeQte.removeAttribute('required');
            enveloppeQte.style.border = '1px solid lightgrey';
            enveloppeQte.style.color = 'grey';
            enveloppeQte.value = paperQte.value;
          }

        }

      })
    }

  }

// RECUPERATION DES DONNEES
  // 1. Vérifie si le texte est une référence interne
  function checkPattern(text) {
    const pattern = /^[A-Z]\d{3}$/;
    return pattern.test(text);
  }

  // 2. Permet d'obtenir le lien vers données au format JSON
  function getReference(firstLetter) {
    const urlMap = {
      'C': './src/json/reference/conditionnement.json',
      'E': '/src/json/reference/enveloppes.json',
      'F': '/src/json/reference/faconnage.json',
      'I': '/src/json/reference/impression.json',
      'L': '/src/json/reference/livraison.json',
      'M': '/src/json/reference/massicot.json',
      'O': '/src/json/reference/options.json',
      'P': '/src/json/reference/papers.json',
      'R': '/src/json/reference/rainage.json',
      'T': '/src/json/reference/template.json'
    };

    const url = urlMap[firstLetter];

    if (url) {
      return url;
    } else {
      return null;
    }
  }

  // 3. Appel les données depuis fichier JSON
  function fetchDataFromJsonFile(url, keyToSearch = null) {
    // Utiliser fetch pour récupérer les données JSON à partir de l'URL
    return fetch(url)
        .then(function(response) {
            // Convertir la réponse en JSON
            return response.json();
        })
        
        .then(function(data) {
            // Convertir l'objet JSON en tableau d'objets avec des paires clé-valeur
            var arrayOfObjects = [];

            if (keyToSearch) {
              if (data.hasOwnProperty(keyToSearch)) {
                var key = keyToSearch;
                var values = data[keyToSearch]; // Valeurs correspondantes
                arrayOfObjects.push({ key: key, values: values });
              }
            } else {
              arrayOfObjects = Object.entries(data).map(function(entry) {
                var key = entry[0]; // Clé
                var values = entry[1]; // Valeurs correspondantes
                return { key: key, values: values }; // Créer un nouvel objet avec 'key' et 'values'
              });
            }

            return arrayOfObjects; // Retourner le tableau d'objets
        })

        .catch(function(error) {
            // Gérer les erreurs
            console.error(`Erreur lors de la récupération des données depuis ${url}:`, error);
            return []; // Retourner un tableau vide en cas d'erreur
        });
  }

// DIVERS
  function customDate (day, month, year) {
    let options = { day: day, month: month, year: year};
    let output = dateObjet.toLocaleDateString('fr-FR', options);
    return output;
  }

// DOM CONTENT
document.addEventListener('DOMContentLoaded', () => {
  const nbDocElement = document.getElementById('numberOfProducts');

  //1. Initialisation du tableau
  initProduct(nbDocElement.value); // Chargement de la page
  nbDocElement.addEventListener('change', function() {
      initProduct(nbDocElement.value); // Changement de l'input
  });

  // 2. Formatage de la date
  let getDate = document.getElementById('selectDate');

  getDate.addEventListener('input', function(){
  dateObjet = new Date(getDate.value); // 2024-02-03
  customDate('2-digit', 'long', 'numeric'); // '03 février 2024'

  let dateDeCommande = document.getElementById('date');
  dateDeCommande.value = customDate('2-digit', 'long', 'numeric');
  })

})