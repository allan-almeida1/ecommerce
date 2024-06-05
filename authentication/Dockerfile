FROM node:bookworm
WORKDIR /app
COPY authentication/package.json /app/
COPY authentication/. /app/
COPY auth-shared-package ./auth-shared-package
EXPOSE 3000
RUN npm install
RUN npm link ./auth-shared-package
RUN npm run build
CMD ["npm", "start"]