(function(){
  try {
    if (!window.firebase) {
      console.error('Firebase SDK non chargé — vérifiez les balises <script> firebase-app-compat et firebase-database-compat.');
      return;
    }
    const firebaseConfig = {
      apiKey: "AIzaSyBD5JhVwM7TbftbJTB-yceGT-YtfWsOHrs",
      authDomain: "les-jeux-mobile.firebaseapp.com",
      databaseURL: "https://les-jeux-mobile-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "les-jeux-mobile",
      storageBucket: "les-jeux-mobile.firebasestorage.app",
      messagingSenderId: "670922711584",
      appId: "1:670922711584:web:69406b1a2dc979395dd245"
    };
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  } catch (e) {
    console.error('Erreur d\'initialisation Firebase', e);
  }
})();
