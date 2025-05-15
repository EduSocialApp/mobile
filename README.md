# EduSocial APP

Este projeto foi desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) do aluno Felipe Vieira Sobral, no curso de Licenciatura em Computação da Universidade Federal do Paraná – Setor Palotina, sob a orientação da professora Dra. Eliana Santana Lisboa.

O EduSocial é um aplicativo mobile que visa **fortalecer a comunicação entre família e escola**, promovendo o acompanhamento do desenvolvimento escolar dos alunos por meio de recursos simples, acessíveis e intuitivos.

A aplicação foi desenvolvida com base nos princípios do ***Lean Software Development***, e este repositório está sendo disponibilizado para fins de validação, teste e análise acadêmica.

---

## Instalação do Aplicativo (APK Android)

[Clique aqui para baixar o EduSocial.apk](https://expo.dev/artifacts/eas/ijz8BwJgHa3gnESDoBsMW7.apk)

1. No seu dispositivo Android, acesse o link acima.
2. Toque em “Fazer download” e aguarde a conclusão.
3. Após o término do download, toque no arquivo .apk para iniciar a instalação.
4. Caso o sistema solicite, ative a opção “Permitir instalação de fontes desconhecidas” nas configurações do seu dispositivo.
5. Concluída a instalação, abra o aplicativo normalmente.

## Instalação do Aplicativo (iOS)

[Clique aqui para instalar a *build* de desenvolvimento no iOS](https://expo.dev/accounts/felipesobral/projects/edusocial-app/builds/5950aa5d-abbb-4fbe-916d-1000d7ebb327)

Você deve ativar o Modo de Desenvolvedor caso ainda não esteja habilitado. Para isso, siga os passos abaixo:
1. Instale o aplicativo no seu dispositivo e toque no ícone do app para abri-lo.
2. Um alerta do sistema solicitará a ativação do Modo de Desenvolvedor. Toque em “OK”.
3. Em seguida, vá até Ajustes > Privacidade e Segurança > Modo de Desenvolvedor e ative a opção.
4. Quando solicitado, toque em “Reiniciar” para reiniciar o dispositivo.
5. Após a reinicialização, um novo alerta será exibido. Toque em “Ativar” e digite o código de acesso do dispositivo.

## Executando internamente

### Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes itens instalados em sua máquina:

-   [Git](https://git-scm.com/)
-   [Node.js](https://nodejs.org/) (versão recomendada: LTS)
-   [Expo CLI](https://docs.expo.dev/get-started/installation/)
    Instale globalmente com:
    ```bash
    npm install -g expo-cli
    ```

### Clonando o repositório

Clone este projeto para a sua máquina:

```bash
git clone https://github.com/EduSocialApp/mobile
cd mobile
```

### Instalando as dependências

Dentro da pasta do projeto, execute:

```bash
npm install
```

### Configuração do ambiente (.env)

Antes de rodar o projeto, crie um arquivo chamado .env na raiz do projeto e adicione as seguintes variáveis:

```bash
EXPO_PUBLIC_API_URL="https://edusocial.felipesobral.com.br"
```

> Obs: variáveis referentes ao ambiente de testes

### Rodando o projeto com Expo

Para iniciar o servidor de desenvolvimento do Expo, utilize:

```bash
npx expo start --go
```

### Abrindo no emulador ou dispositivo

#### Opção 1: Emulador Android

1. Abra o Android Studio e inicie um dispositivo virtual (AVD).
2. No terminal onde o Expo está rodando, pressione a para abrir no emulador Android.

#### Opção 2: Emulador iOS (apenas em MacOS)

1. Abra o Xcode e inicie um simulador iOS.
2. No terminal onde o Expo está rodando, pressione i para abrir no simulador iOS.

#### Opção 3: Dispositivo físico

1. Instale o aplicativo Expo Go no seu smartphone (disponível na Google Play Store ou App Store).
2. Escaneie o QR Code gerado no terminal ou na página web que abre ao rodar npx expo start.

### Scripts úteis

-   npx expo start – Inicia o projeto (servidor de desenvolvimento).
-   npm run android – Roda diretamente no emulador Android (se configurado).
-   npm run ios – Roda diretamente no simulador iOS (apenas em MacOS).
