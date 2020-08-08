const Webflow = require('webflow-api');
var auth = require('./auth.json');
const webflow = new Webflow({ token: auth.webflowToken})

//Called from bot.js. Updates Webflow collection based upon
//character and gil amount. Calls `PublishSite()` on success.
function UpdateValues(characterName, gilAmount){
  switch(characterName) {
    case 'pavel':
      const updatePavel = webflow.updateItem({
        collectionId: auth.collectionId,
        itemId: auth.pavelID,
        fields: {
          'total-gil': gilAmount,
          '_archived' : false,
          '_draft': false,
          'pavel-or-kyma': characterName,
          'percentage-complete': gilAmount / 25000000 * 100,
          'name': 'Pavel',
          'slug': 'magni-accusantium-dolores'
        }
      })
      updatePavel.then(pkg => {console.log(pkg); PublishSite()} , error => console.log(error));
      break;
    case 'kyma':
      const updateKyma = webflow.updateItem({
        collectionId: auth.collectionId,
        itemId: auth.kymaID,
        fields: {
          'total-gil': gilAmount,
          '_archived' : false,
          '_draft': false,
          'pavel-or-kyma': characterName,
          'percentage-complete': gilAmount / 25000000 * 100,
          'name': 'Kyma',
          'slug': 'sit-nam-voluptate'
        }
      })
      updateKyma.then(pkg => {console.log(pkg); PublishSite()} , error => console.log(error));
      break;
  }
}

//Pushes gil update live. Only runs if promise in 
//`UpdateValues()` returns successfully. 
function PublishSite(){
  const published = webflow.publishSite({ 
    siteId: '5f2c8f1c05ce2cb3da25fb81',
    domains: ['gilrace.com', 'gilrace.webflow.io']
  });
  published.then(pub => console.log(pub), error => console.log(error));
}

module.exports = { UpdateValues };