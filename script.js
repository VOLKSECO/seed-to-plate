class PlantManager {
    constructor() {
        this.data = {
            seeds: {},
            seeding: {},
            seedlings: {},
            plants: {},
            locations: {},
            food: {}
        };
        this.currentFilter = 'seeds';
        this.currentLang = 'en';
        this.translations = {
            en: {
                title: 'From the seed to the plate',
                locations: 'Locations',
                seeds: 'Seeds',
                seeding: 'Seeding',
                seedlings: 'Seedlings',
                plants: 'Plants',
                food: 'Food',
                edit: 'Edit',
                delete: 'Delete',
                sow: 'Sow',
                germinate: 'Germinate',
                promote: 'Promote to Plant',
                save: 'Save',
                addSpecies: 'Add Species',
                saveChanges: 'Save Changes',
                addLocation: 'Add Location',
                addPlant: 'Add Plant',
                statistics: 'Statistics',
                totalSeedsSown: 'Total Seeds Sown',
                totalGerminated: 'Total Germinated',
                totalPlants: 'Total Plants',
                totalSeedsInStock: 'Total Seeds in Stock',
                help: {
                    locations: 'View and manage your planting locations. Click "Edit" to modify or "+ New" to add a new location.',
                    seeds: 'Browse your seed collection. Use the search bar to filter by common name, "Edit" to modify a seed, or "Sow" to start seeding.',
                    seeding: 'Track seeds in germination. Filter by location or plant, "Edit" to modify, or click to germinate.',
                    seedlings: 'Monitor seedlings ready for transplant. Filter by location or plant, "Edit" to modify, or click to promote.',
                    plants: 'Manage grown plants. Filter by location or plant, "Edit" to modify, or "+ New" to add a purchased plant.',
                    food: 'Explore recipes. Click "Edit" to modify, or "+ New" to add a recipe.'
                },
                upcoming: {
                    seeding: 'Germination this week',
                    seedlings: 'Transplants this week',
                    plants: 'Plants to harvest'
                }
            },
            fr: {
                title: 'De la graine à l’assiette',
                locations: 'Emplacements',
                seeds: 'Graines',
                seeding: 'Semis',
                seedlings: 'Plantules',
                plants: 'Plantes',
                food: 'Nourriture',
                edit: 'Modifier',
                delete: 'Supprimer',
                sow: 'Semer',
                germinate: 'Germer',
                promote: 'Promouvoir en plante',
                save: 'Enregistrer',
                addSpecies: 'Ajouter une espèce',
                saveChanges: 'Enregistrer les modifications',
                addLocation: 'Ajouter un emplacement',
                addPlant: 'Ajouter une plante',
                statistics: 'Statistiques',
                totalSeedsSown: 'Total des graines semées',
                totalGerminated: 'Total germé',
                totalPlants: 'Total des plantes',
                totalSeedsInStock: 'Total des graines en stock',
                help: {
                    locations: 'Voir et gérer vos emplacements de plantation. Cliquez sur "Modifier" ou "+ Nouveau" pour ajouter un emplacement.',
                    seeds: 'Parcourez vos graines. Filtrez par nom commun avec la barre de recherche, "Modifier" pour éditer, ou "Semer" pour commencer.',
                    seeding: 'Suivez les semis en germination. Filtrez par emplacement ou plante, "Modifier" pour ajuster, ou cliquez pour faire germer.',
                    seedlings: 'Surveillez les plantules prêtes à repiquer. Filtrez par emplacement ou plante, "Modifier" ou cliquez pour promouvoir.',
                    plants: 'Gérez vos plantes matures. Filtrez par emplacement ou plante, "Modifier" ou "+ Nouveau" pour ajouter une plante achetée.',
                    food: 'Explorez les recettes. Cliquez sur "Modifier" pour éditer ou "+ Nouveau" pour ajouter une recette.'
                },
                upcoming: {
                    seeding: 'Germination cette semaine',
                    seedlings: 'Transplants cette semaine',
                    plants: 'Plantes à récolter'
                }
            },
            pt: {
                title: 'Da semente ao prato',
                locations: 'Locais',
                seeds: 'Sementes',
                seeding: 'Semeadura',
                seedlings: 'Mudas',
                plants: 'Plantas',
                food: 'Comida',
                edit: 'Editar',
                delete: 'Excluir',
                sow: 'Semear',
                germinate: 'Germinar',
                promote: 'Promover a planta',
                save: 'Salvar',
                addSpecies: 'Adicionar espécie',
                saveChanges: 'Salvar alterações',
                addLocation: 'Adicionar local',
                addPlant: 'Adicionar planta',
                statistics: 'Estatísticas',
                totalSeedsSown: 'Total de sementes semeadas',
                totalGerminated: 'Total germinado',
                totalPlants: 'Total de plantas',
                totalSeedsInStock: 'Total de sementes em estoque',
                help: {
                    locations: 'Veja e gerencie seus locais de plantio. Clique em "Editar" ou "+ Novo" para adicionar um local.',
                    seeds: 'Explore suas sementes. Filtre por nome comum com a barra de busca, "Editar" para modificar, ou "Semear" para começar.',
                    seeding: 'Acompanhe sementes em germinação. Filtre por local ou planta, "Editar" para ajustar, ou clique para germinar.',
                    seedlings: 'Monitore mudas prontas para transplante. Filtre por local ou planta, "Editar" ou clique para promover.',
                    plants: 'Gerencie plantas maduras. Filtre por local ou planta, "Editar" ou "+ Novo" para adicionar uma planta comprada.',
                    food: 'Explore receitas. Clique em "Editar" para modificar ou "+ Novo" para adicionar uma receita.'
                },
                upcoming: {
                    seeding: 'Germinação esta semana',
                    seedlings: 'Transplantes esta semana',
                    plants: 'Plantas para colher'
                }
            }
        };
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.render();
    }

    async loadData() {
        const files = ['seeds', 'seeding', 'seedlings', 'plants', 'locations', 'food'];
        for (let file of files) {
            try {
                const response = await fetch(`data/${file}.md`);
                if (!response.ok) throw new Error(`Échec du chargement de data/${file}.md`);
                const text = await response.text();
                this.data[file] = this.parseMarkdown(text);
            } catch (error) {
                console.error(`Erreur lors du chargement de ${file}.md:`, error);
                this.data[file] = this.data[file] || {};
            }
        }
    }

    parseMarkdown(text) {
        const items = {};
        const sections = text.trim().split('\n# ').filter(section => section.trim() !== '');
        sections.forEach(section => {
            const lines = section.split('\n');
            const id = lines[0].startsWith('# ') ? lines[0].slice(2).trim() : lines[0].trim();
            const props = {};
            lines.slice(1).forEach(line => {
                if (line.startsWith('## ')) {
                    const [key, value] = line.slice(3).split(': ');
                    props[key.trim()] = value ? value.trim() : '';
                }
            });
            items[id] = props;
        });
        return items;
    }

    setupEventListeners() {
        document.querySelectorAll('nav button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelector('nav button.active')?.classList.remove('active');
                button.classList.add('active');
                this.currentFilter = button.dataset.filter;
                this.render();
            });
        });

        const modal = document.getElementById('modal');
        const closeBtn = document.querySelector('.close');
        closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target === modal) modal.style.display = 'none';
        };

        document.getElementById('dynamic-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const action = e.target.dataset.action;
            if (action === 'new-seeding') this.handleNewSeeding(new FormData(e.target));
            else if (action === 'edit-seeding') this.handleEditSeeding(new FormData(e.target));
            else if (action === 'delete-seeding') this.handleDelete('seeding', e.target.dataset.id);
            else if (action === 'new-species') this.handleNewSpecies(new FormData(e.target));
            else if (action === 'edit-species') this.handleEditSpecies(new FormData(e.target));
            else if (action === 'delete-species') this.handleDelete('seeds', e.target.dataset.id);
            else if (action === 'germinate') this.handleGerminate(new FormData(e.target));
            else if (action === 'edit-seedlings') this.handleEditSeedlings(new FormData(e.target));
            else if (action === 'delete-seedlings') this.handleDelete('seedlings', e.target.dataset.id);
            else if (action === 'promote') this.handlePromote(new FormData(e.target));
            else if (action === 'edit-plants') this.handleEditPlants(new FormData(e.target));
            else if (action === 'delete-plants') this.handleDelete('plants', e.target.dataset.id);
            else if (action === 'new-location') this.handleNewLocation(new FormData(e.target));
            else if (action === 'edit-location') this.handleEditLocation(new FormData(e.target));
            else if (action === 'delete-location') this.handleDelete('locations', e.target.dataset.id);
            else if (action === 'new-plant') this.handleNewPlant(new FormData(e.target));
            else if (action === 'new-food') this.handleNewFood(new FormData(e.target));
            else if (action === 'edit-food') this.handleEditFood(new FormData(e.target));
            else if (action === 'delete-food') this.handleDelete('food', e.target.dataset.id);
        });

        document.getElementById('light-theme').addEventListener('click', () => {
            document.documentElement.setAttribute('data-theme', 'light');
        });
        document.getElementById('dark-theme').addEventListener('click', () => {
            document.documentElement.setAttribute('data-theme', 'dark');
        });

        document.querySelectorAll('.lang-switcher button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelector('.lang-switcher button.active')?.classList.remove('active');
                button.classList.add('active');
                this.currentLang = button.dataset.lang;
                this.updateLanguage();
                this.render();
            });
        });

        document.getElementById('seed-search').addEventListener('input', () => this.render());
        document.getElementById('location-filter').addEventListener('change', () => this.render());
        document.getElementById('plant-filter').addEventListener('change', () => this.render());
    }

    calculateDays(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        return Math.floor((today - date) / (1000 * 60 * 60 * 24));
    }

    calculateWeeks(days) {
        return Math.floor(days / 7);
    }

    updateLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = this.translations[this.currentLang][key];
        });
    }

    render() {
        const content = document.getElementById('content');
        content.innerHTML = '';

        const helpText = document.getElementById('help-text');
        helpText.textContent = this.translations[this.currentLang].help[this.currentFilter];

        const upcomingContainer = document.getElementById('upcoming-container');
        const upcomingTitle = document.getElementById('upcoming-title');
        const upcomingContent = document.getElementById('upcoming-content');
        upcomingContent.innerHTML = '';
        if (['seeding', 'seedlings', 'plants'].includes(this.currentFilter)) {
            upcomingContainer.style.display = 'block';
            upcomingTitle.textContent = this.translations[this.currentLang].upcoming[this.currentFilter];
            this.renderUpcoming(upcomingContent);
        } else {
            upcomingContainer.style.display = 'none';
            upcomingTitle.textContent = '';
        }

        const seedSearch = document.getElementById('seed-search');
        const locationFilter = document.getElementById('location-filter');
        const plantFilter = document.getElementById('plant-filter');
        seedSearch.style.display = this.currentFilter === 'seeds' ? 'block' : 'none';
        locationFilter.style.display = ['seeding', 'seedlings', 'plants'].includes(this.currentFilter) ? 'block' : 'none';
        plantFilter.style.display = ['seeding', 'seedlings', 'plants', 'food'].includes(this.currentFilter) ? 'block' : 'none';

        locationFilter.innerHTML = '<option value="">Tous les emplacements</option>' + 
            Object.keys(this.data.locations).map(loc => `<option value="${loc}">${loc}</option>`).join('');
        plantFilter.innerHTML = '<option value="">Toutes les plantes</option>' + 
            Object.keys(this.data.seeds).map(seed => `<option value="${seed}">${seed}</option>`).join('');

        let filteredItems = this.data[this.currentFilter];
        if (this.currentFilter === 'seeds') {
            const searchTerm = seedSearch.value.toLowerCase();
            filteredItems = Object.fromEntries(
                Object.entries(filteredItems).filter(([_, item]) => 
                    (item['Common Name'] || '').toLowerCase().includes(searchTerm)
                )
            );
        } else if (['seeding', 'seedlings', 'plants'].includes(this.currentFilter)) {
            const location = locationFilter.value;
            const plant = plantFilter.value;
            filteredItems = Object.fromEntries(
                Object.entries(filteredItems).filter(([_, item]) => 
                    (!location || item.Location === location) && (!plant || item.Seed === plant)
                )
            );
        } else if (this.currentFilter === 'food') {
            const plant = plantFilter.value;
            filteredItems = Object.fromEntries(
                Object.entries(filteredItems).filter(([_, item]) => 
                    !plant || (item['Plant Type'] || '').includes(plant)
                )
            );
        }

        for (let id in filteredItems) {
            const item = filteredItems[id];
            const card = document.createElement('div');
            card.className = 'vcard';

            let html = '';
            if (this.currentFilter === 'seeds') {
                if (item.Photo) html += `<img src="${item.Photo}" alt="${item['Common Name'] || id}">`;
                html += `
                    <h3>${item['Common Name'] || id}</h3>
                    <p>${item['Scientific Name'] || ''}</p>
                    <p> ${item.Origin || 'N/A'}</p>
                    <p> ${item['Sowing Months'] || 'N/A'}</p>
                    <p> ${item.Quantity || '0'}</p>
                    <button class="edit" data-id="${id}">${this.translations[this.currentLang].edit}</button>
                    <button class="sow" data-id="${id}">${this.translations[this.currentLang].sow}</button>
                `;
                card.onclick = (e) => {
                    if (e.target.className === 'edit') this.showEditSpeciesModal(item, id);
                    else if (e.target.className === 'sow') this.showSeedingModal(item);
                };
            } else if (this.currentFilter === 'seeding') {
                const seed = this.data.seeds[item.Seed];
                if (seed && seed.Photo) html += `<img src="${seed.Photo}" alt="${item.Seed}">`;
                const days = this.calculateDays(item.Date);
                const germTime = seed && seed['Germination Time'] ? seed['Germination Time'].split('-')[1] : 'N/A';
                html += `
                    <h3>${id}</h3>
                    <p>Graine: ${item.Seed}</p>
                    <p>Emplacement: ${item.Location}</p>
                    <p>Quantité: ${item.Quantity}</p>
                    <p>Jours: ${days}</p>
                    <p>Germination dans: ${germTime !== 'N/A' ? Math.max(0, germTime - days) : 'N/A'} jours</p>
                    <button class="edit" data-id="${id}">${this.translations[this.currentLang].edit}</button>
                `;
                card.onclick = (e) => {
                    if (e.target.className === 'edit') this.showEditSeedingModal(item, id);
                    else this.showGerminateModal(item, id);
                };
            } else if (this.currentFilter === 'seedlings') {
                const seed = this.data.seeds[item.Seed];
                if (seed && seed.Photo) html += `<img src="${seed.Photo}" alt="${item.Seed}">`;
                const days = this.calculateDays(item.Date);
                const transTime = seed && seed['Transplant Time'] ? seed['Transplant Time'].split('-')[1] : 'N/A';
                html += `
                    <h3>${id}</h3>
                    <p>Graine: ${item.Seed}</p>
                    <p>Emplacement: ${item.Location}</p>
                    <p>Germées: ${item.Germinated}</p>
                    <p>Jours: ${days}</p>
                    <p>Repiquage dans: ${transTime !== 'N/A' ? Math.max(0, transTime - days) : 'N/A'} jours</p>
                    <button class="edit" data-id="${id}">${this.translations[this.currentLang].edit}</button>
                `;
                card.onclick = (e) => {
                    if (e.target.className === 'edit') this.showEditSeedlingsModal(item, id);
                    else this.showPromoteModal(item, id);
                };
            } else if (this.currentFilter === 'plants') {
                const seed = this.data.seeds[item.Seed];
                if (seed && seed.Photo) html += `<img src="${seed.Photo}" alt="${item.Seed}">`;
                const days = this.calculateDays(item['Transplant Date'] || new Date());
                const harvestTime = seed && seed['Harvest Time'] ? parseInt(seed['Harvest Time'].split('-')[1]) : 'N/A';
                const weeksLeft = harvestTime !== 'N/A' ? Math.max(0, harvestTime - this.calculateWeeks(days)) : 'N/A';
                html += `
                    <h3>${id}</h3>
                    <p>Graine: ${item.Seed}</p>
                    <p>Emplacement: ${item.Location}</p>
                    <p>Nombre: ${item.Count}</p>
                    <p>Jours: ${days}</p>
                    <p>Récolte dans: ${weeksLeft} semaines</p>
                    <button class="edit" data-id="${id}">${this.translations[this.currentLang].edit}</button>
                `;
                card.onclick = (e) => {
                    if (e.target.className === 'edit') this.showEditPlantsModal(item, id);
                };
            } else if (this.currentFilter === 'locations') {
                const seedingHere = Object.values(this.data.seeding).filter(s => s.Location === id).map(s => s.Seed).join(', ') || 'Aucun';
                const seedlingsHere = Object.values(this.data.seedlings).filter(s => s.Location === id).map(s => s.Seed).join(', ') || 'Aucun';
                const plantsHere = Object.values(this.data.plants).filter(p => p.Location === id).map(p => p.Seed).join(', ') || 'Aucun';
                if (item.Photo) html += `<img src="${item.Photo}" alt="${id}">`;
                html += `
                    <h3>${id}</h3>
                    <p>Capacité: ${item.Capacity}</p>
                    <p>Semis: ${seedingHere}</p>
                    <p>Plantules: ${seedlingsHere}</p>
                    <p>Plantes: ${plantsHere}</p>
                    <button class="edit" data-id="${id}">${this.translations[this.currentLang].edit}</button>
                `;
                card.onclick = (e) => {
                    if (e.target.className === 'edit') this.showEditLocationModal(item, id);
                };
            } else if (this.currentFilter === 'food') {
                if (item.Photo) html += `<img src="${item.Photo}" alt="${id}">`;
                html += `
                    <h3>${id}</h3>
                    <p>Type de plante: ${item['Plant Type'] || 'N/A'}</p>
                    <p>Recette: ${item.Recipe || 'N/A'}</p>
                    <button class="edit" data-id="${id}">${this.translations[this.currentLang].edit}</button>
                `;
                card.onclick = (e) => {
                    if (e.target.className === 'edit') this.showEditFoodModal(item, id);
                };
            }

            card.innerHTML = html;
            content.appendChild(card);
        }

        if (['seeds', 'locations', 'plants', 'food'].includes(this.currentFilter)) {
            const newCard = document.createElement('div');
            newCard.className = 'vcard';
            newCard.innerHTML = '<h3>+ Nouveau</h3>';
            newCard.onclick = () => {
                if (this.currentFilter === 'seeds') this.showNewSpeciesModal();
                else if (this.currentFilter === 'locations') this.showNewLocationModal();
                else if (this.currentFilter === 'plants') this.showNewPlantModal();
                else if (this.currentFilter === 'food') this.showNewFoodModal();
            };
            content.appendChild(newCard);
        }

        this.renderStats();
    }

    renderUpcoming(container) {
        const today = new Date();
        const oneWeekLater = new Date(today);
        oneWeekLater.setDate(today.getDate() + 7);

        let items = {};
        if (this.currentFilter === 'seeding') {
            items = Object.entries(this.data.seeding).filter(([_, item]) => {
                const seed = this.data.seeds[item.Seed];
                const days = this.calculateDays(item.Date);
                const germMax = seed && seed['Germination Time'] ? parseInt(seed['Germination Time'].split('-')[1]) : 0;
                return days + 7 >= germMax && days <= germMax;
            });
        } else if (this.currentFilter === 'seedlings') {
            items = Object.entries(this.data.seedlings).filter(([_, item]) => {
                const seed = this.data.seeds[item.Seed];
                const days = this.calculateDays(item.Date);
                const transMax = seed && seed['Transplant Time'] ? parseInt(seed['Transplant Time'].split('-')[1]) : 0;
                return days + 7 >= transMax && days <= transMax;
            });
        } else if (this.currentFilter === 'plants') {
            items = Object.entries(this.data.plants).filter(([_, item]) => {
                const seed = this.data.seeds[item.Seed];
                const days = this.calculateDays(item['Transplant Date']);
                const harvestMax = seed && seed['Harvest Time'] ? parseInt(seed['Harvest Time'].split('-')[1]) * 7 : 0;
                return days >= harvestMax;
            });
        }

        items.forEach(([id, item]) => {
            const card = document.createElement('div');
            card.className = 'vcard';
            let html = '';
            if (this.currentFilter === 'seeding') {
                const seed = this.data.seeds[item.Seed];
                if (seed && seed.Photo) html += `<img src="${seed.Photo}" alt="${item.Seed}">`;
                html += `<h3>${id}</h3><p>Graine: ${item.Seed}</p>`;
            } else if (this.currentFilter === 'seedlings') {
                const seed = this.data.seeds[item.Seed];
                if (seed && seed.Photo) html += `<img src="${seed.Photo}" alt="${item.Seed}">`;
                html += `<h3>${id}</h3><p>Graine: ${item.Seed}</p>`;
            } else if (this.currentFilter === 'plants') {
                const seed = this.data.seeds[item.Seed];
                if (seed && seed.Photo) html += `<img src="${seed.Photo}" alt="${item.Seed}">`;
                html += `<h3>${id}</h3><p>Graine: ${item.Seed}</p>`;
            }
            card.innerHTML = html;
            container.appendChild(card);
        });
    }

    renderStats() {
        const stats = document.getElementById('stats');
        const totalSeeded = Object.values(this.data.seeding).reduce((sum, item) => sum + parseInt(item.Quantity || 0), 0);
        const totalGerminated = Object.values(this.data.seedlings).reduce((sum, item) => sum + parseInt(item.Germinated || 0), 0);
        const totalPlants = Object.values(this.data.plants).reduce((sum, item) => sum + parseInt(item.Count || 0), 0);
        const totalSeedsInStock = Object.values(this.data.seeds).reduce((sum, item) => sum + parseInt(item.Quantity || 0), 0);

        stats.innerHTML = `
            <h3>${this.translations[this.currentLang].statistics}</h3>
            <p>${this.translations[this.currentLang].totalSeedsInStock}: ${totalSeedsInStock}</p>
            <p>${this.translations[this.currentLang].totalSeedsSown}: ${totalSeeded}</p>
            <p>${this.translations[this.currentLang].totalGerminated}: ${totalGerminated}</p>
            <p>${this.translations[this.currentLang].totalPlants}: ${totalPlants}</p>
            <p>Emplacements: ${Object.keys(this.data.locations).length}</p>
        `;
    }

    formatMarkdown(data) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            console.error('Données invalides passées à formatMarkdown (doit être un objet):', data);
            return '';
        }
        let markdown = '';
        for (const [id, props] of Object.entries(data)) {
            if (typeof props !== 'object' || props === null) {
                console.error(`Propriétés invalides pour l'ID ${id}:`, props);
                continue;
            }
            markdown += `# ${id}\n`;
            for (const [key, value] of Object.entries(props)) {
                markdown += `## ${key}: ${value !== undefined && value !== null ? value : ''}\n`;
            }
            markdown += '\n';
        }
        return markdown.trim();
    }

    async updateFile(file, data) {
        console.log(`Mise à jour de ${file}.md avec les données brutes:`, data);
        const markdownContent = this.formatMarkdown(data);
        console.log(`Markdown généré pour ${file}.md:`, markdownContent);
        try {
            const response = await fetch('http://localhost:3001/api/update-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: `${file}.md`, data: markdownContent })
            });
            if (!response.ok) throw new Error(`Échec de la mise à jour de ${file}.md`);
            await this.loadData();
            this.render();
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de ${file}.md:`, error);
            alert(`Échec de l'enregistrement des modifications dans ${file}.md. Affichage local uniquement.`);
            this.render();
        }
    }

    showSeedingModal(seed) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'new-seeding';
        form.innerHTML = `
            <label>Graine: <select name="seed">${Object.keys(this.data.seeds).map(s => 
                `<option value="${s}" ${s === seed['Common Name'] ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
            <label>Emplacement: <select name="location">${Object.keys(this.data.locations).map(l => 
                `<option value="${l}">${l}</option>`).join('')}</select></label>
            <label>Quantité: <input type="number" name="quantity" min="1" required></label>
            <label>Date: <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required></label>
            <button type="submit">${this.translations[this.currentLang].sow}</button>
        `;
        modal.style.display = 'block';
    }

    async handleNewSeeding(formData) {
        const newId = `Seeding ${Object.keys(this.data.seeding).length + 1}`;
        const newSeeding = {
            Location: formData.get('location'),
            Date: formData.get('date'),
            Seed: formData.get('seed'),
            Quantity: formData.get('quantity')
        };
        console.log('Avant ajout à this.data.seeding:', { [newId]: newSeeding });
        this.data.seeding[newId] = newSeeding;
        console.log('this.data.seeding après ajout:', this.data.seeding);
        await this.updateFile('seeding', this.data.seeding);
        document.getElementById('modal').style.display = 'none';
    }

    showEditSeedingModal(item, id) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'edit-seeding';
        form.dataset.id = id;
        form.innerHTML = `
            <input type="hidden" name="id" value="${id}">
            <label>Graine: <input type="text" name="seed" value="${item.Seed}" readonly></label>
            <label>Emplacement: <select name="location">${Object.keys(this.data.locations).map(l => 
                `<option value="${l}" ${l === item.Location ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
            <label>Quantité: <input type="number" name="quantity" value="${item.Quantity}" min="1" required></label>
            <label>Date: <input type="date" name="date" value="${item.Date}" required></label>
            <button type="submit">${this.translations[this.currentLang].save}</button>
            <button type="button" class="delete" onclick="document.getElementById('dynamic-form').dataset.action='delete-seeding';document.getElementById('dynamic-form').dispatchEvent(new Event('submit'))">${this.translations[this.currentLang].delete}</button>
        `;
        modal.style.display = 'block';
    }

    async handleEditSeeding(formData) {
        const id = formData.get('id');
        this.data.seeding[id] = {
            Location: formData.get('location'),
            Date: formData.get('date'),
            Seed: this.data.seeding[id].Seed,
            Quantity: formData.get('quantity')
        };
        await this.updateFile('seeding', this.data.seeding);
        document.getElementById('modal').style.display = 'none';
    }

    showNewSpeciesModal() {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'new-species';
        form.innerHTML = `
            <label>Nom commun: <input type="text" name="commonName" required></label>
            <label>Nom scientifique: <input type="text" name="scientificName"></label>
            <label>Origine: <input type="text" name="origin"></label>
            <label>Mois de semis: <input type="text" name="sowingMonths"></label>
            <label>Temps de germination (jours, ex: 7-14): <input type="text" name="germTime"></label>
            <label>Temps de repiquage (jours, ex: 30-40): <input type="text" name="transTime"></label>
            <label>Temps de récolte (semaines, ex: 8-10): <input type="text" name="harvestTime"></label>
            <label>Photo (optionnel): <input type="file" name="photo" accept="image/*" data-path="data/pics/"></label>
            <label>Quantité: <input type="number" name="quantity" min="0" value="0" required></label>
            <button type="submit">${this.translations[this.currentLang].addSpecies}</button>
        `;
        modal.style.display = 'block';
    }

    async handleNewSpecies(formData) {
        const newId = formData.get('commonName');
        const photoFile = formData.get('photo');
        const photoPath = photoFile && photoFile.name ? `data/pics/${photoFile.name}` : '';

        const newSpecies = {
            'Common Name': newId,
            'Scientific Name': formData.get('scientificName'),
            Origin: formData.get('origin'),
            'Sowing Months': formData.get('sowingMonths'),
            'Germination Time': formData.get('germTime'),
            'Transplant Time': formData.get('transTime'),
            'Harvest Time': formData.get('harvestTime'),
            Photo: photoPath,
            Quantity: formData.get('quantity')
        };
        this.data.seeds[newId] = newSpecies;
        await this.updateFile('seeds', this.data.seeds);
        document.getElementById('modal').style.display = 'none';
    }

    showEditSpeciesModal(item, id) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'edit-species';
        form.dataset.id = id;
        form.innerHTML = `
            <input type="hidden" name="id" value="${id}">
            <label>Nom commun: <input type="text" name="commonName" value="${item['Common Name']}" required></label>
            <label>Nom scientifique: <input type="text" name="scientificName" value="${item['Scientific Name'] || ''}"></label>
            <label>Origine: <input type="text" name="origin" value="${item.Origin || ''}"></label>
            <label>Mois de semis: <input type="text" name="sowingMonths" value="${item['Sowing Months'] || ''}"></label>
            <label>Temps de germination: <input type="text" name="germTime" value="${item['Germination Time'] || ''}"></label>
            <label>Temps de repiquage: <input type="text" name="transTime" value="${item['Transplant Time'] || ''}"></label>
            <label>Temps de récolte: <input type="text" name="harvestTime" value="${item['Harvest Time'] || ''}"></label>
            <label>Photo: <input type="file" name="photo" accept="image/*" data-path="data/pics/"> Actuelle: ${item.Photo || 'Aucune'}</label>
            <label>Quantité: <input type="number" name="quantity" value="${item.Quantity || '0'}" min="0" required></label>
            <button type="submit">${this.translations[this.currentLang].saveChanges}</button>
            <button type="button" class="delete" onclick="document.getElementById('dynamic-form').dataset.action='delete-species';document.getElementById('dynamic-form').dispatchEvent(new Event('submit'))">${this.translations[this.currentLang].delete}</button>
        `;
        modal.style.display = 'block';
    }

    async handleEditSpecies(formData) {
        const id = formData.get('id');
        const photoFile = formData.get('photo');
        const photoPath = photoFile && photoFile.name ? `data/pics/${photoFile.name}` : this.data.seeds[id].Photo;

        const updatedSpecies = {
            'Common Name': formData.get('commonName'),
            'Scientific Name': formData.get('scientificName'),
            Origin: formData.get('origin'),
            'Sowing Months': formData.get('sowingMonths'),
            'Germination Time': formData.get('germTime'),
            'Transplant Time': formData.get('transTime'),
            'Harvest Time': formData.get('harvestTime'),
            Photo: photoPath,
            Quantity: formData.get('quantity')
        };
        delete this.data.seeds[id];
        this.data.seeds[updatedSpecies['Common Name']] = updatedSpecies;
        await this.updateFile('seeds', this.data.seeds);
        document.getElementById('modal').style.display = 'none';
    }

    showGerminateModal(item, id) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'germinate';
        form.innerHTML = `
            <input type="hidden" name="id" value="${id}">
            <label>Graine: <input type="text" name="seed" value="${item.Seed}" readonly></label>
            <label>Emplacement: <input type="text" name="location" value="${item.Location}" readonly></label>
            <label>Quantité totale: <input type="number" name="total" value="${item.Quantity}" readonly></label>
            <label>Germées: <input type="number" name="germinated" min="0" max="${item.Quantity}" required></label>
            <label>Date: <input type="date" name="date" value="${item.Date}" required></label>
            <button type="submit">${this.translations[this.currentLang].germinate}</button>
        `;
        modal.style.display = 'block';
    }

    async handleGerminate(formData) {
        const id = formData.get('id');
        const germinated = parseInt(formData.get('germinated'));
        const total = parseInt(this.data.seeding[id].Quantity);
        const remaining = total - germinated;

        if (germinated > 0) {
            const newId = `Seedling ${Object.keys(this.data.seedlings).length + 1}`;
            this.data.seedlings[newId] = {
                Seed: this.data.seeding[id].Seed,
                Location: this.data.seeding[id].Location,
                Germinated: germinated.toString(),
                Date: formData.get('date')
            };
            await this.updateFile('seedlings', this.data.seedlings);
        }

        if (remaining > 0) {
            this.data.seeding[id].Quantity = remaining.toString();
        } else {
            delete this.data.seeding[id];
        }
        await this.updateFile('seeding', this.data.seeding);
        document.getElementById('modal').style.display = 'none';
    }

    showEditSeedlingsModal(item, id) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'edit-seedlings';
        form.dataset.id = id;
        form.innerHTML = `
            <input type="hidden" name="id" value="${id}">
            <label>Graine: <input type="text" name="seed" value="${item.Seed}" readonly></label>
            <label>Emplacement: <select name="location">${Object.keys(this.data.locations).map(l => 
                `<option value="${l}" ${l === item.Location ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
            <label>Germées: <input type="number" name="germinated" value="${item.Germinated}" min="1" required></label>
            <label>Date: <input type="date" name="date" value="${item.Date}" required></label>
            <button type="submit">${this.translations[this.currentLang].save}</button>
            <button type="button" class="delete" onclick="document.getElementById('dynamic-form').dataset.action='delete-seedlings';document.getElementById('dynamic-form').dispatchEvent(new Event('submit'))">${this.translations[this.currentLang].delete}</button>
        `;
        modal.style.display = 'block';
    }

    async handleEditSeedlings(formData) {
        const id = formData.get('id');
        this.data.seedlings[id] = {
            Seed: this.data.seedlings[id].Seed,
            Location: formData.get('location'),
            Germinated: formData.get('germinated'),
            Date: formData.get('date')
        };
        await this.updateFile('seedlings', this.data.seedlings);
        document.getElementById('modal').style.display = 'none';
    }

    showPromoteModal(item, id) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'promote';
        form.innerHTML = `
            <input type="hidden" name="id" value="${id}">
            <label>Graine: <input type="text" name="seed" value="${item.Seed}" readonly></label>
            <label>Total germé: <input type="number" name="total" value="${item.Germinated}" readonly></label>
            <label>Nouvel emplacement: <select name="location">${Object.keys(this.data.locations).map(l => 
                `<option value="${l}">${l}</option>`).join('')}</select></label>
            <label>Nombre à promouvoir: <input type="number" name="count" min="1" max="${item.Germinated}" required></label>
            <label>Date de repiquage: <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required></label>
            <button type="submit">${this.translations[this.currentLang].promote}</button>
        `;
        modal.style.display = 'block';
    }

    async handlePromote(formData) {
        const id = formData.get('id');
        const count = parseInt(formData.get('count'));
        const total = parseInt(this.data.seedlings[id].Germinated);
        const remaining = total - count;

        if (count > 0) {
            const newId = `Plant ${Object.keys(this.data.plants).length + 1}`;
            this.data.plants[newId] = {
                Seed: this.data.seedlings[id].Seed,
                Location: formData.get('location'),
                Count: count.toString(),
                'Transplant Date': formData.get('date')
            };
            await this.updateFile('plants', this.data.plants);
        }

        if (remaining > 0) {
            this.data.seedlings[id].Germinated = remaining.toString();
        } else {
            delete this.data.seedlings[id];
        }
        await this.updateFile('seedlings', this.data.seedlings);
        document.getElementById('modal').style.display = 'none';
    }

    showEditPlantsModal(item, id) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'edit-plants';
        form.dataset.id = id;
        form.innerHTML = `
            <input type="hidden" name="id" value="${id}">
            <label>Graine: <input type="text" name="seed" value="${item.Seed}" readonly></label>
            <label>Emplacement: <select name="location">${Object.keys(this.data.locations).map(l => 
                `<option value="${l}" ${l === item.Location ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
            <label>Nombre: <input type="number" name="count" value="${item.Count}" min="1" required></label>
            <label>Date de repiquage: <input type="date" name="date" value="${item['Transplant Date'] || new Date().toISOString().split('T')[0]}" required></label>
            <button type="submit">${this.translations[this.currentLang].save}</button>
            <button type="button" class="delete" onclick="document.getElementById('dynamic-form').dataset.action='delete-plants';document.getElementById('dynamic-form').dispatchEvent(new Event('submit'))">${this.translations[this.currentLang].delete}</button>
        `;
        modal.style.display = 'block';
    }

    async handleEditPlants(formData) {
        const id = formData.get('id');
        this.data.plants[id] = {
            Seed: this.data.plants[id].Seed,
            Location: formData.get('location'),
            Count: formData.get('count'),
            'Transplant Date': formData.get('date')
        };
        await this.updateFile('plants', this.data.plants);
        document.getElementById('modal').style.display = 'none';
    }

    showNewLocationModal() {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'new-location';
        form.innerHTML = `
            <label>Nom: <input type="text" name="name" required></label>
            <label>Capacité: <input type="number" name="capacity" min="1" required></label>
            <label>Photo (optionnel): <input type="file" name="photo" accept="image/*" data-path="data/pics/"></label>
            <button type="submit">${this.translations[this.currentLang].addLocation}</button>
        `;
        modal.style.display = 'block';
    }

    async handleNewLocation(formData) {
        const newId = formData.get('name');
        const photoFile = formData.get('photo');
        const photoPath = photoFile && photoFile.name ? `data/pics/${photoFile.name}` : '';

        const newLocation = {
            Name: newId,
            Capacity: formData.get('capacity'),
            Photo: photoPath
        };
        this.data.locations[newId] = newLocation;
        await this.updateFile('locations', this.data.locations);
        document.getElementById('modal').style.display = 'none';
    }

    showEditLocationModal(item, id) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'edit-location';
        form.dataset.id = id;
        form.innerHTML = `
            <input type="hidden" name="id" value="${id}">
            <label>Nom: <input type="text" name="name" value="${item.Name}" required></label>
            <label>Capacité: <input type="number" name="capacity" value="${item.Capacity}" min="1" required></label>
            <label>Photo: <input type="file" name="photo" accept="image/*" data-path="data/pics/"> Actuelle: ${item.Photo || 'Aucune'}</label>
            <button type="submit">${this.translations[this.currentLang].save}</button>
            <button type="button" class="delete" onclick="document.getElementById('dynamic-form').dataset.action='delete-location';document.getElementById('dynamic-form').dispatchEvent(new Event('submit'))">${this.translations[this.currentLang].delete}</button>
        `;
        modal.style.display = 'block';
    }

    async handleEditLocation(formData) {
        const id = formData.get('id');
        const photoFile = formData.get('photo');
        const photoPath = photoFile && photoFile.name ? `data/pics/${photoFile.name}` : this.data.locations[id].Photo;

        const updatedLocation = {
            Name: formData.get('name'),
            Capacity: formData.get('capacity'),
            Photo: photoPath
        };
        delete this.data.locations[id];
        this.data.locations[updatedLocation.Name] = updatedLocation;
        await this.updateFile('locations', this.data.locations);
        document.getElementById('modal').style.display = 'none';
    }

    showNewPlantModal() {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'new-plant';
        form.innerHTML = `
            <label>Graine: <select name="seed" onchange="this.value === 'new' ? document.getElementById('new-seed-fields').style.display = 'block' : document.getElementById('new-seed-fields').style.display = 'none'">
                ${Object.keys(this.data.seeds).map(s => `<option value="${s}">${s}</option>`).join('')}
                <option value="new">Nouvelle graine</option>
            </select></label>
            <div id="new-seed-fields" style="display: none;">
                <label>Nom commun: <input type="text" name="commonName"></label>
                <label>Nom scientifique: <input type="text" name="scientificName"></label>
                <label>Origine: <input type="text" name="origin"></label>
                <label>Mois de semis: <input type="text" name="sowingMonths"></label>
                <label>Temps de germination (jours, ex: 7-14): <input type="text" name="germTime"></label>
                <label>Temps de repiquage (jours, ex: 30-40): <input type="text" name="transTime"></label>
                <label>Temps de récolte (semaines, ex: 8-10): <input type="text" name="harvestTime"></label>
                <label>Photo (optionnel): <input type="file" name="photo" accept="image/*" data-path="data/pics/"></label>
                <label>Quantité en stock: <input type="number" name="quantity" min="0" value="0"></label>
            </div>
            <label>Emplacement: <select name="location">${Object.keys(this.data.locations).map(l => 
                `<option value="${l}">${l}</option>`).join('')}</select></label>
            <label>Nombre: <input type="number" name="count" min="1" required></label>
            <label>Date de repiquage: <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required></label>
            <button type="submit">${this.translations[this.currentLang].addPlant}</button>
        `;
        modal.style.display = 'block';
    }

    async handleNewPlant(formData) {
        const seed = formData.get('seed');
        const newId = `Plant ${Object.keys(this.data.plants).length + 1}`;

        if (seed === 'new') {
            const newSeedId = formData.get('commonName');
            const photoFile = formData.get('photo');
            const photoPath = photoFile && photoFile.name ? `data/pics/${photoFile.name}` : '';

            const newSpecies = {
                'Common Name': newSeedId,
                'Scientific Name': formData.get('scientificName'),
                Origin: formData.get('origin'),
                'Sowing Months': formData.get('sowingMonths'),
                'Germination Time': formData.get('germTime'),
                'Transplant Time': formData.get('transTime'),
                'Harvest Time': formData.get('harvestTime'),
                Photo: photoPath,
                Quantity: formData.get('quantity') || '0'
            };
            this.data.seeds[newSeedId] = newSpecies;
            await this.updateFile('seeds', this.data.seeds);

            this.data.plants[newId] = {
                Seed: newSeedId,
                Location: formData.get('location'),
                Count: formData.get('count'),
                'Transplant Date': formData.get('date')
            };
        } else {
            this.data.plants[newId] = {
                Seed: seed,
                Location: formData.get('location'),
                Count: formData.get('count'),
                'Transplant Date': formData.get('date')
            };
        }
        await this.updateFile('plants', this.data.plants);
        document.getElementById('modal').style.display = 'none';
    }

    showNewFoodModal() {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'new-food';
        form.innerHTML = `
            <label>Nom: <input type="text" name="name" required></label>
            <label>Type de plante: <select name="plantType">${Object.keys(this.data.seeds).map(s => 
                `<option value="${s}">${s}</option>`).join('')}</select></label>
            <label>Recette: <input type="text" name="recipe"></label>
            <label>Photo (optionnel): <input type="file" name="photo" accept="image/*" data-path="data/pics/"></label>
            <button type="submit">${this.translations[this.currentLang].save}</button>
        `;
        modal.style.display = 'block';
    }

    async handleNewFood(formData) {
        const newId = formData.get('name');
        const photoFile = formData.get('photo');
        const photoPath = photoFile && photoFile.name ? `data/pics/${photoFile.name}` : '';

        const newFood = {
            'Plant Type': formData.get('plantType'),
            Recipe: formData.get('recipe'),
            Photo: photoPath
        };
        this.data.food[newId] = newFood;
        await this.updateFile('food', this.data.food);
        document.getElementById('modal').style.display = 'none';
    }

    showEditFoodModal(item, id) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('dynamic-form');
        form.dataset.action = 'edit-food';
        form.dataset.id = id;
        form.innerHTML = `
            <input type="hidden" name="id" value="${id}">
            <label>Nom: <input type="text" name="name" value="${id}" required></label>
            <label>Type de plante: <select name="plantType">${Object.keys(this.data.seeds).map(s => 
                `<option value="${s}" ${s === item['Plant Type'] ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
            <label>Recette: <input type="text" name="recipe" value="${item.Recipe || ''}"></label>
            <label>Photo: <input type="file" name="photo" accept="image/*" data-path="data/pics/"> Actuelle: ${item.Photo || 'Aucune'}</label>
            <button type="submit">${this.translations[this.currentLang].save}</button>
            <button type="button" class="delete" onclick="document.getElementById('dynamic-form').dataset.action='delete-food';document.getElementById('dynamic-form').dispatchEvent(new Event('submit'))">${this.translations[this.currentLang].delete}</button>
        `;
        modal.style.display = 'block';
    }

    async handleEditFood(formData) {
        const id = formData.get('id');
        const photoFile = formData.get('photo');
        const photoPath = photoFile && photoFile.name ? `data/pics/${photoFile.name}` : this.data.food[id].Photo;

        const updatedFood = {
            'Plant Type': formData.get('plantType'),
            Recipe: formData.get('recipe'),
            Photo: photoPath
        };
        delete this.data.food[id];
        this.data.food[formData.get('name')] = updatedFood;
        await this.updateFile('food', this.data.food);
        document.getElementById('modal').style.display = 'none';
    }

    async handleDelete(category, id) {
        delete this.data[category][id];
        await this.updateFile(category, this.data[category]);
        document.getElementById('modal').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const manager = new PlantManager();
    manager.updateLanguage();
});