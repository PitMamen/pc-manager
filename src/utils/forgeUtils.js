var forge = require('node-forge');
import Vue from 'vue'

/**解密病历数据
 * @param {Object} encryptedRecord 加密后的病历
 * @param {Object} wrappedDEK  加密封装后的会话秘钥，用于解密encryptedRecord。该会话秘钥为随机生成的AES 256bit对 称秘钥，再由客户端提供的公钥进行加密。
 */
export function decodeRecord(encryptedRecord, wrappedDEK) {

	if (encryptedRecord && wrappedDEK) {
		// var keypairsSto = uni.getStorageSync('keypair')
		var keypairsSto = Vue.ls.get('keypair')
		console.log(keypairsSto)

		var priKeyPem = keypairsSto.privateKey

		var priKey = forge.pki.privateKeyFromPem(priKeyPem);
		var keyAndIV = priKey.decrypt(forge.util.decode64(wrappedDEK), "RSA-OAEP");
		console.log("keyAndIV", keyAndIV.length)

		// keyAndIV 是一个byte数组，前32字节为AES key（256位），后16字节为AES iv
		// 用AES解密encryptedRecord
		const key = keyAndIV.slice(0, 32)
		console.log("key", key.length)
		const iv = keyAndIV.slice(-16)
		console.log("iv", iv.length)
		var decipher = forge.cipher.createDecipher('AES-CBC', key);
		decipher.start({
			iv: iv
		});
		decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedRecord)));
		var result = decipher.finish(); // 返回true表示成功，false表示失败
		console.log("result", result)
		if (result) {
			var decrypted = decipher.output.toString();
			console.log("decrypted2", JSON.parse(decrypted))
			return JSON.parse(decrypted);

		} else {
			return ''
		}
	} else {
		return ''
	}


}


function stringToByte(str) {
	var bytes = new Array();
	var len, c;
	len = str.length;
	for (var i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if (c >= 0x010000 && c <= 0x10FFFF) {
			bytes.push(((c >> 18) & 0x07) | 0xF0);
			bytes.push(((c >> 12) & 0x3F) | 0x80);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		} else if (c >= 0x000800 && c <= 0x00FFFF) {
			bytes.push(((c >> 12) & 0x0F) | 0xE0);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		} else if (c >= 0x000080 && c <= 0x0007FF) {
			bytes.push(((c >> 6) & 0x1F) | 0xC0);
			bytes.push((c & 0x3F) | 0x80);
		} else {
			bytes.push(c & 0xFF);
		}
	}
	return bytes;
}
export function encode(text) {
	// const keypairsSto = uni.getStorageSync('keypair');
	var keypairsSto = Vue.ls.get('keypair')
	console.log(keypairsSto);

	const pubKeyPem = keypairsSto.publicKey;
	const pubKey = forge.pki.publicKeyFromPem(pubKeyPem);

	return forge.util.encode64(pubKey.encrypt(text, "RSA-OAEP"));
}
export function decode(text) {
	// const keypairsSto = uni.getStorageSync('keypair');
	var keypairsSto = Vue.ls.get('keypair')
	console.log(keypairsSto);

	const priKeyPem = keypairsSto.privateKey;
	const priKey = forge.pki.privateKeyFromPem(priKeyPem);

	return priKey.decrypt(forge.util.decode64(text), "RSA-OAEP");
}

