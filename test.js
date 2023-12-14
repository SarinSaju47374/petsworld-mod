import CryptoJS from "crypto-js";
let secret_p = "Sanju";
let psswd = "assdfajsdhfljhsljdfh"
let c = CryptoJS.AES.encrypt(psswd, secret_p)
let dec = CryptoJS.AES.decrypt(c, secret_p).toString(CryptoJS.enc.Utf8)
console.log(dec);