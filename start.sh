#!/bin/bash

echo "Starting Plant Manager..."

# Remarque : Vérifie si un processus node server.js est en cours
if pgrep -f "node server.js" > /dev/null; then
    echo "Server is already running. Stopping it..."
    # Tue le processus node server.js
    pkill -f "node server.js"
    # Attend une seconde pour s'assurer que le processus est terminé
    sleep 1
fi

# Remarque : Démarre le serveur
echo "Starting server..."
node server.js &

# Remarque : Ouvre le navigateur avec l'URL de l'application
# Essaie 'open' (macOS) ou 'xdg-open' (Linux), selon le système
if command -v open > /dev/null; then
    open "http://localhost:3001/index.html"
elif command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:3001/index.html"
else
    echo "Could not open browser. Please open http://localhost:3001/index.html manually."
fi