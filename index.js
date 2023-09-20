// imports de bibliotecas
const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Pede as credenciais do usuário para realizar o processo de encriptação.
async function askForCredentials() {
  return new Promise((resolve) => {
    readline.question('Enter Username: ', (username) => {
      readline.question('Enter Password: ', (password) => {
        readline.close();
        resolve({ username, password });
      });
    });
  });
}

// Deriva uma chave da senha utilizando pbkdf2
function deriveKeysFromPassword(password, salt) {
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  return key;
}

// Hasheia o usuário com sha256 e o salva em um arquivo txt.
function storeEncryptedUsername(username, filename) {
  const encryptedUsername = crypto.createHash('sha256').update(username).digest('hex');
  fs.writeFileSync(filename, encryptedUsername);
}

// Encripta a senha com aes-256-cbc utilizando a chave e o iv, e então salva-a em um arquivo txt.
function encryptPassword(password, key, iv, filename) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encryptedPassword = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
  fs.writeFileSync(filename, encryptedPassword);
}

// Realiza a encriptação da chave e do iv em aes-256-ecb e o salva em um arquivo txt.
function encryptKeyAndIV(key, iv, masterKey, filename) {
  const cipher = crypto.createCipher('aes-256-ecb', masterKey);
  const encryptedKeyAndIV = Buffer.concat([
    cipher.update(JSON.stringify({ key: key.toString('hex'), iv: iv.toString('hex') }), 'utf8'),
    cipher.final(),
  ]);
  fs.writeFileSync(filename, encryptedKeyAndIV);
}

// função main
async function main() {
  const { username, password } = await askForCredentials();
  const salt = crypto.randomBytes(16);
  const key = deriveKeysFromPassword(password, salt);
  const iv = crypto.randomBytes(16);

  storeEncryptedUsername(username, 'encryptedUsername.txt');
  encryptPassword(password, key, iv, 'encryptedPassword.txt');
  encryptKeyAndIV(key, iv, Buffer.from('chave'), 'encryptedKeyAndIV.txt');

  console.log('Credentials and keys have been securely stored.');
}

main();
