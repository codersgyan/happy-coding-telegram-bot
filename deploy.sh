echo "Kill all the running PM2 actions"
pm2 stop all

echo "Jump to app folder"
cd /home/ubuntu/telegram-bot

echo "Update app from Git"
git pull

echo "Install app dependencies"
sudo rm -rf node_modules
sudo npm install

echo "Run new PM2 action"
pm2 start --name happy-coding-telegram-bot --prod index.js
pm2 startup
pm2 save