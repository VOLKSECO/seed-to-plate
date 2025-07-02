// Variable globale pour le filtrage
let activeCategory = ''; // Catégorie active pour le filtrage ('': toutes)

// Fonction pour obtenir l'image par défaut pour les graines
function getDefaultSeedImage() {
  return '/data/icons/seed.png';
}

// Fonction pour vérifier si une image est l'image par défaut
function isDefaultSeedImage(imagePath) {
  return imagePath === '/data/icons/seed.png';
}

// Fonction pour charger les graines depuis l'API
async function loadSeeds() {
  try {
    const seeds = await fetchAPI('/api/seeds');
    return seeds.map(seed => ({
      ...seed,
      Image: seed.Image || getDefaultSeedImage()
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des graines:', error);
    return [];
  }
}

// Fonction pour charger les espèces depuis l'API
async function loadSpecies() {
  try {
    const categories = await fetchAPI('/api/species');
    console.log('Catégories chargées:', categories);
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('Erreur lors du chargement des espèces:', error);
    return [];
  }
}

// Fonction pour sauvegarder les graines via l'API
async function saveSeeds(seeds) {
  try {
    console.log('Envoi des graines à l’API:', JSON.stringify(seeds, null, 2));
    await fetchAPI('/api/seeds', {
      method: 'PUT',
      body: JSON.stringify(seeds)
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des graines:', error);
    throw error;
  }
}

// Fonction pour supprimer une graine via l'API
async function deleteSeed(id) {
  try {
    await fetchAPI('/api/seeds/delete', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la graine:', error);
    throw error;
  }
}

// Fonction pour générer les options de sélecteur (1 à 200)
function generateRangeOptions(selectedValue) {
  let options = '';
  for (let i = 1; i <= 200; i++) {
    options += `<option value="${i}" ${selectedValue == i ? 'selected' : ''}>${i}</option>`;
  }
  return options;
}

// Fonction pour afficher les vCards des graines
function renderSeeds(seeds) {
  const grid = document.getElementById('card-grid');
  if (!grid) return;

  const filteredSeeds = activeCategory
    ? seeds.filter(seed => seed.Categorie === activeCategory)
    : seeds;

  grid.innerHTML = `
    ${filteredSeeds.length === 0 ? `
      <p data-i18n="messages.no_seeds">${getTranslation('messages.no_seeds')}</p>
    ` : ''}
    <div class="card seed-card add-card">
      <span>+</span>
    </div>
    ${filteredSeeds.map(seed => `
      <div class="card seed-card" data-id="${escapeHTML(seed.id)}">
        <img src="${escapeHTML(seed.Image)}" alt="${escapeHTML(seed.NomCommun)}">
        <h3>${escapeHTML(seed.NomCommun)}</h3>
        <p class="scientific-name">${seed.NomScientifique ? escapeHTML(seed.NomScientifique) : ''}</p>
      </div>
    `).join('')}
  `;

  // Attacher les événements après la création des éléments
  grid.querySelectorAll('.seed-card:not(.add-card)').forEach(card => {
    card.className = 'vcard seed-card';
    card.addEventListener('click', () => {
      const seedId = card.dataset.id;
      const seed = filteredSeeds.find(s => s.id === seedId);
      if (seed) showSeedModal(seed);
    });
  });
}

// Fonction pour générer les boutons de filtrage par catégorie
function renderCategoryFilters(categories) {
  const filterContainer = document.getElementById('category-filter');
  if (!filterContainer) return;

  filterContainer.innerHTML = `
    <button class="filter-button ${activeCategory === '' ? 'active' : ''}" data-category="">
      ${getTranslation('buttons.all')}
    </button>
    ${categories.map(cat => `
      <button class="filter-button ${activeCategory === cat.name ? 'active' : ''}" data-category="${escapeHTML(cat.name)}">
        ${escapeHTML(cat.name)}
      </button>
    `).join('')}
  `;

  filterContainer.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', async () => {
      activeCategory = button.getAttribute('data-category');
      filterContainer.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const seeds = await loadSeeds();
      renderSeeds(seeds);
    });
  });
}

// Fonction pour afficher la modale d'ajout/modification d'une graine
async function showSeedModal(seed = null, categories = []) {
  // Supprimer toute modale existante pour éviter les doublons
  document.querySelectorAll('.modal').forEach(m => m.remove());

  const isEdit = !!seed;
  const initialImage = seed ? seed.Image : getDefaultSeedImage();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Parser les plages pour TempsGermination et TempsPourRécolte
  const germinationRange = seed && seed.TempsGermination ? seed.TempsGermination.split('-').map(Number) : [1, 1];
  const harvestRange = seed && seed.TempsPourRécolte ? seed.TempsPourRécolte.split('-').map(Number) : [1, 1];

  // Charger les catégories si elles ne sont pas fournies
  if (!categories.length) {
    categories = await loadSpecies();
    if (!categories.length) {
      console.warn('Aucune catégorie chargée, utilisation d’un sélecteur vide.');
    }
  }

  // Log pour vérifier les données de la graine

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">×</span>
      <img id="modal-image" src="${escapeHTML(initialImage)}" alt="Image de la graine" style="display: block; margin: 0 auto 20px; max-width: 100%; height: 150px; object-fit: cover;">
      <form id="seed-form">
                <label for="common-name">${getTranslation('fields.common_name')}</label>
        <input type="text" id="common-name" value="${seed ? escapeHTML(seed.NomCommun) : ''}" required>
 
        <label for="category">${getTranslation('fields.category')}</label>
        <select id="category" required>
        <option value="" data-i18n="placeholders.select_category">${getTranslation('placeholders.select_category')}</option>
          ${categories.map(cat => `
            <option value="${escapeHTML(cat.name)}" ${seed && seed.Categorie === cat.name ? 'selected' : ''}>
              ${escapeHTML(cat.name)}
            </option>
          `).join('')}
        </select>
        <label for="species">${getTranslation('fields.species')}</label>
        <select id="species" required>
          <option value="" data-i18n="placeholders.select_species">${getTranslation('placeholders.select_species')}</option>
        </select>
     
             <label for="seed-type">${getTranslation('fields.seed_type')}</label>
        <select id="seed-type" required>
          <option value="" data-i18n="placeholders.select">${getTranslation('placeholders.select')}</option>
          <option value="Cyclique" ${seed && seed.Type === 'Cyclique' ? 'selected' : ''}>Cyclique</option>
          <option value="Statique" ${seed && seed.Type === 'Statique' ? 'selected' : ''}>Statique</option>
        </select>
        
        <label>${getTranslation('fields.harvest_time')}</label>
        <div class="range-selection">
          <div class="range-summary" data-type="harvest">
            ${seed && seed.TempsPourRécolte ? `${seed.TempsPourRécolte} ${getTranslation('units.weeks')}` : getTranslation('placeholders.select_range')}
          </div>
          <div class="range-selectors" data-type="harvest" style="display: none;">
            <span>${getTranslation('labels.between')}</span>
            <select class="range-min" data-type="harvest-min">
              ${generateRangeOptions(harvestRange[0])}
            </select>
            <span>${getTranslation('labels.and')}</span>
            <select class="range-max" data-type="harvest-max">
              ${generateRangeOptions(harvestRange[1])}
            </select>
            <span>${getTranslation('units.weeks')}</span>
          </div>
        </div>



       <label for="remarks">${getTranslation('fields.remarks')}</label>
        <textarea id="remarks" rows="4">${seed && seed.Remarques ? escapeHTML(seed.Remarques) : ''}</textarea>




        <label for="scientific-name">${getTranslation('fields.scientific_name')}</label>
        <input type="text" id="scientific-name" value="${seed && seed.NomScientifique ? escapeHTML(seed.NomScientifique) : ''}">
        <label>${getTranslation('fields.sowing_months')}</label>
        <div class="month-selection">
          <div class="month-summary" data-type="sowing" data-i18n="placeholders.select_months">
            ${seed && seed.DatesSemis && seed.DatesSemis.trim() ? seed.DatesSemis.split(', ').map(m => getTranslation(`months.${m.trim()}`)).join(', ') : getTranslation('placeholders.select_months')}
          </div>
          <div class="month-buttons" data-type="sowing" style="display: none;">
            ${months.map(month => `
              <button type="button" class="month-button ${seed && seed.DatesSemis && seed.DatesSemis.split(', ').map(m => m.trim()).includes(month) ? 'selected' : ''}" data-month="${month}">
                ${getTranslation(`months.${month}`)}
              </button>
            `).join('')}
          </div>
        </div>
        <label>${getTranslation('fields.harvest_months')}</label>
        <div class="month-selection">
          <div class="month-summary" data-type="harvest" data-i18n="placeholders.select_months">
            ${seed && seed.DatesRécolte && seed.DatesRécolte.trim() ? seed.DatesRécolte.split(', ').map(m => getTranslation(`months.${m.trim()}`)).join(', ') : getTranslation('placeholders.select_months')}
          </div>
          <div class="month-buttons" data-type="harvest" style="display: none;">
            ${months.map(month => `
              <button type="button" class="month-button ${seed && seed.DatesRécolte && seed.DatesRécolte.split(', ').map(m => m.trim()).includes(month) ? 'selected' : ''}" data-month="${month}">
                ${getTranslation(`months.${month}`)}
              </button>
            `).join('')}
          </div>
        </div>
        <label>${getTranslation('fields.germination_time')}</label>
        <div class="range-selection">
          <div class="range-summary" data-type="germination">
            ${seed && seed.TempsGermination ? `${seed.TempsGermination} ${getTranslation('units.days')}` : getTranslation('placeholders.select_range')}
          </div>
          <div class="range-selectors" data-type="germination" style="display: none;">
            <span>${getTranslation('labels.between')}</span>
            <select class="range-min" data-type="germination-min">
              ${generateRangeOptions(germinationRange[0])}
            </select>
            <span>${getTranslation('labels.and')}</span>
            <select class="range-max" data-type="germination-max">
              ${generateRangeOptions(germinationRange[1])}
            </select>
            <span>${getTranslation('units.days')}</span>
          </div>
        </div>
       
        <input type="file" id="image" accept="image/*">
        <input type="hidden" id="image-path" value="${seed ? escapeHTML(seed.Image) : ''}">
        <button type="submit" data-i18n="buttons.save">${getTranslation('buttons.save')}</button>
        ${isEdit ? `<button type="button" class="delete-btn" data-id="${escapeHTML(seed.id)}" data-i18n="buttons.delete">${getTranslation('buttons.delete')}</button>` : ''}
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'flex';

  // Gestionnaire de fermeture
  modal.querySelector('.close').addEventListener('click', () => modal.remove());

  // Gestionnaire pour mettre à jour la liste des espèces selon la catégorie
  const categorySelect = modal.querySelector('#category');
  const speciesSelect = modal.querySelector('#species');
  let hasCustomImage = isEdit && seed && !isDefaultSeedImage(seed.Image);

  function updateSpeciesOptions(selectedCategory) {
    speciesSelect.innerHTML = `<option value="" data-i18n="placeholders.select_species">${getTranslation('placeholders.select_species')}</option>`;
    const category = categories.find(cat => cat.name === selectedCategory);
    if (category && Array.isArray(category.species)) {
      category.species.forEach(species => {
        const option = document.createElement('option');
        option.value = species;
        option.textContent = species;
        if (seed && seed.Espèce === species) option.selected = true;
        speciesSelect.appendChild(option);
      });
    }
  }

  categorySelect.addEventListener('change', () => {
    updateSpeciesOptions(categorySelect.value);
  });

  if (seed && seed.Categorie) {
    updateSpeciesOptions(seed.Categorie);
  }

  // Gestionnaire pour mettre à jour l'image
  const imageInput = modal.querySelector('#image');
  const modalImage = modal.querySelector('#modal-image');
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

  // Gestionnaire pour les boutons de mois
  modal.querySelectorAll('.month-summary').forEach(summary => {
    const type = summary.getAttribute('data-type');
    const buttonsContainer = modal.querySelector(`.month-buttons[data-type="${type}"]`);


    summary.addEventListener('click', () => {
      const isVisible = buttonsContainer.style.display === 'block';
      modal.querySelectorAll('.month-buttons, .range-selectors').forEach(container => {
        container.style.display = 'none';
      });
      buttonsContainer.style.display = isVisible ? 'none' : 'block';
    });

    buttonsContainer.querySelectorAll('.month-button').forEach(button => {
      button.addEventListener('click', () => {
        button.classList.toggle('selected');
        const selectedMonths = Array.from(buttonsContainer.querySelectorAll('.month-button.selected'))
          .map(btn => btn.getAttribute('data-month'));
        summary.textContent = selectedMonths.length
          ? selectedMonths.map(m => getTranslation(`months.${m}`)).join(', ')
          : getTranslation('placeholders.select_months');
              console.log(modal.querySelectorAll('.month-button[data-type="sowing"].selected'));

      });
    }
  );
  });

  // Gestionnaire pour les sélecteurs de plage
  modal.querySelectorAll('.range-summary').forEach(summary => {
    const type = summary.getAttribute('data-type');
    const selectorsContainer = modal.querySelector(`.range-selectors[data-type="${type}"]`);
    const minSelect = selectorsContainer.querySelector('.range-min');
    const maxSelect = selectorsContainer.querySelector('.range-max');

    summary.addEventListener('click', () => {
      const isVisible = selectorsContainer.style.display === 'block';
      modal.querySelectorAll('.month-buttons, .range-selectors').forEach(container => {
        container.style.display = 'none';
      });
      selectorsContainer.style.display = isVisible ? 'none' : 'block';
    });

    function updateSummary() {
      const min = minSelect.value;
      const max = maxSelect.value;
      summary.textContent = `${min}-${max} ${getTranslation(`units.${type === 'germination' ? 'days' : 'weeks'}`)}`;
    }

    minSelect.addEventListener('change', updateSummary);
    maxSelect.addEventListener('change', updateSummary);
  });

  // Gestionnaire de soumission
  modal.querySelector('#seed-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const commonName = modal.querySelector('#common-name').value.trim();
    const category = modal.querySelector('#category').value;
    const species = modal.querySelector('#species').value;
    const scientificName = modal.querySelector('#scientific-name').value.trim();
const sowingMonths = Array.from(modal.querySelectorAll('.month-buttons[data-type="sowing"] .month-button.selected'))
  .map(btn => btn.getAttribute('data-month')).join(', ').trim();
console.log(sowingMonths);

const harvestMonths = Array.from(modal.querySelectorAll('.month-buttons[data-type="harvest"] .month-button.selected'))
  .map(btn => btn.getAttribute('data-month')).join(', ').trim();
console.log(harvestMonths);

    const germinationMin = modal.querySelector('.range-min[data-type="germination-min"]').value;
    const germinationMax = modal.querySelector('.range-max[data-type="germination-max"]').value;
    const harvestMin = modal.querySelector('.range-min[data-type="harvest-min"]').value;
    const harvestMax = modal.querySelector('.range-max[data-type="harvest-max"]').value;
    const seedType = modal.querySelector('#seed-type').value;
    const remarks = modal.querySelector('#remarks').value.trim();
    const imageFile = modal.querySelector('#image').files[0];
    let imagePath = modal.querySelector('#image-path').value;

    // Logs pour déboguer
    console.log('Données du formulaire :', {
      commonName,
      category,
      species,
      scientificName,
      sowingMonths,
      harvestMonths,
      germinationMin,
      germinationMax,
      harvestMin,
      harvestMax,
      seedType,
      remarks,
      imageFile: imageFile ? imageFile.name : null,
      imagePath
    });

    // Validation des champs obligatoires
    if (!commonName || !category || !species || !seedType) {
      alert(getTranslation('errors.required'));
      return;
    }

    // Validation des plages
    if (Number(germinationMin) > Number(germinationMax)) {
      alert(getTranslation('errors.invalid_range'));
      return;
    }
    if (Number(harvestMin) > Number(harvestMax)) {
      alert(getTranslation('errors.invalid_range'));
      return;
    }

    try {
      if (imageFile) {
        console.log('Uploading image:', imageFile.name);
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
      } else if (isEdit && (!imagePath || isDefaultSeedImage(imagePath))) {
        imagePath = getDefaultSeedImage();
        hasCustomImage = false;
      } else if (!isEdit) {
        imagePath = getDefaultSeedImage();
        hasCustomImage = false;
      }

      const seeds = await loadSeeds();
      const newSeed = {
        id: isEdit ? seed.id : `seed_${Date.now()}`,
        NomCommun: commonName,
        Categorie: category,
        Espèce: species,
        NomScientifique: scientificName || undefined,
        DatesSemis: sowingMonths ? sowingMonths : undefined,
        DatesRécolte: harvestMonths ? harvestMonths : undefined,        TempsGermination: germinationMin && germinationMax ? `${germinationMin}-${germinationMax}` : undefined,
        TempsPourRécolte: harvestMin && harvestMax ? `${harvestMin}-${harvestMax}` : undefined,
        Type: seedType,
        Remarques: remarks || undefined,
        Image: imagePath
      };
      console.log(newSeed);


      console.log('Nouvelle graine à sauvegarder:', newSeed);

      if (isEdit) {
        const index = seeds.findIndex(s => s.id === seed.id);
        if (index !== -1) seeds[index] = newSeed;
      } else {
        seeds.push(newSeed);
      }

      await saveSeeds(seeds);
      console.log('Graines sauvegardées avec succès');
      modal.remove();
      document.dispatchEvent(new Event('seedsUpdated'));
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert(getTranslation('errors.save_failed'));
    }
  });

  // Gestionnaire de suppression
  if (isEdit) {
    modal.querySelector('.delete-btn').addEventListener('click', async () => {
      const confirmDelete = confirm(getTranslation('warnings.delete_seed'));
      if (confirmDelete) {
        try {
          await deleteSeed(seed.id);
          modal.remove();
          document.dispatchEvent(new Event('seedsUpdated'));
        } catch (error) {
          alert(getTranslation('errors.delete_failed'));
        }
      }
    });
  }
}

// Initialisation de l'onglet Graines
async function initSeeds() {
  try {
    const seeds = await loadSeeds();
    const categories = await loadSpecies();
    renderSeeds(seeds);
    renderCategoryFilters(categories);
    document.addEventListener('seedsUpdated', async () => {
      const updatedSeeds = await loadSeeds();
      renderSeeds(updatedSeeds);
    });
  } catch (error) {
    console.error('Erreur lors de l’initialisation des graines:', error);
  }
}
