# README - Tutorial de Simulação e Execução

Este é um arquivo Node.js que realiza operações de criptografia de credenciais de usuário e chaves usando bibliotecas criptográficas embutidas do Node.js. O arquivo realiza as seguintes operações:

1. Solicita as credenciais do usuário (nome de usuário e senha).
2. Deriva uma chave de senha usando o algoritmo PBKDF2.
3. Armazena o nome de usuário criptografado em um arquivo.
4. Criptografa a senha usando o algoritmo AES-256-CBC e a chave derivada, em seguida, a salva em um arquivo.
5. Criptografa a chave e o vetor de inicialização (IV) usando o algoritmo AES-256-ECB e a chave mestra, em seguida, os salva em um arquivo.

## Pré-requisitos

Antes de executar este arquivo, você deve ter o Node.js instalado em seu sistema. Você pode baixá-lo em [nodejs.org](https://nodejs.org/).

## Fazendo o setup

Siga as etapas abaixo para simular e executar este arquivo Node.js:

1. Clone ou baixe este repositório em sua máquina local.

2. Abra o terminal e navegue até o diretório onde o arquivo está localizado.

3. Execute o comando:

```shell
node index.js
```

## Executando

O programa solicitará que você insira um nome de usuário e uma senha. Digite as informações solicitadas.

O arquivo realizará as operações de criptografia e salvará os resultados em arquivos de saída:

- `encryptedUsername.txt`: Nome de usuário criptografado
- `encryptedPassword.txt`: Senha criptografada
- `encryptedKeyAndIV.txt`: Chave e IV criptografados

Após a execução bem-sucedida, uma mensagem será exibida informando que as credenciais e chaves foram armazenadas com segurança.
