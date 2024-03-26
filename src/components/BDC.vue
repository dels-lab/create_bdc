<script>
export default {
  props: ['commande', 'adresse', 'products', 'productData', 'infoData'],
  data() {
        return {
            totalAmount: [] // Tableau pour stocker les montants de chaque ligne
        };
    },
  methods : {
    calcPU(quantite, pose, price1, price2){
      var PU
      if(quantite < 400) {PU = parseFloat(price1.replace(',', '.')).toFixed(2)} 
      else {PU = parseFloat(price2.replace(',', '.')).toFixed(2)}
      return parseFloat(PU/pose).toFixed(2);
    },

    calcMontant(price, unite, quantite){
      var Unite
      if (unite === "M") {Unite = 1000} 
      else if (unite === "U") {Unite = 1}
      this.totalAmount.push(price/Unite*quantite);
      return (price/Unite*quantite).toFixed(2);
    },

    calcAmount(amount){
      var total = amount.reduce((total, value) => total + value, 0);
      return total
    }
  }
}
</script>

<template>
  <header class="flexRow_between">
    <img style="height: 100px;" src="../assets/logo.png" alt="Logo Impress Them">

    <div>
        <h1>Bon de commande</h1>
        <span id="commande_date">{{ commande.date }}</span>
    </div>
  </header>

  <main>
    <section id="infoCommande" class="flexRow_between">
      <ul>
          <li><b>Contact :</b> Vivien MARTINEZ</li>
          <li><b>E-mail :</b> vmartinez@impressthem.fr</li>
          <li><b>Tél :</b> 06 48 97 30 06</li>
      </ul>

      <ul>
          <b style="font-size:1.2em; text-transform: uppercase;">Commande à :</b>
          <li>DATAONE</li>
          <li>ZI Les Champs Chouette</li>
          <li>A13 - Sortie 17</li>
          <li>27600 Saint-Aubin sur Gaillon</li>
          <li>Contact : Delphine MERIEL</li>
      </ul>
    </section>

    <section class="flexRow_between">
      <ul>
        <b style="font-size:1.2em; text-transform: uppercase;">Adresse de facturation</b>
        <li>IMPRESS THEM</li>
        <li>Vivien Martinez</li>
        <li>40,rond-point Julius Estève</li>
        <li>34400 Lunel</li>
      </ul>

      <ul>
        <b style="font-size:1.2em; text-transform: uppercase;">Adresse de livraison</b>

        <li>
          <span>{{ adresse.civility }} {{ adresse.lastName }} {{ adresse.firstName }}</span><br>
          <span>{{ adresse.deliveryPoint }}</span><br>
          <span>{{ adresse.buildingLocation }}</span><br>
          <span>{{ adresse.streetName }}</span><br>
          <span>{{ adresse.additionalLocation }}</span><br>
          <span>{{ adresse.postalCode }} {{ adresse.cityName }}</span>
        </li>
      </ul>
    </section>

    <section>
      <ul>
          <li>
              <b>Référence :</b>
              <span id="commande_reference">{{ commande.reference }}</span>
          </li>

          <li>
              <b>N° Dossier D1 :</b>
              <span id="commande_numDossier">{{ commande.numDossier }}</span>
          </li>
      </ul>
    </section>

    <table>

      <thead>
          <tr>
              <th><h2>Désignation</h2></th>
              <th><h2>U</h2></th>
              <th><h2>Qte</h2></th>
              <th><h2>Poids</h2></th>
              <th><h2>P.U HT</h2></th>
              <th><h2>Montant</h2></th>
          </tr>
      </thead>

      <tbody id="productsTable">
          <tr v-for="(product, index) in products" :key="index">
              <td colspan="6">
                  <table>
                    <!-- INFOS -->
                      <!-- N° Commande-->
                      <tr>
                          <td colspan="6">
                            {{ product.numCommande }} (
                            {{ product.gabarit }} / 
                            {{ product.template }} )
                          </td>
                      </tr>

                    <!-- PAPER -->
                      <!-- Format ouvert-->
                      <tr>
                        <td colspan="6">Format ouvert : {{ productData[index][0]['Format_ouvert'] }} mm</td>
                      </tr>

                      <!-- Format fermé-->
                      <tr>
                        <td colspan="6">Format fermé : {{ productData[index][0]['Format_ferme'] }} mm</td>
                      </tr>

                      <!-- Type de papier-->
                      <tr>
                          <td>{{ infoData[index][2]['Libellé']}}</td>
                          <td>{{ infoData[index][2]['Unité']}}</td>
                          <td>{{ product.paperQuantite }}</td>
                          <td>{{ infoData[index][2]['Poids']}} gr</td>
                          <td>{{ calcPU(product.paperQuantite,productData[index][0]['Pose'], infoData[index][2]['PU_tranche01'], infoData[index][2]['PU_tranche01']) }} €</td>
                          <td>{{ calcMontant(calcPU(product.paperQuantite,productData[index][0]['Pose'], infoData[index][2]['PU_tranche01'], infoData[index][2]['PU_tranche01']), infoData[index][2]['Unité'], product.paperQuantite) }} €</td>
                      </tr>

                      <!-- Impression numérique-->
                      <tr>
                          <td>{{ infoData[index][1]['Libellé']}}</td>
                          <td>{{ infoData[index][1]['Unité']}}</td>
                          <td>{{ product.paperQuantite }}</td>
                          <td></td>
                          <td>{{ calcPU(product.paperQuantite,productData[index][0]['Pose'], infoData[index][1]['PU_tranche01'], infoData[index][1]['PU_tranche01']) }} €</td>
                          <td>{{ calcMontant(calcPU(product.paperQuantite,productData[index][0]['Pose'], infoData[index][1]['PU_tranche01'], infoData[index][1]['PU_tranche01']), infoData[index][1]['Unité'], product.paperQuantite) }} €</td>
                      </tr>

                      <tr>
                        <td colspan="6">Personnalisation sur {{ infoData[index][1]['Type'] }}</td>
                      </tr>

                      <!-- Format d'impression-->
                      <tr>
                        <td colspan="6">Format d'impression : 450x320 mm</td>
                      </tr>

                      <!-- Format d'impression-->
                      <tr>
                        <td colspan="6">Nb de poses : {{ productData[index][0]['Pose'] }} </td>
                      </tr>

                    <!-- Massicot / Rainage / Faconnage -->
                      <tr v-for="(item, itemIndex) in productData[index]" :key="itemIndex">
                          <template v-if="itemIndex > 0">
                              <td>{{ item['Libellé'] }}</td>
                              <td>{{ item['Unité'] }}</td>
                              <td>{{ product.paperQuantite }}</td>
                              <td></td>
                              <td>{{ calcPU(product.paperQuantite,productData[index][0]['Pose'], item['PU_tranche01'], item['PU_tranche02']) }} €</td>
                              <td>{{ calcMontant(calcPU(product.paperQuantite,productData[index][0]['Pose'], item['PU_tranche01'], item['PU_tranche02']), item['Unité'], product.paperQuantite) }} €</td>
                          </template>
                      </tr>

                    <!-- ENVELOPPE -->
                      <!-- Type d'enveloppe -->
                      <tr>
                          <td>{{ infoData[index][0]['Libellé']}}</td>
                          <td>{{ infoData[index][0]['Unité']}}</td>
                          <td>{{ product.paperQuantite }}</td>
                          <td>{{ infoData[index][0]['Poids']}} gr</td>
                          <td>{{ calcPU(product.paperQuantite,productData[index][0]['Pose'], infoData[index][0]['PU_tranche01'], infoData[index][0]['PU_tranche01']) }} €</td>
                          <td>{{ calcMontant(calcPU(product.paperQuantite,productData[index][0]['Pose'], infoData[index][0]['PU_tranche01'], infoData[index][0]['PU_tranche01']), infoData[index][0]['Unité'], product.paperQuantite) }} €</td>
                      </tr>
                    
                      <!-- Impression numérique -->
                      <tr>
                          <td>{{ infoData[index][3]['Libellé']}}</td>
                          <td>{{ infoData[index][3]['Unité']}}</td>
                          <td>{{ product.paperQuantite }}</td>
                          <td></td>
                          <td>{{ calcPU(product.paperQuantite,productData[index][0]['Pose'], infoData[index][3]['PU_tranche01'], infoData[index][3]['PU_tranche01']) }} €</td>
                          <td>{{ calcMontant(calcPU(product.paperQuantite,productData[index][0]['Pose'], infoData[index][3]['PU_tranche01'], infoData[index][3]['PU_tranche01']), infoData[index][3]['Unité'], product.paperQuantite) }} €</td>
                      </tr>

                      <tr>
                        <td colspan="6">Personnalisation sur {{ infoData[index][3]['Type'] }}</td>
                      </tr>
                      
                  </table>
              </td>
          </tr>
      </tbody>

      <tfoot>
          <tr>
              <td style="background-color: #48bac3; color: white;">
                  <h2>Conditions de règlement :</h2>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td><span>Total HT</span></td>
              <td style="text-align: center;">{{ calcAmount(this.totalAmount).toFixed(2) }} €</td>
          </tr>
          <tr>
              <td>
                  <span>30 jours</span>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td><span>TVA 20%</span></td>
              <td style="text-align: center;">{{ (20 * calcAmount(this.totalAmount) / 100).toFixed(2) }}  €</td>
          </tr>
          <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td><span>TOTAL TTC</span></td>
              <td style="text-align: center;">{{ (calcAmount(this.totalAmount) + (20 * calcAmount(this.totalAmount) / 100)).toFixed(2)}} €</td>
          </tr>
      </tfoot>

      </table>
  </main>
</template>

<style scoped>
/* Styles de votre composant */
</style>