// Objet contenant les traductions pour chaque langue
const translations = {
  fr: {
    tabs: {
      locations: 'Lieux',
      seeds: 'Graines',
      cultures: 'Cultures',
      harvests: 'Récoltes',
      bilan: 'Bilan'
    },
    buttons: {
      theme: 'Changer de thème',
      add: 'Ajouter',
      add_location: '+',
      edit_location: 'Modifier un lieu',
      add_culture: '+',
      add_seed: 'Ajouter une graine',
      edit_seed: 'Modifier une graine',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit_culture: 'Modifier la culture'
    },
    fields: {
      name: 'Nom',
      address: 'Adresse',
      type: 'Type',
      surface: 'Surface (m²)',
      image: 'Image',
      remarks: 'Remarques',
      common_name: 'Nom commun',
      category: 'Catégorie',
      species: 'Espèce',
      scientific_name: 'Nom scientifique',
      sowing_months: 'Mois de semis',
      harvest_months: 'Mois de récolte',
      germination_time: 'Temps de germination (jours)',
      harvest_time: 'Temps pour récolte (semaines)',
      seed_type: 'Type de plante',
      location: 'Lieux',
      quantity: 'Quantité',
      planting_date: 'Date de plantation',
      first_harvest_time : 'Temps avant première récolte (semaines)',
      harvest_date: 'Date de récolte',
      harvest_periodicity: 'Périodicité de récolte (semaines)',
      harvest_quantity: 'Quantité récoltée en fin de période',
      harvest_type: 'Type de récolte',
      total_quantity: 'Quantité totale',
      plant: 'Plante',
      dans: 'en',
      types: {
        parcelle: 'Parcelle',
        pot: 'Pot',
        caissette: 'Caissette'
      }
    },
    labels: {
  between: 'Entre',
  and: 'et'
},
units: {
  days: 'jours',
  weeks: 'semaines'
},
    placeholders: {
      search: 'Rechercher',
      select: 'Sélectionner',
      select_category: 'Sélectionner une catégorie',
      select_species: 'Sélectionner une espèce',
      select_type: 'Tous les types',
      select_address: 'Toutes les adresses',
      select_months: 'Mois sélectionnés',
      select: 'Sélectionner',
      select_category: 'Sélectionner une catégorie',
      select_species: 'Sélectionner une espèce',
      select_months: 'Sélectionner les mois',
      select_range: 'Sélectionner une plage',
      select_location: 'Sélectionner un lieu',
      select_plant: 'Sélectionner une plante',
    },
    help: {
      locations: 'Ajoutez des lieux pour organiser vos cultures.',
      seeds: 'Gérez votre stock de graines et plantes.',
      cultures : 'Créez et gérez vos cultures en associant des graines à des lieux.',
    },
    errors: {
    required: 'Veuillez remplir tous les champs obligatoires.',
    invalid_number: 'Veuillez entrer un nombre valide.',
    location_in_use: 'Ce lieu est utilisé dans une ou plusieurs cultures.',
    delete_failed: 'Échec de la suppression du lieu.',
    invalid_id: 'Identifiant du lieu invalide.',
    not_found: 'Lieu non trouvé.',
    species_load_failed: 'Échec du chargement des catégories et espèces.',
    invalid_range: 'La valeur minimale ne peut pas être supérieure à la maximale'

    },
    errors: {
  location_in_use: 'Ce lieu est utilisé dans une ou plusieurs cultures.',
  delete_failed: 'Échec de la suppression du lieu.',
  invalid_id: 'Identifiant du lieu invalide.',
  not_found: 'Lieu non trouvé.'
},
warnings: {
  delete_location: 'Voulez-vous vraiment supprimer ce lieu ?',
  force_delete_location: 'Ce lieu est lié à une ou plusieurs cultures. Supprimer ce lieu peut affecter les cultures et les récoltes associées. Voulez-vous forcer la suppression ?',
  delete_seed: 'Les cultures et récoltes dépendantes de cette plante seront en défaut. Voulez-vous supprimer cette graine ?',
  delete_culture: 'Cette culture est liée à des récoltes. La supprimer peut affecter les récoltes associées. Voulez-vous forcer la suppression ?'

},
    months: {
      January: 'Janvier',
      February: 'Février',
      March: 'Mars',
      April: 'Avril',
      May: 'Mai',
      June: 'Juin',
      July: 'Juillet',
      August: 'Août',
      September: 'Septembre',
      October: 'Octobre',
      November: 'Novembre',
      December: 'Décembre'
    }
  },
  en: {
    tabs: {
      locations: 'Locations',
      seeds: 'Seeds',
      cultures: 'Crops',
      harvests: 'Harvests',
      bilan: 'Report'
    },
    buttons: {
      theme: 'Toggle theme',
      add: 'Add',
      add_location: '+',
      edit_location: 'Edit a location',
      add_seed: 'Add a seed',
      edit_seed: 'Edit a seed',
      save: 'Save',
      delete: 'Delete'
    },
    fields: {
      name: 'Name',
      address: 'Address',
      type: 'Type',
      surface: 'Surface (m²)',
      image: 'Image',
      remarks: 'Remarks',
      common_name: 'Common name',
      category: 'Category',
      species: 'Species',
      scientific_name: 'Scientific name',
      sowing_months: 'Sowing months',
      harvest_months: 'Harvest months',
      germination_time: 'Germination time (days)',
      harvest_time: 'Harvest time (weeks)',
      seed_type: 'Plant type',
      dans: 'in',
      types: { parcelle: 'Plot', pot: 'Pot', caissette: 'Tray'}    
    },
    
    placeholders: {
      search: 'Search',
      select: 'Select',
      select_category: 'Select a category',
      select_species: 'Select a species',
      select_type: 'All types',
      select_address: 'All addresses',
      select_months: 'Selected months',
  
    },
    help: {
      locations: 'Add and manage your growing locations (plots, pots, trays).',
      seeds: 'Manage your stock of seeds and plants.'
    },
    errors: {
      required: 'Please fill in all required fields.',
      invalid_number: 'Please enter a valid number.'
    },
    warnings: {
      delete_seed: 'Crops and harvests dependent on this plant will be invalid. Do you want to delete this seed?'
    },
    errors: {
  location_in_use: 'This location is used in one or more cultures.',
  delete_failed: 'Failed to delete the location.',
  invalid_id: 'Invalid location identifier.',
  not_found: 'Location not found.'
},
warnings: {
  delete_location: 'Do you really want to delete this location?',
  force_delete_location: 'This location is linked to one or more cultures. Deleting it may affect associated cultures and harvests. Do you want to force deletion?'
},
    months: {
      January: 'January',
      February: 'February',
      March: 'March',
      April: 'April',
      May: 'May',
      June: 'June',
      July: 'July',
      August: 'August',
      September: 'September',
      October: 'October',
      November: 'November',
      December: 'December'
    }
  },
  pt: {
    tabs: {
      locations: 'Locais',
      seeds: 'Sementes',
      cultures: 'Culturas',
      harvests: 'Colheitas',
      bilan: 'Relatório'
    },
    buttons: {
      theme: 'Alternar tema',
      add: 'Adicionar',
      add_location: '+',
      edit_location: 'Editar um local',
      add_seed: 'Adicionar uma semente',
      edit_seed: 'Editar uma semente',
      save: 'Salvar',
      delete: 'Excluir'
    },
    fields: {
      name: 'Nome',
      address: 'Endereço',
      type: 'Tipo',
      surface: 'Superfície (m²)',
      image: 'Imagem',
      remarks: 'Observações',
      common_name: 'Nome comum',
      category: 'Categoria',
      species: 'Espécie',
      scientific_name: 'Nome científico',
      sowing_months: 'Meses de semeadura',
      harvest_months: 'Meses de colheita',
      germination_time: 'Tempo de germinação (dias)',
      harvest_time: 'Tempo para colheita (semanas)',
      seed_type: 'Tipo de planta',
      dans: 'em',
    },
    placeholders: {
      search: 'Pesquisar',
      select: 'Selecionar',
      select_category: 'Selecionar uma categoria',
      select_species: 'Selecionar uma espécie',
      select_type: 'Todos os tipos',
      select_address: 'Todos os endereços',
      select_months: 'Meses selecionados',
    },
    fields: {
      types: {
        parcelle: 'Canteiro',
        pot: 'Vaso',
        caissette: 'Covettes'
     }
    },
    help: {
      locations: 'Adicione e gerencie seus locais de cultivo (parcelas, vasos, bandejas).',
      seeds: 'Gerencie seu estoque de sementes e plantas.'
    },
    errors: {
      required: 'Por favor, preencha todos os campos obrigatórios.',
      invalid_number: 'Por favor, insira um número válido.'
    },
    warnings: {
      delete_seed: 'Culturas e colheitas dependentes desta planta ficarão inválidas. Deseja excluir esta semente?'
    },
// Dans translations.pt, après warnings: { ... }
errors: {
  location_in_use: 'Este local é usado em uma ou mais culturas.',
  delete_failed: 'Falha ao excluir o local.',
  invalid_id: 'Identificador de local inválido.',
  not_found: 'Local não encontrado.'
},
warnings: {
  delete_location: 'Deseja realmente excluir este local?',
  force_delete_location: 'Este local está vinculado a uma ou mais culturas. Excluí-lo pode afetar as culturas e colheitas associadas. Deseja forçar a exclusão?'
}
    ,
    months: {
      January: 'Janeiro',
      February: 'Fevereiro',
      March: 'Março',
      April: 'Abril',
      May: 'Maio',
      June: 'Junho',
      July: 'Julho',
      August: 'Agosto',
      September: 'Setembro',
      October: 'Outubro',
      November: 'Novembro',
      December: 'Dezembro'
    }
  }


};

// Variable pour stocker la langue actuelle
let currentLanguage = 'fr';

// Fonction pour récupérer une traduction
// Paramètres : key (clé de traduction, ex. 'tabs.locations')
// Retour : texte traduit
function getTranslation(key) {
  const keys = key.split('.');
  let result = translations[currentLanguage];
  for (const k of keys) {
    result = result[k];
    if (!result) return key; // Retourne la clé si non trouvée
  }
  return result;
}

// Fonction pour appliquer les traductions à la page
// Paramètres : aucun
// Retour : aucun
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = getTranslation(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = getTranslation(key);
  });
}

// Fonction pour définir la langue
// Paramètres : lang (code de langue, ex. 'fr')
// Retour : aucun
function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    applyTranslations();
    document.dispatchEvent(new Event('languageChanged'));
  }
}

// Initialisation des traductions au chargement
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
});