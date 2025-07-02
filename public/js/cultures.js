// Fonction utilitaire pour appeler l'API
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(endpoint, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur inconnue');
  }
  return response.json();
}

// Fonction pour échapper les caractères HTML
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

// Fonction pour obtenir l'image par défaut
function getDefaultCultureImage() {
  return '/data/icons/seed.png';
}

// Fonction pour vérifier si l'image est par défaut
function isDefaultCultureImage(image) {
  return image === getDefaultCultureImage();
}

// Fonction pour vérifier si une valeur est un nombre valide
function isValidNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

// Fonction pour charger les cultures depuis l'API
async function loadCultures() {
  try {
    const cultures = await fetchAPI('/api/cultures');
    console.log('Cultures chargées:', cultures);
    return Array.isArray(cultures) ? cultures : [];
  } catch (error) {
    console.error('Erreur lors du chargement des cultures:', error);
    return [];
  }
}

// Fonction pour charger les lieux depuis l'API
async function loadLocations() {
  try {
    const locations = await fetchAPI('/api/locations');
    return Array.isArray(locations) ? locations : [];
  } catch (error) {
    console.error('Erreur lors du chargement des lieux:', error);
    return [];
  }
}

// Fonction pour charger les graines depuis l'API
async function loadSeeds() {
  try {
    const seeds = await fetchAPI('/api/seeds');
    return Array.isArray(seeds) ? seeds : [];
  } catch (error) {
    console.error('Erreur lors du chargement des graines:', error);
    return [];
  }
}

// Fonction pour sauvegarder les cultures
async function saveCultures(cultures) {
  try {
    await fetchAPI('/api/cultures', {
      method: 'PUT',
      body: JSON.stringify(cultures)
    });
    console.log('Cultures sauvegardées');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des cultures:', error);
    throw error;
  }
}

// Fonction pour supprimer une culture
async function deleteCulture(id) {
  try {
    await fetchAPI('/api/cultures/delete', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
    console.log(`Culture ${id} supprimée`);
  } catch (error) {
    console.error('Erreur lors de la suppression de la culture:', error);
    throw error;
  }
}

// Fonction pour afficher la modale d'ajout/modification d'une culture
async function showCultureModal(culture = null, locations = [], seeds = []) {
  const isEdit = !!culture;
  const initialImage = culture ? culture.Image : getDefaultCultureImage();

  const initialDate = new Date();
  const initialDateString = `${initialDate.getFullYear()}-${padZero(initialDate.getMonth() + 1)}-${padZero(initialDate.getDate())}`;


  // Charger les lieux et graines si non fournis
  if (!locations.length) locations = await loadLocations();
  if (!seeds.length) seeds = await loadSeeds();

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">×</span>
      <img id="modal-image" src="${escapeHTML(initialImage)}" alt="Image de la culture" style="display: block; margin: 0 auto 20px; max-width: 100%; height: 150px; object-fit: cover;">
      <form id="culture-form">
        <label for="name">${getTranslation('fields.name')}</label>
        <input type="text" id="name" value="${culture ? escapeHTML(culture.Nom) : ''}" required>
        <label for="plant">${getTranslation('fields.plant')}</label>
        <select id="plant" required>
          <option value="" data-i18n="placeholders.select_plant">${getTranslation('placeholders.select_plant')}</option>
          ${seeds.map(seed => `
            <option value="${escapeHTML(seed.id)}" ${culture && culture.Plante === seed.id ? 'selected' : ''}>
              ${escapeHTML(seed.NomCommun)}
            </option>
          `).join('')}
        </select>
        <label for="planting-date">${getTranslation('fields.planting_date')}</label>
        <input type="date" id="planting-date" value="${initialDateString}" required>
        <label for="quantity">${getTranslation('fields.quantity')}</label>
        <input type="number" id="quantity" min="1" value="${culture && culture.Quantité ? escapeHTML(culture.Quantité) : ''}" required>
        <label for="location">${getTranslation('fields.location')}</label>
        <select id="location" required>
        <option value="" data-i18n="placeholders.select_location">${getTranslation('placeholders.select_location')}</option>
          ${locations.map(loc => `
            <option value="${escapeHTML(loc.id)}" ${culture && culture.Lieu === loc.id ? 'selected' : ''}>
              ${escapeHTML(loc.Nom)}
            </option>
          `).join('')}
        </select>

         <label for="first-harvest-time">${getTranslation('fields.first_harvest_time')}</label>
        <input type="number" id="first-harvest-time" min="0" value="${culture && culture['Temps pour première récolte'] ? escapeHTML(culture['Temps pour première récolte']) : ''}">
        <label for="harvest-periodicity">${getTranslation('fields.harvest_periodicity')}</label>
        <input type="number" id="harvest-periodicity" min="0" value="${culture && culture['Périodicité des récoltes'] ? escapeHTML(culture['Périodicité des récoltes']) : ''}">
        <label for="harvest-quantity">${getTranslation('fields.harvest_quantity')}</label>
        <input type="number" id="harvest-quantity" min="0" step="0.01" value="${culture && culture['Quantité estimée par récolte'] ? escapeHTML(culture['Quantité estimée par récolte']) : ''}">
        <label for="total-quantity">${getTranslation('fields.total_quantity')}</label>
        <input type="number" id="total-quantity" min="0" step="0.01" value="${culture && culture['Quantité totale estimée'] ? escapeHTML(culture['Quantité totale estimée']) : ''}">
        <label for="remarks">${getTranslation('fields.remarks')}</label>
        <textarea id="remarks" rows="4">${culture && culture.Remarques ? escapeHTML(culture.Remarques) : ''}</textarea>
        <label for="image">${getTranslation('fields.image')}</label>
        <input type="file" id="image" accept="image/*">
        <input type="hidden" id="image-path" value="${culture ? escapeHTML(culture.Image) : ''}">
        <button type="submit" data-i18n="buttons.save">${getTranslation('buttons.save')}</button>
        ${isEdit ? `<button type="button" class="delete-btn" data-id="${escapeHTML(culture.id)}" data-i18n="buttons.delete">${getTranslation('buttons.delete')}</button>` : ''}
      </form>
    </div>
  `;

  function padZero(num) {
  return (num < 10 ? '0' : '') + num;
}

  document.body.appendChild(modal);
  modal.style.display = 'flex';

  // Gestionnaire de fermeture
  modal.querySelector('.close').addEventListener('click', () => modal.remove());

  // Gestionnaire pour mettre à jour l'image
  const imageInput = modal.querySelector('#image');
  const modalImage = modal.querySelector('#modal-image');
  let hasCustomImage = isEdit && culture && !isDefaultCultureImage(culture.Image);

  imageInput.addEventListener('change', () => {
    if (imageInput.files[0]) {
      hasCustomImage = true;
      const reader = new FileReader();
      reader.onload = (e) => modalImage.src = e.target.result;
      reader.readAsDataURL(imageInput.files[0]);
    }
  });

  // Gestionnaire de soumission
  modal.querySelector('#culture-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = modal.querySelector('#name').value.trim();
    const location = modal.querySelector('#location').value;
    const plant = modal.querySelector('#plant').value;
    const quantity = modal.querySelector('#quantity').value.trim();
    const plantingDate = modal.querySelector('#planting-date').value;
    const firstHarvestTime = modal.querySelector('#first-harvest-time').value.trim();
    const harvestPeriodicity = modal.querySelector('#harvest-periodicity').value.trim();
    const harvestQuantity = modal.querySelector('#harvest-quantity').value.trim();
    const totalQuantity = modal.querySelector('#total-quantity').value.trim();
    const remarks = modal.querySelector('#remarks').value.trim();
    const imageFile = modal.querySelector('#image').files[0];
    let imagePath = modal.querySelector('#image-path').value;

    // Validation des champs obligatoires
    if (!name || !location || !plant || !quantity || !plantingDate) {
      alert(getTranslation('errors.required'));
      return;
    }

    // Validation des nombres
    if (quantity && (!isValidNumber(quantity) || quantity < 1)) {
      alert(getTranslation('errors.invalid_number'));
      return;
    }
    if (firstHarvestTime && (!isValidNumber(firstHarvestTime) || firstHarvestTime < 0)) {
      alert(getTranslation('errors.invalid_number'));
      return;
    }
    if (harvestPeriodicity && (!isValidNumber(harvestPeriodicity) || harvestPeriodicity < 0)) {
      alert(getTranslation('errors.invalid_number'));
      return;
    }
    if (harvestQuantity && (!isValidNumber(harvestQuantity) || harvestQuantity < 0)) {
      alert(getTranslation('errors.invalid_number'));
      return;
    }
    if (totalQuantity && (!isValidNumber(totalQuantity) || totalQuantity < 0)) {
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
      } else if (isEdit && (!imagePath || isDefaultCultureImage(imagePath))) {
        imagePath = getDefaultCultureImage();
        hasCustomImage = false;
      } else if (!isEdit) {
        imagePath = getDefaultCultureImage();
        hasCustomImage = false;
      }

      const cultures = await loadCultures();
      const newCulture = {
        id: isEdit ? culture.id : `culture_${Date.now()}`,
        Nom: name,
        Lieu: location,
        Plante: plant,
        Quantité: quantity,
        'Date de mise en terre': plantingDate,
        'Temps pour première récolte': firstHarvestTime || undefined,
        'Périodicité des récoltes': harvestPeriodicity || undefined,
        'Quantité estimée par récolte': harvestQuantity || undefined,
        'Quantité totale estimée': totalQuantity || undefined,
        Remarques: remarks || undefined,
        Image: imagePath
      };

      if (isEdit) {
        const index = cultures.findIndex(c => c.id === culture.id);
        cultures[index] = newCulture;
      } else {
        cultures.push(newCulture);
      }

      await saveCultures(cultures);
      modal.remove();
      document.dispatchEvent(new Event('culturesUpdated'));
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert(getTranslation('errors.save_failed'));
    }
  });

  // Gestionnaire de suppression
  if (isEdit) {
    modal.querySelector('.delete-btn').addEventListener('click', async () => {
      const confirmDelete = confirm(getTranslation('warnings.delete_culture'));
      if (confirmDelete) {
        try {
          await deleteCulture(culture.id);
          modal.remove();
          document.dispatchEvent(new Event('culturesUpdated'));
        } catch (error) {
          alert(getTranslation('errors.delete_failed'));
        }
      }
    });
  }
}

// Fonction pour rendre les vCards des cultures
async function renderCultures(cultures) {
  const container = document.getElementById('card-grid');
  if (!container) return;

  // Charger les lieux et graines pour afficher les noms
  const locations = await loadLocations();
  const seeds = await loadSeeds();

  container.innerHTML = '';
  const addCard = document.createElement('div');
  addCard.className = 'vcard culture-card add-card';
  addCard.innerHTML = `<span data-i18n="buttons.add_culture">${getTranslation('buttons.add_culture')}</span>`;
  addCard.addEventListener('click', async () => {
    const locations = await loadLocations();
    const seeds = await loadSeeds();
  });
  container.appendChild(addCard);

  cultures.forEach(culture => {
    const location = locations.find(loc => loc.id === culture.Lieu);
    const plant = seeds.find(seed => seed.id === culture.Plante);
    const card = document.createElement('div');
    card.className = 'vcard culture-card';
    card.dataset.id = culture.id;
    card.innerHTML = `
          <h3> ${plant ? escapeHTML(plant.NomCommun) : escapeHTML(culture.Plante || '-')}</h3>

      <p> ${escapeHTML(culture['Date de mise en terre'])}</p>
      <img src="${escapeHTML(culture.Image)}" alt="${escapeHTML(culture.Nom)}">
      <p> ${escapeHTML(culture.Quantité)} ${getTranslation('fields.dans')} ${location ? escapeHTML(location.Type) : escapeHTML(culture.Lieu)}</p>
      <p class="address"> ${location ? escapeHTML(location.Adresse) : ''}</p>

`;
    container.appendChild(card);
  });
}

// Initialisation de la page Cultures
async function initCultures() {
  const cultures = await loadCultures();
  if (document.querySelector('.active[data-tab="cultures"]')) {
    renderCultures(cultures);
  }

  document.addEventListener('culturesUpdated', async () => {
    const updatedCultures = await loadCultures();
    if (document.querySelector('.active[data-tab="cultures"]')) {
      renderCultures(updatedCultures);
    }
  });

  document.addEventListener('languageChanged', async () => {
    const updatedCultures = await loadCultures();
    if (document.querySelector('.active[data-tab="cultures"]')) {
      renderCultures(updatedCultures);
    }
  });
}

document.addEventListener('DOMContentLoaded', initCultures);