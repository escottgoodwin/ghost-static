var current = document.querySelector('#current_webpage');

document.addEventListener('DOMContentLoaded', () => {
  var storage = firebase.storage();
  var db = firebase.database();
  var auth = firebase.auth();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const slug = urlParams.get('slug')

  function loadPage(path){
    var pathReference = storage.ref(path);
  
    pathReference.getDownloadURL().then(url => {
        const iframe = `<iframe src="${url}" title="Ghost Preview" height="700" ></iframe>`
        current.innerHTML = iframe;
      });
  }

  var ref = db.ref(slug);

  auth.onAuthStateChanged(user => { 
    if (user) {
      
      ref.on("value", snapshot => {
        
        const data = snapshot.val();

        if(data !== null){
            loadPage(`${slug}.html`)
          } else {
            loadPage(`loading.htm`)
          }
        })
      } else {
        console.log('no author')
      }
    });    

  try {
    firebase.app();
  } catch (e) {
    console.error(e);
    
  }
});