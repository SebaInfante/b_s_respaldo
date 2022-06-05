const bcrypt = require('bcrypt');

export const encriptar = async (planePassword: String) => {
  return await bcrypt.hash(planePassword, 10);
};

export const desencriptar = async (planePassword: string, hashPassword: string) => {
  return await bcrypt.compare(planePassword, hashPassword);
};

