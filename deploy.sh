echo "Kill all the running PM2 actions"
sudo pm2 stop happy-coding-telegram-bot

echo "Jump to app folder"
cd /home/ubuntu/telegram-bot

echo "Update app from Git"
git pull

echo "Install app dependencies"
sudo rm -rf node_modules
sudo npm install

echo "Run new PM2 action"
sudo pm2 start --name happy-coding-telegram-bot index.js