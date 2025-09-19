/**
 * Philippine Address Data - Focused on Cavite Province
 * Maintains separation of concerns by keeping location data separate from business logic
 */

export interface LocationData {
  value: string;
  label: string;
  zipCode?: string;
}

export interface CityData extends LocationData {
  barangays: LocationData[];
}

/**
 * Cavite Cities and Municipalities with their Barangays
 * Optimized for scalability - easy to add more provinces later
 */
export const CAVITE_CITIES: CityData[] = [
  {
    value: "bacoor",
    label: "Bacoor City",
    zipCode: "4102",
    barangays: [
      { value: "alima", label: "Alima" },
      { value: "annalyn", label: "Annalyn" },
      { value: "banalo", label: "Banalo" },
      { value: "barangay-1", label: "Barangay 1 (Poblacion)" },
      { value: "barangay-2", label: "Barangay 2 (Poblacion)" },
      { value: "campo-santo", label: "Campo Santo" },
      { value: "daang-hari", label: "Daang Hari" },
      { value: "dulong-bayan", label: "Dulong Bayan" },
      { value: "habay-1", label: "Habay 1" },
      { value: "habay-2", label: "Habay 2" },
      { value: "kaingin", label: "Kaingin" },
      { value: "ligas-1", label: "Ligas 1" },
      { value: "ligas-2", label: "Ligas 2" },
      { value: "ligas-3", label: "Ligas 3" },
      { value: "mabolo-1", label: "Mabolo 1" },
      { value: "mabolo-2", label: "Mabolo 2" },
      { value: "mabolo-3", label: "Mabolo 3" },
      { value: "maliksi-1", label: "Maliksi 1" },
      { value: "maliksi-2", label: "Maliksi 2" },
      { value: "maliksi-3", label: "Maliksi 3" },
      { value: "molino-1", label: "Molino 1" },
      { value: "molino-2", label: "Molino 2" },
      { value: "molino-3", label: "Molino 3" },
      { value: "molino-4", label: "Molino 4" },
      { value: "molino-5", label: "Molino 5" },
      { value: "molino-6", label: "Molino 6" },
      { value: "molino-7", label: "Molino 7" },
      { value: "niog-1", label: "Niog 1" },
      { value: "niog-2", label: "Niog 2" },
      { value: "niog-3", label: "Niog 3" },
      { value: "panapaan-1", label: "Panapaan 1" },
      { value: "panapaan-2", label: "Panapaan 2" },
      { value: "panapaan-3", label: "Panapaan 3" },
      { value: "panapaan-4", label: "Panapaan 4" },
      { value: "panapaan-5", label: "Panapaan 5" },
      { value: "panapaan-6", label: "Panapaan 6" },
      { value: "panapaan-7", label: "Panapaan 7" },
      { value: "panapaan-8", label: "Panapaan 8" },
      { value: "queens-row-central", label: "Queens Row Central" },
      { value: "queens-row-east", label: "Queens Row East" },
      { value: "queens-row-west", label: "Queens Row West" },
      { value: "real-1", label: "Real 1" },
      { value: "real-2", label: "Real 2" },
      { value: "springville", label: "Springville" },
      { value: "tabing-ilog", label: "Tabing Ilog" },
      { value: "talaba-1", label: "Talaba 1" },
      { value: "talaba-2", label: "Talaba 2" },
      { value: "talaba-3", label: "Talaba 3" },
      { value: "talaba-4", label: "Talaba 4" },
      { value: "talaba-5", label: "Talaba 5" },
      { value: "vitangcol", label: "Vitangcol" },
      { value: "zapote-1", label: "Zapote 1" },
      { value: "zapote-2", label: "Zapote 2" },
      { value: "zapote-3", label: "Zapote 3" },
      { value: "zapote-4", label: "Zapote 4" },
      { value: "zapote-5", label: "Zapote 5" }
    ]
  },
  {
    value: "cavite-city",
    label: "Cavite City",
    zipCode: "4100",
    barangays: [
      { value: "barangay-1", label: "Barangay 1 (San Antonio)" },
      { value: "barangay-2", label: "Barangay 2 (Santa Cruz)" },
      { value: "barangay-3", label: "Barangay 3 (Sta. Lucia)" },
      { value: "barangay-4", label: "Barangay 4 (Caridad)" },
      { value: "barangay-5", label: "Barangay 5 (Santisima Trinidad)" },
      { value: "barangay-6", label: "Barangay 6 (San Roque)" },
      { value: "barangay-7", label: "Barangay 7 (Sta. Rita)" },
      { value: "barangay-8", label: "Barangay 8 (Santiago)" },
      { value: "barangay-9", label: "Barangay 9 (San Sebastian)" },
      { value: "barangay-10", label: "Barangay 10 (Poblacion)" },
      { value: "barangay-11", label: "Barangay 11 (Poblacion)" },
      { value: "barangay-12", label: "Barangay 12 (Poblacion)" },
      { value: "barangay-13", label: "Barangay 13 (Poblacion)" },
      { value: "barangay-14", label: "Barangay 14 (Poblacion)" }
    ]
  },
  {
    value: "dasmarinas",
    label: "Dasmariñas City",
    zipCode: "4114",
    barangays: [
      { value: "bagong-bayan", label: "Bagong Bayan" },
      { value: "burol", label: "Burol" },
      { value: "datu-esmael", label: "Datu Esmael" },
      { value: "fatima-1", label: "Fatima 1" },
      { value: "fatima-2", label: "Fatima 2" },
      { value: "fatima-3", label: "Fatima 3" },
      { value: "hindi", label: "Hindi" },
      { value: "langkaan-1", label: "Langkaan 1" },
      { value: "langkaan-2", label: "Langkaan 2" },
      { value: "luzviminda", label: "Luzviminda" },
      { value: "paliparan-1", label: "Paliparan 1" },
      { value: "paliparan-2", label: "Paliparan 2" },
      { value: "paliparan-3", label: "Paliparan 3" },
      { value: "robert-ferrer", label: "Robert Ferrer" },
      { value: "sabang", label: "Sabang" },
      { value: "salitran-1", label: "Salitran 1" },
      { value: "salitran-2", label: "Salitran 2" },
      { value: "salitran-3", label: "Salitran 3" },
      { value: "salitran-4", label: "Salitran 4" },
      { value: "sampalukan-1", label: "Sampalukan 1" },
      { value: "sampalukan-2", label: "Sampalukan 2" },
      { value: "sampalukan-3", label: "Sampalukan 3" },
      { value: "sampalukan-4", label: "Sampalukan 4" },
      { value: "san-agustin-1", label: "San Agustin 1" },
      { value: "san-agustin-2", label: "San Agustin 2" },
      { value: "san-agustin-3", label: "San Agustin 3" },
      { value: "san-dionisio", label: "San Dionisio" },
      { value: "san-esteban", label: "San Esteban" },
      { value: "san-jose", label: "San Jose" },
      { value: "san-miguel-1", label: "San Miguel 1" },
      { value: "san-miguel-2", label: "San Miguel 2" },
      { value: "santa-cruz-1", label: "Santa Cruz 1" },
      { value: "santa-cruz-2", label: "Santa Cruz 2" },
      { value: "santa-jenny", label: "Santa Jenny" },
      { value: "zone-1", label: "Zone 1 (Poblacion)" },
      { value: "zone-2", label: "Zone 2 (Poblacion)" },
      { value: "zone-3", label: "Zone 3 (Poblacion)" },
      { value: "zone-4", label: "Zone 4 (Poblacion)" }
    ]
  },
  {
    value: "imus",
    label: "Imus City",
    zipCode: "4103",
    barangays: [
      { value: "alapan-1a", label: "Alapan 1-A" },
      { value: "alapan-1b", label: "Alapan 1-B" },
      { value: "alapan-2a", label: "Alapan 2-A" },
      { value: "alapan-2b", label: "Alapan 2-B" },
      { value: "anabu-1a", label: "Anabu 1-A" },
      { value: "anabu-1b", label: "Anabu 1-B" },
      { value: "anabu-1c", label: "Anabu 1-C" },
      { value: "anabu-1d", label: "Anabu 1-D" },
      { value: "anabu-1e", label: "Anabu 1-E" },
      { value: "anabu-1f", label: "Anabu 1-F" },
      { value: "anabu-1g", label: "Anabu 1-G" },
      { value: "anabu-1h", label: "Anabu 1-H" },
      { value: "anabu-1i", label: "Anabu 1-I" },
      { value: "anabu-1j", label: "Anabu 1-J" },
      { value: "anabu-2a", label: "Anabu 2-A" },
      { value: "anabu-2b", label: "Anabu 2-B" },
      { value: "anabu-2c", label: "Anabu 2-C" },
      { value: "anabu-2d", label: "Anabu 2-D" },
      { value: "anabu-2e", label: "Anabu 2-E" },
      { value: "anabu-2f", label: "Anabu 2-F" },
      { value: "bayan-luma-1", label: "Bayan Luma 1" },
      { value: "bayan-luma-2", label: "Bayan Luma 2" },
      { value: "bayan-luma-3", label: "Bayan Luma 3" },
      { value: "bayan-luma-4", label: "Bayan Luma 4" },
      { value: "bayan-luma-5", label: "Bayan Luma 5" },
      { value: "bayan-luma-6", label: "Bayan Luma 6" },
      { value: "bayan-luma-7", label: "Bayan Luma 7" },
      { value: "bayan-luma-8", label: "Bayan Luma 8" },
      { value: "bayan-luma-9", label: "Bayan Luma 9" },
      { value: "bucandala-1", label: "Bucandala 1" },
      { value: "bucandala-2", label: "Bucandala 2" },
      { value: "bucandala-3", label: "Bucandala 3" },
      { value: "bucandala-4", label: "Bucandala 4" },
      { value: "bucandala-5", label: "Bucandala 5" },
      { value: "buhay-na-tubig", label: "Buhay na Tubig" },
      { value: "medicion-1a", label: "Medicion 1-A" },
      { value: "medicion-1b", label: "Medicion 1-B" },
      { value: "medicion-1c", label: "Medicion 1-C" },
      { value: "medicion-1d", label: "Medicion 1-D" },
      { value: "medicion-2a", label: "Medicion 2-A" },
      { value: "medicion-2b", label: "Medicion 2-B" },
      { value: "medicion-2c", label: "Medicion 2-C" },
      { value: "medicion-2d", label: "Medicion 2-D" },
      { value: "medicion-2e", label: "Medicion 2-E" },
      { value: "pag-asa-1", label: "Pag-asa 1" },
      { value: "pag-asa-2", label: "Pag-asa 2" },
      { value: "pag-asa-3", label: "Pag-asa 3" },
      { value: "poblacion-1a", label: "Poblacion 1-A" },
      { value: "poblacion-1b", label: "Poblacion 1-B" },
      { value: "poblacion-1c", label: "Poblacion 1-C" },
      { value: "poblacion-2a", label: "Poblacion 2-A" },
      { value: "poblacion-2b", label: "Poblacion 2-B" },
      { value: "poblacion-3a", label: "Poblacion 3-A" },
      { value: "poblacion-3b", label: "Poblacion 3-B" },
      { value: "poblacion-4a", label: "Poblacion 4-A" },
      { value: "poblacion-4b", label: "Poblacion 4-B" },
      { value: "tanzang-luma-1", label: "Tanzang Luma 1" },
      { value: "tanzang-luma-2", label: "Tanzang Luma 2" },
      { value: "tanzang-luma-3", label: "Tanzang Luma 3" },
      { value: "tanzang-luma-4", label: "Tanzang Luma 4" },
      { value: "tanzang-luma-5", label: "Tanzang Luma 5" },
      { value: "tanzang-luma-6", label: "Tanzang Luma 6" },
      { value: "toclong-1a", label: "Toclong 1-A" },
      { value: "toclong-1b", label: "Toclong 1-B" },
      { value: "toclong-1c", label: "Toclong 1-C" },
      { value: "toclong-2a", label: "Toclong 2-A" },
      { value: "toclong-2b", label: "Toclong 2-B" }
    ]
  },
  {
    value: "general-trias",
    label: "General Trias City",
    zipCode: "4107",
    barangays: [
      { value: "alingaro", label: "Alingaro" },
      { value: "arnaldo-poblacion", label: "Arnaldo (Poblacion)" },
      { value: "biclatan", label: "Biclatan" },
      { value: "buenavista-1", label: "Buenavista 1" },
      { value: "buenavista-2", label: "Buenavista 2" },
      { value: "buenavista-3", label: "Buenavista 3" },
      { value: "corregidor-poblacion", label: "Corregidor (Poblacion)" },
      { value: "dulong-bayan-poblacion", label: "Dulong Bayan (Poblacion)" },
      { value: "governor-ferrer-poblacion", label: "Governor Ferrer (Poblacion)" },
      { value: "javalera", label: "Javalera" },
      { value: "manggahan", label: "Manggahan" },
      { value: "navarro", label: "Navarro" },
      { value: "ninety-sixth-poblacion", label: "Ninety Sixth (Poblacion)" },
      { value: "panungyanan", label: "Panungyanan" },
      { value: "pasong-camachile-1", label: "Pasong Camachile 1" },
      { value: "pasong-camachile-2", label: "Pasong Camachile 2" },
      { value: "pasong-kawayan-1", label: "Pasong Kawayan 1" },
      { value: "pasong-kawayan-2", label: "Pasong Kawayan 2" },
      { value: "pinagtipunan", label: "Pinagtipunan" },
      { value: "prinza-poblacion", label: "Prinza (Poblacion)" },
      { value: "san-francisco", label: "San Francisco" },
      { value: "san-juan-1", label: "San Juan 1" },
      { value: "san-juan-2", label: "San Juan 2" },
      { value: "santiago", label: "Santiago" },
      { value: "tapia", label: "Tapia" },
      { value: "tejero", label: "Tejero" },
      { value: "vibora-poblacion", label: "Vibora (Poblacion)" }
    ]
  },
  {
    value: "kawit",
    label: "Kawit Municipality",
    zipCode: "4104",
    barangays: [
      { value: "batong-dalig", label: "Batong Dalig" },
      { value: "binakayan-kanluran", label: "Binakayan-Kanluran" },
      { value: "binakayan-silangan", label: "Binakayan-Silangan" },
      { value: "congkak", label: "Congkak" },
      { value: "kaingen", label: "Kaingen" },
      { value: "magdalo", label: "Magdalo" },
      { value: "manggahan", label: "Manggahan" },
      { value: "marulas", label: "Marulas" },
      { value: "paliwas", label: "Paliwas" },
      { value: "poblacion", label: "Poblacion" },
      { value: "pulvorista", label: "Pulvorista" },
      { value: "putol", label: "Putol" },
      { value: "samala-marulas", label: "Samala-Marulas" },
      { value: "san-sebastian", label: "San Sebastian" },
      { value: "sta-isabel", label: "Santa Isabel" },
      { value: "tabon-1", label: "Tabon 1" },
      { value: "tabon-2", label: "Tabon 2" },
      { value: "tabon-3", label: "Tabon 3" },
      { value: "toclong", label: "Toclong" },
      { value: "wakas-1", label: "Wakas 1" },
      { value: "wakas-2", label: "Wakas 2" }
    ]
  },
  {
    value: "rosario",
    label: "Rosario Municipality",
    zipCode: "4106",
    barangays: [
      { value: "kanluran", label: "Kanluran" },
      { value: "ligtong-1", label: "Ligtong 1" },
      { value: "ligtong-2", label: "Ligtong 2" },
      { value: "ligtong-3", label: "Ligtong 3" },
      { value: "ligtong-4", label: "Ligtong 4" },
      { value: "muzon-1", label: "Muzon 1" },
      { value: "muzon-2", label: "Muzon 2" },
      { value: "poblacion", label: "Poblacion" },
      { value: "sabang-1", label: "Sabang 1" },
      { value: "sabang-2", label: "Sabang 2" },
      { value: "salinas-1", label: "Salinas 1" },
      { value: "salinas-2", label: "Salinas 2" },
      { value: "salinas-3", label: "Salinas 3" },
      { value: "salinas-4", label: "Salinas 4" },
      { value: "sapa-1", label: "Sapa 1" },
      { value: "sapa-2", label: "Sapa 2" },
      { value: "sapa-3", label: "Sapa 3" },
      { value: "silangan", label: "Silangan" },
      { value: "tejeros-convention", label: "Tejeros Convention" },
      { value: "wawa-1", label: "Wawa 1" },
      { value: "wawa-2", label: "Wawa 2" }
    ]
  },
  {
    value: "trece-martires",
    label: "Trece Martires City",
    zipCode: "4109",
    barangays: [
      { value: "aguado", label: "Aguado" },
      { value: "brgy-cabezas", label: "Cabezas" },
      { value: "brgy-carmona", label: "Carmona" },
      { value: "brgy-conchu", label: "Conchu" },
      { value: "brgy-de-ocampo", label: "De Ocampo" },
      { value: "brgy-gregorio", label: "Gregorio" },
      { value: "brgy-hugo-perez", label: "Hugo Perez" },
      { value: "brgy-inocencio", label: "Inocencio" },
      { value: "brgy-lallana", label: "Lallana" },
      { value: "brgy-lapidario", label: "Lapidario" },
      { value: "brgy-luciano", label: "Luciano" },
      { value: "brgy-perez", label: "Perez" }
    ]
  },
  {
    value: "carmona",
    label: "Carmona Municipality",
    zipCode: "4116",
    barangays: [
      { value: "bancal", label: "Bancal" },
      { value: "barangay-1", label: "Barangay 1" },
      { value: "barangay-2", label: "Barangay 2" },
      { value: "barangay-3", label: "Barangay 3" },
      { value: "barangay-4", label: "Barangay 4" },
      { value: "barangay-5", label: "Barangay 5" },
      { value: "barangay-6", label: "Barangay 6" },
      { value: "barangay-7", label: "Barangay 7" },
      { value: "lantic", label: "Lantic" },
      { value: "maduya", label: "Maduya" },
      { value: "miga", label: "Miga" }
    ]
  },
  {
    value: "general-emilio-aguinaldo",
    label: "General Emilio Aguinaldo Municipality",
    zipCode: "4124",
    barangays: [
      { value: "buhay-na-tubig", label: "Buhay na Tubig" },
      { value: "castaños-cerca", label: "Castaños Cerca" },
      { value: "castaños-lejos", label: "Castaños Lejos" },
      { value: "kabulusan", label: "Kabulusan" },
      { value: "kaong", label: "Kaong" },
      { value: "lumipa", label: "Lumipa" },
      { value: "poblacion-1", label: "Poblacion 1" },
      { value: "poblacion-2", label: "Poblacion 2" },
      { value: "poblacion-3", label: "Poblacion 3" },
      { value: "poblacion-4", label: "Poblacion 4" }
    ]
  },
  {
    value: "general-mariano-alvarez",
    label: "General Mariano Alvarez Municipality",
    zipCode: "4117",
    barangays: [
      { value: "aldiano", label: "Aldiano" },
      { value: "barangay-almacen", label: "Almacen" },
      { value: "bernabe", label: "Bernabe" },
      { value: "binubusan", label: "Binubusan" },
      { value: "flores", label: "Flores" },
      { value: "govante", label: "Govante" },
      { value: "handog", label: "Handog" },
      { value: "macabling", label: "Macabling" },
      { value: "pangyao", label: "Pangyao" },
      { value: "poblacion", label: "Poblacion" },
      { value: "san-gabriel", label: "San Gabriel" },
      { value: "san-jose", label: "San Jose" }
    ]
  },
  {
    value: "silang",
    label: "Silang Municipality",
    zipCode: "4118",
    barangays: [
      { value: "adlas", label: "Adlas" },
      { value: "anahaw-1", label: "Anahaw 1" },
      { value: "anahaw-2", label: "Anahaw 2" },
      { value: "balite-1", label: "Balite 1" },
      { value: "balite-2", label: "Balite 2" },
      { value: "banaba", label: "Banaba" },
      { value: "barangay-biluso", label: "Biluso" },
      { value: "biga-1", label: "Biga 1" },
      { value: "biga-2", label: "Biga 2" },
      { value: "bucal", label: "Bucal" },
      { value: "bulihan", label: "Bulihan" },
      { value: "carmen", label: "Carmen" },
      { value: "diezmo", label: "Diezmo" },
      { value: "hukay", label: "Hukay" },
      { value: "lalaan-1", label: "Lalaan 1" },
      { value: "lalaan-2", label: "Lalaan 2" },
      { value: "latag", label: "Latag" },
      { value: "maguyam", label: "Maguyam" },
      { value: "malabanan", label: "Malabanan" },
      { value: "munting-ilog", label: "Munting Ilog" },
      { value: "poblacion", label: "Poblacion" },
      { value: "pooc-1", label: "Pooc 1" },
      { value: "pooc-2", label: "Pooc 2" },
      { value: "pulong-buhangin", label: "Pulong Buhangin" },
      { value: "pulong-saging", label: "Pulong Saging" },
      { value: "tartaria", label: "Tartaria" },
      { value: "tibig", label: "Tibig" },
      { value: "ulat", label: "Ulat" }
    ]
  }
];

/**
 * Helper function to get barangays for a specific city
 * Maintains separation of concerns by providing clean data access
 */
export const getBarangaysForCity = (cityValue: string): LocationData[] => {
  const city = CAVITE_CITIES.find(c => c.value === cityValue);
  return city ? city.barangays : [];
};

/**
 * Helper function to get zip code for a specific city
 * Supports future scalability for complex zip code logic
 */
export const getZipCodeForCity = (cityValue: string): string => {
  const city = CAVITE_CITIES.find(c => c.value === cityValue);
  return city ? city.zipCode || "" : "";
};

/**
 * Helper function to get all city options for picker
 * Maintains clean separation between data and UI components
 */
export const getCityOptions = () => {
  return CAVITE_CITIES.map(city => ({
    label: city.label,
    value: city.value
  }));
};