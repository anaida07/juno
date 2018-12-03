FROM electronuserland/builder:wine

WORKDIR /opt/juno
COPY . .
RUN npm install
CMD [ "npm", "run", "electron-dev" ]