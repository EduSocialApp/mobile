## Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes itens instalados em sua máquina:


- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (versão recomendada: LTS)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
  Instale globalmente com:
  ```bash
  npm install -g expo-cli
  ```

## Clonando o repositório

Clone este projeto para a sua máquina:

 ```bash
git clone https://github.com/EduSocialApp/mobile
cd mobile
 ```

## Instalando as dependências

Dentro da pasta do projeto, execute:

```bash
npm install
```

## Configuração do ambiente (.env)

Antes de rodar o projeto, crie um arquivo chamado .env na raiz do projeto e adicione as seguintes variáveis:

```bash
EXPO_PUBLIC_API_URL="https://edusocial.felipesobral.com.br"
EXPO_PUBLIC_API_KEY="abc123"
```

> Obs: variáveis referentes ao ambiente de testes

## Rodando o projeto com Expo

Para iniciar o servidor de desenvolvimento do Expo, utilize:

```bash
npx expo start
```

## Abrindo no emulador ou dispositivo

### Opção 1: Emulador Android
1. Abra o Android Studio e inicie um dispositivo virtual (AVD).
2. No terminal onde o Expo está rodando, pressione a para abrir no emulador Android.

### Opção 2: Emulador iOS (apenas em MacOS)
1. Abra o Xcode e inicie um simulador iOS.
2. No terminal onde o Expo está rodando, pressione i para abrir no simulador iOS.

### Opção 3: Dispositivo físico
1. Instale o aplicativo Expo Go no seu smartphone (disponível na Google Play Store ou App Store).
2. Escaneie o QR Code gerado no terminal ou na página web que abre ao rodar npx expo start.

## Scripts úteis

- npx expo start – Inicia o projeto (servidor de desenvolvimento).
- npm run android – Roda diretamente no emulador Android (se configurado).
- npm run ios – Roda diretamente no simulador iOS (apenas em MacOS).
