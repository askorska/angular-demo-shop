let lStore = {};

let mockLocalStorage = {
 
  getItem: (key: string): string => {
    return key in lStore ? lStore[key] : null;
  },
  setItem: (key: string, value: string) => {
    lStore[key] = `${value}`;
  },
  removeItem: (key: string) => {
    delete lStore[key];
  },
  clear: () => {
    lStore = {};
  }
};

export default mockLocalStorage;

