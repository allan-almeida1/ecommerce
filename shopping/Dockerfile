FROM node:bookworm
WORKDIR /shopping/app
COPY shopping/package.json /shopping/app/
COPY shopping/. /shopping/app/
COPY auth-shared-package ../auth-shared-package
EXPOSE 3001
RUN npm install
RUN npm link ../auth-shared-package
RUN npm run build
CMD ["npm", "start"]