import AsyncStorage from '@react-native-async-storage/async-storage';

async function dumpAsyncStorage() {
  try {
    const keys = await AsyncStorage.getAllKeys();   // 👉 todas las claves
    const entries = await AsyncStorage.multiGet(keys); // 👉 pares [key, value]

    console.log('ASYNC STORAGE DUMP:');
    entries.forEach(([key, value]) => {
      console.log(`• ${key} = ${value}`);
    });
  } catch (e) {
    console.log('Error leyendo AsyncStorage', e);
  }
}

export { dumpAsyncStorage };