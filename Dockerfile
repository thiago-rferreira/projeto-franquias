# imagem do node
FROM node:18-alpine

# diretorio de trabalho
WORKDIR /app

#Copia os arquivos de dependencia
COPY package*.json ./

#Rodar os comandos de instalacao
RUN npm install

#Todos os arquivos do projetos fiquem no container
COPY  . .

#Gerar o prisma
RUN npx prisma generate

#Fazer build do next.js
RUN npm run build

#Expor a porta 3000 para o container
EXPOSE 3000

#Inicia o servidor next.js
CMD ["npm", "start"]