// 加密内容脚本
// 使用方法: node scripts/encrypt-content.js "要加密的内容" "密码"

import CryptoJS from 'crypto-js';

const args = process.argv;
if (args.length < 4) {
  console.log('使用方法: node scripts/encrypt-content.js "要加密的内容" "密码"');
  process.exit(1);
}

const content = args[2];
const password = args[3];

// 加密内容
const encrypted = CryptoJS.AES.encrypt(content, password).toString();

console.log('加密后的内容:');
console.log(encrypted);
console.log('\n使用方法:');
console.log('<PasswordLock encryptedData="' + encrypted + '" hash="" />');
