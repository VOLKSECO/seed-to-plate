const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// Configuration de Multer pour les uploads d'images
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = path.join(__dirname, 'data/pics');
    try {
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté (JPEG, JPG, PNG, GIF uniquement)'));
    }
  }
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use('/data', express.static('data'));

// Middleware pour les erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Erreur d'upload: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// Parser un fichier Markdown
async function parseMarkdown(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    console.log(`Lecture de ${filePath}:`, content.slice(0, 100) + '...'); // Log partiel
    const items = [];
    let currentItem = null;

    content.split('\n').forEach(line => {
      line = line.trim();
      if (line.startsWith('# ')) {
        if (currentItem) items.push(currentItem);
        currentItem = { id: line.slice(2).trim(), data: {} };
      } else if (line.startsWith('## ') && currentItem) {
        const [key, ...value] = line.slice(3).split(': ');
        currentItem.data[key.trim()] = value.join(': ').trim();
      }
    });

    if (currentItem) items.push(currentItem);
    return items.map(item => ({
      id: item.id,
      ...item.data
    }));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Fichier ${filePath} non trouvé, création d'un fichier vide`);
      await fs.writeFile(filePath, '', 'utf8');
      return [];
    }
    console.error(`Erreur lecture ${filePath}:`, error);
    throw error;
  }
}

// Écrire un fichier Markdown
async function writeMarkdown(filePath, items) {
  let content = '';
  items.forEach(item => {
    content += `# ${item.id}\n`;
    Object.entries(item).forEach(([key, value]) => {
      if (key !== 'id') {
        content += `## ${key}: ${value !== undefined && value !== null ? value : ''}\n`;
      }
    });
    content += '\n';
  });
  console.log(`Écriture dans ${filePath}:`, content.slice(0, 100) + '...');
  await fs.writeFile(filePath, content, 'utf8');
}

// Vérifier les dépendances avant suppression
async function checkDependencies(category, id, force = false) {
  if (category === 'locations' && !force) {
    const cultures = await parseMarkdown(path.join(__dirname, 'data/cultures.md')).catch(() => []);
    if (cultures.some(c => c.Lieu === id)) {
      throw new Error('Lieu utilisé dans une culture');
    }
  }
  if (category === 'cultures') {
    const harvests = await parseMarkdown(path.join(__dirname, 'data/harvests.md')).catch(() => []);
    if (harvests.some(h => h.Culture === id)) {
      throw new Error('Culture utilisée dans une récolte');
    }
  }
  // Pas de vérification pour les graines
}

// Endpoint pour lire le rapport
app.get('/api/bilan', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'bilan.md');
    console.log(`Tentative de lecture de ${filePath}`);
    const content = await fs.readFile(filePath, 'utf8');
    console.log(`Contenu de bilan.md:`, content.slice(0, 100) + '...');
    res.json({ content });
  } catch (error) {
    console.error('Erreur lecture bilan:', error);
    if (error.code === 'ENOENT') {
      console.log(`Fichier ${filePath} non trouvé, retour d'un contenu vide`);
      res.json({ content: '' });
    } else {
      res.status(500).json({ error: 'Erreur lors de la lecture du rapport' });
    }
  }
});

// Endpoint pour sauvegarder le rapport
app.put('/api/bilan', async (req, res) => {
  const { content } = req.body;
  console.log('Requête PUT /api/bilan reçue, contenu:', content ? content.slice(0, 100) + '...' : 'undefined');
  if (typeof content !== 'string') {
    console.error('Contenu invalide:', req.body);
    return res.status(400).json({ error: 'Contenu invalide, une chaîne est attendue' });
  }
  try {
    const filePath = path.join(__dirname, 'data', 'bilan.md');
    console.log(`Tentative d'écriture dans ${filePath}`);
    await fs.writeFile(filePath, content, 'utf8');
    console.log('Rapport sauvegardé avec succès');
    res.json({ message: 'Rapport sauvegardé' });
  } catch (error) {
    console.error('Erreur sauvegarde bilan:', error);
    res.status(500).json({ error: `Erreur lors de la sauvegarde du rapport: ${error.message}` });
  }
});

// Endpoint pour récupérer les espèces
app.get('/api/species', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'species.md');
    const content = await fs.readFile(filePath, 'utf8');
    const categories = [];
    let currentCategory = null;

    content.split('\n').forEach(line => {
      if (line.startsWith('# ')) {
        currentCategory = { name: line.replace('# ', '').trim(), species: [] };
        categories.push(currentCategory);
      } else if (line.startsWith('## Espèce: ') && currentCategory) {
        currentCategory.species.push(line.replace('## Espèce: ', '').trim());
      }
    });

    res.json(categories);
  } catch (error) {
    console.error('Erreur lors du chargement des espèces:', error);
    res.status(500).json({ error: 'Erreur lors du chargement des espèces' });
  }
});

// Endpoint pour récupérer les données
app.get('/api/:category', async (req, res) => {
  const { category } = req.params;
  const validCategories = ['locations', 'seeds', 'cultures', 'harvests'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Catégorie invalide' });
  }

  const filePath = path.join(__dirname, 'data', `${category}.md`);
  try {
    const data = await parseMarkdown(filePath);
    console.log(`Données récupérées pour ${category}:`, data.length, 'éléments');
    res.json(data);
  } catch (error) {
    console.error(`Erreur lecture ${category}:`, error);
    res.status(500).json({ error: 'Erreur lors de la lecture des données' });
  }
});

// Endpoint pour sauvegarder les données
app.put('/api/:category', async (req, res) => {
  const { category } = req.params;
  const validCategories = ['locations', 'seeds', 'cultures', 'harvests'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Catégorie invalide' });
  }

  const filePath = path.join(__dirname, 'data', `${category}.md`);
  try {
    console.log(`Sauvegarde ${category}:`, JSON.stringify(req.body, null, 2));
    await writeMarkdown(filePath, req.body);
    res.json({ message: 'Données sauvegardées' });
  } catch (error) {
    console.error(`Erreur sauvegarde ${category}:`, error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde des données' });
  }
});

// Endpoint pour supprimer une entrée
app.post('/api/:category/delete', async (req, res) => {
  const { category } = req.params;
  const { id, force } = req.body;
  const validCategories = ['locations', 'seeds', 'cultures', 'harvests'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Catégorie invalide' });
  }
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Identifiant invalide' });
  }

  const filePath = path.join(__dirname, 'data', `${category}.md`);
  try {
    await checkDependencies(category, id, force === true);
    const items = await parseMarkdown(filePath);
    const itemExists = items.some(item => item.id === id);
    if (!itemExists) {
      return res.status(404).json({ error: 'Entrée non trouvée' });
    }
    const updatedItems = items.filter(item => item.id !== id);
    await writeMarkdown(filePath, updatedItems);
    res.json({ message: 'Entrée supprimée' });
  } catch (error) {
    console.error(`Erreur suppression ${category}:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Endpoint pour uploader une image
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucune image fournie ou fichier invalide' });
  }
  const imagePath = `/data/pics/${req.file.filename}`;
  console.log('Image uploadée:', imagePath);
  res.json({ image: imagePath });
});

// Middleware pour les erreurs non gérées
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});