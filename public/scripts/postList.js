const draftList = document.querySelector('#draft_list');
const publishedList = document.querySelector('#published_list');
const userName = document.querySelector('#name');

document.addEventListener('DOMContentLoaded', () => {
  var functions = firebase.functions();
  var db = firebase.database();
  
  document.getElementById('quickstart-sign-in').addEventListener('click', signOut, false);

  function getPosts(){

    var authorPosts = functions.httpsCallable('getAuthorPosts');
      
    authorPosts()
        .then((result) => {
          const { drafts, published }  = result.data
  
          draftList.innerHTML = drafts.map(p => 
            `<p><a href="preview.html?id=${p.id}" target="_blank">${p.title}</a></p>`)
            .join('')

          publishedList.innerHTML = published.map(p => 
            `<p><a href="preview.html?id=${p.id}" target="_blank">${p.title}</a></p>`)
            .join('')
        }); 
  }

  function signOut() {
    firebase.auth().signOut();
  }
  
   firebase.auth().onAuthStateChanged(user => { 
    if (user) {
      const email = user.email.replace('@','_at_').replace('.','_dot_');

      var ref = db.ref(email);
      
      userName.innerHTML = user.email;

      getPosts();  

      ref.on("value", snapshot => {
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