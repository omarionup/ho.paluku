const ADMIN_EMAIL = 'admin@fondationpsmk.cd';
const ADMIN_PASSWORD = 'admin123';
let estConnecteAdmin = false;

function initProjetsDefaut() {
  if (!localStorage.getItem('projets')) {
    const defaut = [
      { id: 1, nom: "Campagne de sensibilisation communautaire", description: "Rencontres dans les villages pour échanger sur les priorités du territoire.", statut: "en-cours" },
      { id: 2, nom: "Appui à l'éducation et à la formation", description: "Distribution de matériel scolaire et bourses pour élèves méritants.", statut: "en-cours" }
    ];
    localStorage.setItem('projets', JSON.stringify(defaut));
  }
}

function chargerInfosUne() {
  const conteneur = document.getElementById('liste-infos-une');
  if (!conteneur) return;
  const infos = JSON.parse(localStorage.getItem('infosUne') || '[]');
  if (infos.length === 0) return;
  conteneur.innerHTML = '';
  infos.forEach(info => {
    conteneur.innerHTML += `
      <div class="alrte-boite">
        <h4>${info.titre}</h4>
        <p>${info.contenu}</p>
      </div>`;
  });
}

function chargerProjets() {
  const conteneur = document.getElementById('liste-projets');
  if (!conteneur) return;
  const projets = JSON.parse(localStorage.getItem('projets') || '[]');
  if (projets.length === 0) {
    conteneur.innerHTML = '<p class="texte-centre note">Aucun projet pour le moment.</p>';
    return;
  }
  conteneur.innerHTML = '';
  projets.forEach(p => {
    const statutTexte = { 'en-cours': 'En cours', 'a-venir': 'À venir', 'termine': 'Terminé' };
    conteneur.innerHTML += `
      <div class="action">
        <h4>${p.nom}</h4>
        <p>${p.description}</p>
        <span class="projet-statut">${statutTexte[p.statut]}</span>
      </div>`;
  });
}

function chargerSuggestionsPublique() {
  const conteneur = document.getElementById('liste-suggestions-accueil');
  if (!conteneur) return;
  const approuvees = JSON.parse(localStorage.getItem('suggestionsApprouvees') || '[]');
  if (approuvees.length === 0) {
    conteneur.innerHTML = '<p class="texte-centre note">Les suggestions approuvées apparaîtront ici.</p>';
    return;
  }
  conteneur.innerHTML = '';
  approuvees.forEach(s => {
    conteneur.innerHTML += `
      <div class="suggestion-affichee">
        <div class="suggestion-auteur">${s.nom}</div>
        <div class="suggestion-date">${s.date}</div>
        <div class="suggestion-texte">${s.texte}</div>
      </div>`;
  });
}

function chargerSuggestionsEnAttente() {
  const conteneur = document.getElementById('liste-sugg-en-attente');
  if (!conteneur) return;
  const enAttente = JSON.parse(localStorage.getItem('suggestionsEnAttente') || '[]');
  if (enAttente.length === 0) {
    conteneur.innerHTML = '<p class="vide">Aucune suggestion en attente.</p>';
    return;
  }
  conteneur.innerHTML = '';
  enAttente.forEach(s => {
    conteneur.innerHTML += `
      <div class="suggestion-affichee">
        <div class="suggestion-auteur">${s.nom} — ${s.email}</div>
        <div class="suggestion-date">${s.date}</div>
        <div class
        <div style="margin-top:10px; display:flex; gap:10px;">
          <button onclick="approuverSuggestion(${s.id})" class="btn" style="background:var(--vert); padding:5px 10px; font-size:0.85rem;">✅ Approuver</button>
          <button onclick="supprimerSuggestion(${s.id})" class="btn" style="background:var(--rouge); padding:5px 10px; font-size:0.85rem;">❌ Supprimer</button>
        </div>
      </div>`;
  });
}

function approuverSuggestion(id) {
  const enAttente = JSON.parse(localStorage.getItem('suggestionsEnAttente') || '[]');
  const approuvees = JSON.parse(localStorage.getItem('suggestionsApprouvees') || '[]');
  const index = enAttente.findIndex(s => s.id === id);
  if (index !== -1) {
    const [sugg] = enAttente.splice(index, 1);
    approuvees.push(sugg);
    localStorage.setItem('suggestionsEnAttente', JSON.stringify(enAttente));
    localStorage.setItem('suggestionsApprouvees', JSON.stringify(approuvees));
    chargerSuggestionsEnAttente();
    chargerSuggestionsPublique();
  }
}

function supprimerSuggestion(id) {
  let enAttente = JSON.parse(localStorage.getItem('suggestionsEnAttente') || '[]');
  enAttente = enAttente.filter(s => s.id !== id);
  localStorage.setItem('suggestionsEnAttente', JSON.stringify(enAttente));
  chargerSuggestionsEnAttente();
}

function basculerAdmin() {
  const espace = document.getElementById('espace-admin');
  espace.style.display = espace.style.display === 'none' ? 'block' : 'none';
  if (estConnecteAdmin) chargerSuggestionsEnAttente();
}

function connecterAdmin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const mdp = document.getElementById('admin-mdp').value;
  if (email === ADMIN_EMAIL && mdp === ADMIN_PASSWORD) {
    estConnecteAdmin = true;
    document.getElementById('connexion-admin').style.display = 'none';
    document.getElementById('panneau-admin').style.display = 'block';
    chargerSuggestionsEnAttente();
    chargerProjets();
  } else {
    document.getElementById('msg-admin').textContent = "Email ou mot de passe incorrect.";
    document.getElementById('msg-admin').className = "message erreur";
  }
}

function deconnecterAdmin() {
  estConnecteAdmin = false;
  document.getElementById('connexion-admin').style.display = 'block';
  document.getElementById('panneau-admin').style.display = 'none';
  document.getElementById('admin-email').value = '';
  document.getElementById('admin-mdp').value = '';
}

function publierInfoUne(e) {
  e.preventDefault();
  const titre = document.getElementById('info-titre').value;
  const contenu = document.getElementById('info-contenu').value;
  const infos = JSON.parse(localStorage.getItem('infosUne') || '[]');
  infos.unshift({ titre, contenu, date: new Date().toLocaleDateString('fr-FR') });
  localStorage.setItem('infosUne', JSON.stringify(infos));
  document.getElementById('info-titre').value = '';
  document.getElementById('info-contenu').value = '';
  chargerInfosUne();
}

function enregistrerProjet(e) {
  e.preventDefault();
  const nom = document.getElementById('projet-nom').value;
  const description = document.getElementById('projet-description').value;
  const statut = document.getElementById('projet-statut').value;
  const projets = JSON.parse(localStorage.getItem('projets') || '[]');
  projets.push({ id: Date.now(), nom, description, statut });
  localStorage.setItem('projets', JSON.stringify(projets));
  document.getElementById('projet-nom').value = '';
  document.getElementById('projet-description').value = '';
  chargerProjets();
}

function envoyerSuggestion(e) {
  e.preventDefault();
  const nom = document.getElementById('nom-sugg').value;
  const email = document.getElementById('email-sugg').value;
  const texte = document.getElementById('message-sugg').value;
  const enAttente = JSON.parse(localStorage.getItem('suggestionsEnAttente') || '[]');
  enAttente.push({
    id: Date.now(),
    nom,
    email,
    texte,
    date: new Date().toLocaleDateString('fr-FR')
  });
  localStorage.setItem('suggestionsEnAttente', JSON.stringify(enAttente));
  document.getElementById('form-suggestion').reset();
  const msg = document.getElementById('msg-sugg');
  msg.textContent = "Merci ! Votre suggestion a été envoyée et sera examinée par l'administrateur.";
  msg.className = "message succes";
  setTimeout(() => msg.textContent = '', 5000);
}

function envoyerDon(e) {
  e.preventDefault();
  const nom = document.getElementById('nom-don').value;
  const email = document.getElementById('email-don').value;
  const montant = document.getElementById('montant').value;
  const mode = document.getElementById('mode-paiement').value;
  const reference = document.getElementById('reference').value;
  const message = document.getElementById('message-don').value;
  const dons = JSON.parse(localStorage.getItem('dons') || '[]');
  dons.push({ nom, email, montant, mode, reference, message, date: new Date().toLocaleDateString('fr-FR') });
  localStorage.setItem('dons', JSON.stringify(dons));
  document.getElementById('form-don').reset();
  const msg = document.getElementById('msg-don');
  msg.textContent = "Merci infiniment pour votre générosité ! Nous vous contacterons très vite.";
  msg.className = "message succes";
  setTimeout(() => msg.textContent = '', 5000);
}

document.addEventListener('DOMContentLoaded', function() {
  initProjetsDefaut();
  chargerInfosUne();
  chargerProjets();
  chargerSuggestionsPublique();

  const lienAdmin = document.getElementById('lien-admin');
  if (lienAdmin) lienAdmin.addEventListener('click', function(e) { e.preventDefault(); basculerAdmin(); });

  const formAdmin = document.getElementById('form-admin');
  if (formAdmin) formAdmin.addEventListener('submit', connecterAdmin);

  const btnDeconnexion = document.getElementById('deconnexion-admin');
  if (btnDeconnexion) btnDeconnexion.addEventListener('click', deconnecterAdmin);

  const formInfoUne = document.getElementById('form-info-une');
  if (formInfoUne) formInfoUne.addEventListener('submit', publierInfoUne);

  const formProjet = document.getElementById('form-projet');
  if (formProjet) formProjet.addEventListener('submit', enregistrerProjet);

  const formSuggestion = document.getElementById('form-suggestion');
  if (formSuggestion) formSuggestion.addEventListener('submit', envoyerSuggestion);

  const formDon = document.getElementById('form-don');
  if (formDon) formDon.addEventListener('submit', envoyerDon);
});
