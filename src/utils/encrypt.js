import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";
import { Buffer } from 'buffer';

const generatePassword = () => {
    const length = 20;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!£$%^&*()_+{}:@~<>?";
    let pwd = "";
    for (let i = 0; i < length; i++) {
        let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];
        randomNumber = randomNumber / 0x100000000;
        randomNumber = Math.floor(randomNumber * charset.length);

        pwd += charset[randomNumber];
    }

    const hash = bcrypt.hashSync(pwd, 10);
    const password = {
      password: pwd,
      hash: hash,
      encoded: Buffer.from(pwd).toString('hex')
    }

    return password;
}

export const encrypt = (text) => {
  let key = generatePassword();
  let crypt = CryptoJS.AES.encrypt(text, key.password).toString();
  return {
    crypt: crypt,
    hash: key.hash,
    encoded: key.encoded
  };
}

export const decrypt = (data, key) => {
    console.log(data, key)
    const decodedKey = Buffer.from(key, 'hex').toString('utf-8');
    if (bcrypt.compareSync(decodedKey, data['encryption-key-hash'].S)) {
        console.log(data['encrypted-data'].S)
        const decrypted = CryptoJS.AES.decrypt(data['encrypted-data'].S, decodedKey);
        if (decrypted) {
            try {
                const str = decrypted.toString(CryptoJS.enc.Utf8);
                if (str) {
                    console.log(str)
                    return str;
                }
                else {
                    console.log("EC-9002:- Failed to Decode!")
                }
            } catch (error) {
                console.log("EC9001:- Failed to Decode");
            }
        }
    }
}