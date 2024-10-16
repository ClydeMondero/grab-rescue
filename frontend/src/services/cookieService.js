import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

export const deleteCookie = (cookieName) => {
  document.cookie = `${cookieName}=; expires=${new Date()};`;
};

export const getCookie = (cookieName) => {
  let name = cookieName + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const encryptID = (id) => {
  const payload = { id: id };
  const header = { alg: "HS256", typ: "JWT" };
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  const token = `${btoa(JSON.stringify(header))}.${btoa(
    JSON.stringify(payload)
  )}.${CryptoJS.HmacSHA256(
    `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}`,
    secretKey
  ).toString(CryptoJS.enc.Base64)}`;
  return token;
};

export const decryptID = (id) => {
  const [header, payload, signature] = id.split(".");
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  const expectedSignature = CryptoJS.HmacSHA256(
    `${header}.${payload}`,
    secretKey
  ).toString(CryptoJS.enc.Base64);

  if (signature !== expectedSignature) {
    throw new Error("Invalid signature");
  }

  const payloadDecoded = JSON.parse(atob(payload));
  return payloadDecoded.id;
};

//set citizen cookie
export const setCitizenCookie = (id) => {
  const encryptedID = encryptID(id);

  Cookies.set("citizen_token", encryptedID, {
    expires: 14,
    secure: true,
    sameSite: "Lax",
  });
};
export const getCitizenCookie = () => {
  const citizenCookie = Cookies.get("citizen_token");
  if (!citizenCookie) {
    return null;
  }

  return decryptID(citizenCookie);
};

// generate an id with the same id in firebase
export const generateID = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
