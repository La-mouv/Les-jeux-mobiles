(function(){
  const GAMES = [
    { key:'jeu5', title:"SUB'Collect", desc:"Cliquez sur les SUB et évitez les pièges pendant 20 s.", page:'jeuVélo/jeu5.html', bg:'images/imageJeu5.jpg' },
    { key:'jeu1', title:"Dacty'SUB", desc:"Tapez les mots à toute vitesse : rapidité = points.", page:'jeuTyping/jeu1.html', bg:'images/ImageJeu1.png' },
    { key:'jeu3', title:"SUB'Click", desc:"Cliquez le carré vert un maximum de fois en 10 s.", page:'jeuClique/jeu3.html', bg:'images/imageJeu3.jpg' },
    { key:'jeu4', title:"Memory'SUB", desc:"Mémorisez et retrouvez les SUB cachés : précision = points.", page:'jeuPoints/jeu4.html', bg:'images/imageJeu4.jpg' },
    { key:'jeu6', title:"SUB l'éclair", desc:"Cliquez pour préparer la commande dès que les feux s'éteignent. Réactivité = points.", page:'jeuF1/jeu6.html', bg:'images/imageJeu6.jpg' },
    { key:'jeu2', title:"SUB'Dessin", desc:"Dessinez le SUB d'un seul trait. Précision = points.", page:'DessinOlympique/jeu2.html', bg:'images/ImageJeu2.png' }
  ];
  const byKey = {};
  GAMES.forEach(g => { byKey[g.key] = g; });
  window.GAMES = GAMES;
  window.GAMES_BY_KEY = byKey;
})();
