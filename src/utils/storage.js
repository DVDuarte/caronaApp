import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@caronas";

export async function getCaronas() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveCarona(carona) {
  const caronas = await getCaronas();
  caronas.push(carona);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(caronas));
}

export async function joinCarona(id, user) {
  const caronas = await getCaronas();
  const updatedCaronas = caronas.map(carona =>
    carona.id === id ? { ...carona, passageiros: [...carona.passageiros, user] } : carona
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCaronas));
}
