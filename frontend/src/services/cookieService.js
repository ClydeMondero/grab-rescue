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
  return CryptoJS.AES.encrypt(id, import.meta.env.VITE_SECRET_KEY).toString();
};

export const decryptID = (id) => {
  const bytes = CryptoJS.AES.decrypt(id, import.meta.env.VITE_SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
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

export const setRequestCookie = (id) => {
  const encryptedID = encryptID(id);

  Cookies.set("request_token", encryptedID, {
    expires: 14,
    secure: true,
    sameSite: "Lax",
  });
};

export const setLocationCookie = ({ latitude, longitude }) => {
  Cookies.set("location", JSON.stringify({ latitude, longitude }), {
    expires: 14,
    secure: true,
    sameSite: "Lax",
  });
};

export const getLocationCookie = () => {
  const location = Cookies.get("location");
  if (location) {
    return JSON.parse(location);
  } else {
    return null;
  }
};

export const setStatusCookie = (status) => {
  Cookies.set("status", status, {
    expires: 14,
    secure: true,
    sameSite: "Lax",
  });
};

export const getStatusCookie = () => {
  const status = Cookies.get("status");
  if (!status) {
    return null;
  }

  return status;
};

export const getRequestCookie = () => {
  const requestCookie = Cookies.get("request_token");
  if (!requestCookie) {
    return null;
  }

  return decryptID(requestCookie);
};

export const getCitizenCookie = () => {
  const citizenCookie = Cookies.get("citizen_token");
  if (!citizenCookie) {
    return null;
  }

  return decryptID(citizenCookie);
};

export const getUserCookie = () => {
  const userCookie = Cookies.get("token");
  if (!userCookie) {
    return null;
  }

  return userCookie;
};

// generate an id with the same id in firebase
export const generateID = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
