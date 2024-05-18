FROM node:latest as build

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist/frontend/browser .

RUN mkdir static

RUN mv *.js *.css static/

EXPOSE 80