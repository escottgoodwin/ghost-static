const draftList = document.querySelector('#draft_list');
const publishedList = document.querySelector('#published_list');
const name = document.querySelector('#name');

document.addEventListener('DOMContentLoaded', () => {
  var functions = firebase.functions();
  var db = firebase.database();
  
  document.getElementById('quickstart-sign-in').addEventListener('click', signOut, false);

  function getPosts(){
    var addMessage = functions.httpsCallable('getAuthorDraftsCall');
      
      addMessage()
        .then((result) => {
    
          const drafts = result.data.drafts.map(p => `<p><a href="preview.html?slug=${p.slug}-${p.id}" target="_blank">${p.title}</a></p>`).join('')
          const published = result.data.published.map(p => `<p><a href="preview.html?slug=${p.slug}-${p.id}" target="_blank">${p.title}</a></p>`).join('')
  
          draftList.innerHTML = drafts
          publishedList.innerHTML = published
        }); 
  }

  function signOut() {
    firebase.auth().signOut();
  }
  
   firebase.auth().onAuthStateChanged(user => { 
    if (user) {
      
      const email = user.email.replace('@','_at_').replace('.','_dot_')
      console.log(email)
      var ref = db.ref(email);
      name.innerHTML = user.email

      getPosts();  

      ref.on("value", snapshot => {
        console.log(snapshot.val())
        const data = snapshot.val();

        if(data !== null){
          getPosts(); 
        }
      })

    } else {
      window.location.href = "/";
    }
   });

  try {
    let app = firebase.app();
  } catch (e) {
    console.error(e);
  }
});