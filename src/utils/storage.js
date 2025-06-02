import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "caronas";

export async function getCaronas() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveCarona(carona) {
  const caronas = await getCaronas();
  caronas.push(carona);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(caronas));
}

export async function joinCarona(id, passageiro) {
  const caronas = await getCaronas();
  const index = caronas.findIndex((c) => c.id === id);

  if (index >= 0 && caronas[index].passageiros.length < caronas[index].vagas) {
    caronas[index].passageiros.push(passageiro);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(caronas));
  } else {
    throw new Error("Carona cheia ou não encontrada");
  }
}
