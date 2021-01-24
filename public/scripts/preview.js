var current = document.querySelector('#current_webpage');
      var editTime = document.querySelector('#edit_time');
      current.innerHTML = `<div style="margin:25% 50%;" class = "mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>`;
       
      document.addEventListener('DOMContentLoaded', () => {
        var storage = firebase.storage();
        var db = firebase.database();

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

        firebase.auth().onAuthStateChanged(user => { 
          if (user) {
           
            ref.on("value", snapshot => {
              
              const data = snapshot.val();

              if(data !== null){
                console.log(data.timestamp)
                  editTime.innerHTML = Date(data.timestamp).toString()
                  
                  loadPage(`${slug}.html`)
                } else {
                  loadPage(`loading.html`)
                }
              })
            } else {
              console.log('no author')
            }
          });    

        try {
          let app = firebase.app();
        } catch (e) {
          console.error(e);
         
        }
      });