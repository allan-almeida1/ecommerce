FROM node:bookworm
WORKDIR /app
COPY shopping/package.json /app/
COPY shopping/. /app/
COPY auth-shared-package ./auth-shared-package
EXPOSE 3001
RUN npm install
RUN npm link ./auth-shared-package
RUN npm run build
CMD ["npm", "start"]