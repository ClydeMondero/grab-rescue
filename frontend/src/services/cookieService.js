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

//hash id
export const hashID = (id) => {
  return CryptoJS.SHA256(id).toString(CryptoJS.enc.Hex);
};

//set citizen cookie
export const setCitizenCookie = (id) => {
  const hashedID = hashID(id);

  Cookies.set("citizen_token", hashedID, {
    expires: 7,
    secure: true,
    sameSite: "Lax",
  });
};
