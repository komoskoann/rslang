export default class LocalStorage {
  setToLocalStorage(valueName: string, value: string) {
    localStorage.setItem(valueName, value);
  }

  getFromLocalStorage(valueName: string) {
    return localStorage.getItem(valueName);
  }
}
