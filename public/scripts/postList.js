const draftList = document.querySelector('#draft_list');
const publishedList = document.querySelector('#published_list');
const name = document.querySelector('#name');

document.addEventListener('DOMContentLoaded', () => {
  var functions = firebase.functions();

  document.getElementById('quickstart-sign-in').addEventListener('click', signOut, false);

  function signOut() {
    firebase.auth().signOut();
  }
  
   firebase.auth().onAuthStateChanged(user => { 
    if (user) {
      name.innerHTML = user.email

      var addMessage = firebase.functions().httpsCallable('getAuthorDraftsCall');
      
      addMessage()
        .then((result) => {
    
          const drafts = result.data.drafts.map(p => `<p><a href="preview.html?slug=${p.slug}-${p.id}" target="_blank">${p.title}</a></p>`).join('')
          const published = result.data.published.map(p => `<p><a href="preview.html?slug=${p.slug}-${p.id}" target="_blank">${p.title}</a></p>`).join('')
  
          draftList.innerHTML = drafts
          publishedList.innerHTML = published
        }); 

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