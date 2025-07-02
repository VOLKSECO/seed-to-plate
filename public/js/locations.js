// Fonction pour obtenir l'image par défaut selon le type de lieu
// Paramètres : type (chaîne, ex. 'Parcelle')
// Retour : chemin de l'image par défaut
function getDefaultLocationImage(type) {
  const images = {
    Parcelle: '/data/icons/parcelle.png',
    Pot: '/data/icons/pot.png',
    Caissette: '/data/icons/caissette.png'
  };
  return images[type] || '/data/icons/parcelle.png';
}

// Fonction pour vérifier si une image est l'image par défaut
// Paramètres : imagePath (chemin de l'image), type (type de lieu)
// Retour : booléen
function isDefaultLocationImage(imagePath, type) {
  return imagePath === getDefaultLocationImage(type);
}

// Fonction pour charger les lieux depuis l'API
// Retour : promesse avec les données des lieux
async function loadLocations() {
  try {
    const locations = await fetchAPI('/api/locations');
    return locations.map(loc => ({
      ...loc,
      Image: loc.Image || getDefaultLocationImage(loc.Type)
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des lieux:', error);
    return [];
  }
}

// Fonction pour sauvegarder les lieux via l'API
// Paramètres : locations (tableau d'objets lieux)
// Retour : promesse avec le résultat
async function saveLocations(locations) {
  try {
    await fetchAPI('/api/locations', {
      method: 'PUT',
      body: JSON.stringify(locations)
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des lieux:', error);
    throw error;
  }
}

// Fonction pour supprimer un lieu via l'API
// Paramètres : id (identifiant du lieu), force (booléen pour forcer la suppression)
// Retour : promesse avec le résultat
async function deleteLocation(id, force = false) {
  if (!id) {
    throw new Error(getTranslation('errors.invalid_id'));
  }
  try {
    const response = await fetchAPI('/api/locations/delete', {
      method: 'POST',
      body: JSON.stringify({ id, force })
    });
    return response;
  } catch (error) {
    console.error('Erreur lors de la suppression du lieu:', error);
    const errorMessage = error.message.includes('Lieu utilisé dans une culture')
      ? getTranslation('errors.location_in_use')
      : error.message.includes('Entrée non trouvée')
      ? getTranslation('errors.not_found')
      : getTranslation('errors.delete_failed');
    throw new Error(errorMessage);
  }
}
// Fonction pour filtrer les lieux par recherche, type et adresse
// Paramètres : locations (tableau d'objets lieux), search (chaîne), type (chaîne), address (chaîne)
// Retour : tableau de lieux filtrés
function filterLocations(locations, search = '', type = '', address = '') {
  return locations.filter(loc => {
    const matchesSearch = !search || 
      (loc.Nom && loc.Nom.toLowerCase().includes(search)) || 
      (loc.Adresse && loc.Adresse.toLowerCase().includes(search));
    const matchesType = !type || loc.Type === type;
    const matchesAddress = !address || (loc.Adresse && loc.Adresse === address);
    return matchesSearch && matchesType && matchesAddress;
  });
}


// Fonction pour mettre à jour le sélecteur d'adresses avec les adresses uniques
// Paramètres : locations (tableau d'objets lieux)
// Retour : aucun
function updateAddressFilter(locations) {
  const addressFilter = document.getElementById('address-filter');
  if (!addressFilter) return;
  
  // Récupérer les adresses uniques non vides
  const addresses = [...new Set(
    locations
      .filter(loc => loc.Adresse && loc.Adresse.trim())
      .map(loc => loc.Adresse)
  )].sort();
  
  // Conserver la valeur sélectionnée actuelle
  const currentValue = addressFilter.value;
  
  // Réinitialiser les options
  addressFilter.innerHTML = `<option value="" data-i18n="placeholders.select_address">${getTranslation('placeholders.select_address')}</option>`;
  
  // Ajouter les adresses
  addresses.forEach(addr => {
    const option = document.createElement('option');
    option.value = addr;
    option.textContent = addr;
    if (addr === currentValue) option.selected = true;
    addressFilter.appendChild(option);
  });
}
// Fonction pour afficher les vCards des lieux
// Paramètres : locations (tableau d'objets lieux), search (chaîne), type (chaîne), address (chaîne)
// Retour : aucun
function renderLocations(locations, search = '', type = '', address = '') {
  const grid = document.getElementById('card-grid');
  grid.innerHTML = '';
  // Mettre à jour le sélecteur d'adresses
  updateAddressFilter(locations);
  // Filtrer les lieux
  const filteredLocations = filterLocations(locations, search, type, address);

  // Créer la carte pour ajouter un nouveau lieu
  const addCard = document.createElement('div');
  addCard.className = 'vcard location-card add-card';
  addCard.innerHTML = `<span data-i18n="buttons.add_location">${getTranslation('buttons.add_location')}</span>`;

  grid.appendChild(addCard);


  // Afficher les vCards des lieux filtrés
  filteredLocations.forEach(loc => {
    const card = document.createElement('div');
    card.className = 'vcard location-card';
    card.dataset.id = escapeHTML(loc.id);
    card.innerHTML = `
      <img src="${escapeHTML(loc.Image)}" alt="${escapeHTML(loc.Nom)}">
      <h3>${escapeHTML(loc.Nom)}</h3>
      <p class="address">${loc.Adresse ? escapeHTML(loc.Adresse) : ''}</p>    `;
    grid.appendChild(card);
  });

}
// Fonction pour afficher la modale d'ajout/modification d'un lieu
// Paramètres : location (objet lieu, null pour ajout)
async function showLocationModal(location = null) {
  const isEdit = !!location;
  const initialType = location ? location.Type : null; // Type initial pour vérifier l'image par défaut
  const initialImage = location ? location.Image : getDefaultLocationImage('Parcelle');
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">×</span>
      <img id="modal-image" src="${escapeHTML(initialImage)}" alt="Image du lieu" style="display: block; margin: 0 auto 20px; max-width: 100%; height: 150px; object-fit: cover;">
      <form id="location-form">
        <label for="name">${getTranslation('fields.name')}</label>
        <input type="text" id="name" value="${location ? escapeHTML(location.Nom) : ''}" required>
        <label for="address">${getTranslation('fields.address')}</label>
        <input type="text" id="address" value="${location ? escapeHTML(location.Adresse) : ''}">
        <label for="type">${getTranslation('fields.type')}</label>
        <select id="type" required>
          <option value="" data-i18n="placeholders.select">${getTranslation('placeholders.select')}</option>
          <option value="Parcelle" ${location && location.Type === 'Parcelle' ? 'selected' : ''}>Parcelle</option>
          <option value="Pot" ${location && location.Type === 'Pot' ? 'selected' : ''}>Pot</option>
          <option value="Caissette" ${location && location.Type === 'Caissette' ? 'selected' : ''}>Caissette</option>
        </select>
        <div id="surface-container" style="display: ${location && location.Type === 'Parcelle' ? 'block' : 'none'};">
          <label for="surface">${getTranslation('fields.surface')}</label>
          <input type="number" id="surface" step="0.1" min="0" value="${location && location.Surface ? escapeHTML(location.Surface) : ''}">
        </div>
        <label for="remarks">${getTranslation('fields.remarks')}</label>
        <textarea id="remarks" rows="4">${location && location.Remarques ? escapeHTML(location.Remarques) : ''}</textarea>
        <label for="image">${getTranslation('fields.image')}</label>
        <input type="file" id="image" accept="image/*">
        <input type="hidden" id="image-path" value="${location ? escapeHTML(location.Image) : ''}">
        <button type="submit" data-i18n="buttons.save">${getTranslation('buttons.save')}</button>
        ${isEdit ? `<button type="button" class="delete-btn" data-id="${escapeHTML(location.id)}" data-i18n="buttons.delete">${getTranslation('buttons.delete')}</button>` : ''}
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'flex';

  // Gestionnaire de fermeture
  modal.querySelector('.close').addEventListener('click', () => modal.remove());

  // Gestionnaire pour afficher/masquer le champ Surface et mettre à jour l'image dans la modale
  const typeSelect = modal.querySelector('#type');
  const surfaceContainer = modal.querySelector('#surface-container');
  const modalImage = modal.querySelector('#modal-image');
  let hasCustomImage = isEdit && location && !isDefaultLocationImage(location.Image, location.Type); // Vrai si l'image initiale est personnalisée

  typeSelect.addEventListener('change', () => {
    surfaceContainer.style.display = typeSelect.value === 'Parcelle' ? 'block' : 'none';
    if (!hasCustomImage) {
      modalImage.src = getDefaultLocationImage(typeSelect.value);
    }
  });

  // Gestionnaire pour mettre à jour l'image lors de la sélection d'un fichier
  const imageInput = modal.querySelector('#image');
  imageInput.addEventListener('change', () => {
    if (imageInput.files[0]) {
      hasCustomImage = true;
      const reader = new FileReader();
      reader.onload = (e) => {
        modalImage.src = e.target.result;
      };
      reader.readAsDataURL(imageInput.files[0]);
    }
  });

  // Gestionnaire de soumission
  modal.querySelector('#location-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = modal.querySelector('#name').value.trim();
    const address = modal.querySelector('#address').value.trim();
    const type = modal.querySelector('#type').value;
    const surface = modal.querySelector('#surface').value.trim();
    const remarks = modal.querySelector('#remarks').value.trim();
    const imageFile = modal.querySelector('#image').files[0];
    let imagePath = modal.querySelector('#image-path').value;

    if (!name || !type) {
      alert(getTranslation('errors.required'));
      return;
    }

    if (type === 'Parcelle' && surface && !isValidNumber(surface)) {
      alert(getTranslation('errors.invalid_number'));
      return;
    }

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await fetch('/api/upload-image', { method: 'POST', body: formData });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Erreur HTTP ${response.status}: ${text}`);
        }
        const result = await response.json();
        imagePath = result.image;
        hasCustomImage = true;
      } else if (!isEdit) {
        imagePath = getDefaultLocationImage(type);
        hasCustomImage = false;
      } else if (isEdit && (!imagePath || isDefaultLocationImage(imagePath, initialType))) {
        imagePath = getDefaultLocationImage(type);
        hasCustomImage = false;
      }

      const locations = await loadLocations();
      const newLocation = {
        id: isEdit ? location.id : name,
        Nom: name,
        Adresse: address || undefined,
        Type: type,
        Surface: type === 'Parcelle' && surface ? surface : undefined,
        Remarques: remarks || undefined,
        Image: imagePath
      };

      if (isEdit) {
        const index = locations.findIndex(loc => loc.id === location.id);
        locations[index] = newLocation;
      } else {
        locations.push(newLocation);
      }

      await saveLocations(locations);
      modal.remove();
      document.dispatchEvent(new Event('locationsUpdated'));
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Erreur: ' + error.message);
    }
  });

  // Gestionnaire de suppression
  if (isEdit) {
    modal.querySelector('.delete-btn').addEventListener('click', async () => {
      console.log('Clic sur le bouton Supprimer pour le lieu:', location.id); // Log pour débogage
      const confirmDelete = confirm(getTranslation('warnings.delete_location'));
      if (confirmDelete) {
        try {
          await deleteLocation(location.id);
          console.log('Lieu supprimé avec succès:', location.id);
          modal.remove();
          document.dispatchEvent(new Event('locationsUpdated'));
        } catch (error) {
          console.error('Erreur lors de la tentative de suppression:', error);
          if (error.message === getTranslation('errors.location_in_use')) {
            const forceDelete = confirm(getTranslation('warnings.force_delete_location'));
            if (forceDelete) {
              try {
                await deleteLocation(location.id, true);
                console.log('Lieu supprimé avec force:', location.id);
                modal.remove();
                document.dispatchEvent(new Event('locationsUpdated'));
              } catch (forceError) {
                console.error('Erreur lors de la suppression forcée:', forceError);
                alert(forceError.message);
              }
            }
          } else {
            alert(error.message);
          }
        }
      }
    });
  }
}


// Initialisation des événements pour les lieux
function initLocations() {
  let currentSearch = '';
  let currentType = '';
  let currentAddress = '';

  document.addEventListener('locationsUpdated', async () => {
    const locations = await loadLocations();
    renderLocations(locations, currentSearch, currentType, currentAddress);
  });

  document.addEventListener('locationsFiltered', (e) => {
    currentSearch = e.detail.search;
    currentType = e.detail.type;
    currentAddress = e.detail.address;
    document.dispatchEvent(new Event('locationsUpdated'));
  });

  // Charger les lieux au démarrage
  document.dispatchEvent(new Event('locationsUpdated'));
}