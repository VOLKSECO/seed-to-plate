const express = require('express');
const fs = require('fs').promises;
const path = require('path'); // Ajouté pour sécuriser les chemins
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static('.'));

app.post('/api/update-file', async (req, res) => {
    const { file, data } = req.body;

    // Vérification des paramètres
    if (!file || typeof data !== 'string') {
        return res.status(400).send('Requête invalide : "file" ou "data" manquant ou incorrect');
    }

    // Construction sécurisée du chemin du fichier
    const filePath = path.join(__dirname, 'data', file);

    try {
        // Écrit directement la chaîne Markdown reçue dans le fichier
        await fs.writeFile(filePath, data, 'utf8');
        console.log(`Fichier ${file} mis à jour avec succès`);
        res.status(200).send('File updated');
    } catch (error) {
        console.error(`Erreur lors de l'écriture du fichier ${file} :`, error);
        res.status(500).send('Error writing file');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});