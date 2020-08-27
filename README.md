# Reversi

This is a online reversi game, the deployed website can be found at: https://playreversi.net/

uwsgi, python3.7+ and nginx must be installed independentlly firs (Use apt or any other package manager)

This has been tested on Windows 10 and Debian 10.

## Building and installing

The frontend is based off of React, it sits in the project root. It must be built before it can be used. Install the dependencies by:
```
npm install
cd server; pip install requirements.txt; cd ..;
npm run build
bash install.sh
```

Also remember to set a secret key using the environment variable: SECRET_KEY 
