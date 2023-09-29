// imports de bibliotecas
const crypto = require('crypto');
const fs = require('fs');
const archiveName = 'users.json';

// Pede as credenciais do usuário para realizar o processo de encriptação.
async function askForCredentials() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
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

// Hasheia o usuário com sha256 e o retorna
function encryptUsername(username) {
  const encryptedUsername = crypto.createHash('sha256').update(username).digest('hex');
  return encryptedUsername;
}

// Realiza a encriptação da senha em aes-256-cbc e retorna
function encryptPassword(password, key, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encryptedPassword = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
  return encryptedPassword.toString('hex');
}

// Realiza a encriptação da chave e do iv em aes-256-ecb e retorna
function encryptKeyAndIV(key, iv, masterKey) {
  const cipher = crypto.createCipher('aes-256-ecb', masterKey);
  const encryptedKeyAndIV = Buffer.concat([
    cipher.update(JSON.stringify({ key: key.toString('hex'), iv: iv.toString('hex') }), 'utf8'),
    cipher.final(),
  ]);
  return encryptedKeyAndIV.toString('hex');
}

function doYouWantToRegisterAnotherUser() {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question('Do you want to register another user? (y/n): ', (answer) => {
      readline.close();
      resolve(answer === 'y');
    });
  });
}

// funcao de registro
async function register(){
  let user = {};
  const { username, password } = await askForCredentials();
  const salt = crypto.randomBytes(16);
  const key = deriveKeysFromPassword(password, salt);
  const iv = crypto.randomBytes(16);
  user.username = encryptUsername(username);
  user.password = encryptPassword(password, key, iv);
  user.keyIv = encryptKeyAndIV(key, iv, Buffer.from('chave'));

  if (!fs.existsSync(archiveName)) {
    fs.writeFileSync(archiveName, JSON.stringify([user]));
    if (await doYouWantToRegisterAnotherUser()) {
      register();
    }
    return;
  }

  let users = [];
  let usersFile = [];
  if (fs.readFileSync(archiveName, 'utf8') !== '') {
    usersFile = JSON.parse(fs.readFileSync(archiveName, 'utf8'));
  }
  usersFile.forEach((userFile) => {
    users.push(userFile);
  });
  users.push(user);
  fs.writeFileSync(archiveName, JSON.stringify(users));
  if (await doYouWantToRegisterAnotherUser()) {
    register();
  }
}

// funcao de login
async function login(){
  if (!fs.existsSync(archiveName)) {
    console.log('There is no user registered');
    return;
  }
  const {username, password} = await askForCredentials();
  const users = JSON.parse(fs.readFileSync(archiveName, 'utf8'));
  const user = users.find(user => user.username === encryptUsername(username));
  if(!user){
    console.log('User not found');
    return;
  }
  const { key, iv } = decryptIvAndKey(user.keyIv, Buffer.from('chave'));
  if (user.password !== encryptPassword(password, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))) {
    console.log('Wrong password');
    return;
  }
  console.log('Logged in');
}

// funcao de decrypt do iv e da chave
function decryptIvAndKey(encryptedKeyAndIV, masterKey) {
  const decipher = crypto.createDecipher('aes-256-ecb', masterKey);
  const decryptedKeyAndIV = Buffer.concat([
    decipher.update(encryptedKeyAndIV, 'hex'),
    decipher.final(),
  ]);
  return JSON.parse(decryptedKeyAndIV.toString());
}

function isRegister(){
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    readline.question('Do you want to register? (y/n): ', (answer) => {
      readline.close();
      resolve(answer === 'y');
    });
  });
}

// função main
async function main() {
  if (!await isRegister()){
    login();
  } else {
    register();
  }
}

main()