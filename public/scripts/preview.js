var current = document.querySelector('#current_webpage');

document.addEventListener('DOMContentLoaded', () => {
  var storage = firebase.storage();
  var db = firebase.database();
  var auth = firebase.auth();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')

  function loadPage(path){
    var pathReference = storage.ref(path);
  
    pathReference.getDownloadURL().then(url => {
      console.log(url)
        const iframe = `<iframe src="${url}" title="Ghost Preview" height="700" ></iframe>`
        current.innerHTML = iframe;
      });
  }

  var ref = db.ref(id);

  auth.onAuthStateChanged(user => { 
    if (user) {
      
      ref.on("value", snapshot => {
        
        const data = snapshot.val();
        console.log(data)
        if(data !== null){
            loadPage(`${id}.html`)
          } else {
            loadPage(`loading.html`)
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