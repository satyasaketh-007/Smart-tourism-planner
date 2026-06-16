// Image imports
import jaipurHotel from "@/assets/locations/jaipur-hotel.jpg";
import hawaMahal from "@/assets/locations/hawa-mahal.jpg";
import amberFort from "@/assets/locations/amber-fort.jpg";
import cityPalaceUdaipur from "@/assets/locations/city-palace-udaipur.jpg";
import jaisalmerFort from "@/assets/locations/jaisalmer-fort.jpg";
import alleppeyHotel from "@/assets/locations/alleppey-hotel.jpg";
import munnarTea from "@/assets/locations/munnar-tea.jpg";
import alleppeyBackwaters from "@/assets/locations/alleppey-backwaters.jpg";
import fortKochi from "@/assets/locations/fort-kochi.jpg";
import candolimHotel from "@/assets/locations/candolim-hotel.jpg";
import aguadaFort from "@/assets/locations/aguada-fort.jpg";
import oldGoaChurches from "@/assets/locations/old-goa-churches.jpg";
import palolemBeach from "@/assets/locations/palolem-beach.jpg";
import shimlaHotel from "@/assets/locations/shimla-hotel.jpg";
import manali from "@/assets/locations/manali.jpg";
import mallRoadShimla from "@/assets/locations/mall-road-shimla.jpg";
import spitiValley from "@/assets/locations/spiti-valley.jpg";
import rishikeshHotel from "@/assets/locations/rishikesh-hotel.jpg";
import laxmanJhula from "@/assets/locations/laxman-jhula.jpg";
import nainitalLake from "@/assets/locations/nainital-lake.jpg";
import auli from "@/assets/locations/auli.jpg";
import chennaiHotel from "@/assets/locations/chennai-hotel.jpg";
import meenakshiTemple from "@/assets/locations/meenakshi-temple.jpg";
import ooty from "@/assets/locations/ooty.jpg";
import thanjavurTemple from "@/assets/locations/thanjavur-temple.jpg";
import mumbaiHotel from "@/assets/locations/mumbai-hotel.jpg";
import gatewayOfIndia from "@/assets/locations/gateway-of-india.jpg";
import lonavala from "@/assets/locations/lonavala.jpg";
import ajantaCaves from "@/assets/locations/ajanta-caves.jpg";
import srinagarHotel from "@/assets/locations/srinagar-hotel.jpg";
import dalLake from "@/assets/locations/dal-lake.jpg";
import gulmarg from "@/assets/locations/gulmarg.jpg";
import pahalgam from "@/assets/locations/pahalgam.jpg";
import hyderabadHotel from "@/assets/locations/hyderabad-hotel.jpg";
import charminar from "@/assets/locations/charminar.jpg";
import golcondaFort from "@/assets/locations/golconda-fort.jpg";
import ramojiFilmCity from "@/assets/locations/ramoji-film-city.jpg";
import vizagHotel from "@/assets/locations/vizag-hotel.jpg";
import tirupatiTemple from "@/assets/locations/tirupati-temple.jpg";
import arakuValley from "@/assets/locations/araku-valley.jpg";
import borraCaves from "@/assets/locations/borra-caves.jpg";

export interface LatLng {
  lat: number;
  lng: number;
  label: string;
  type: "hotel" | "spot";
  description?: string;
  duration?: string;
  image?: string;
}

const DATA: Record<string, { center: [number, number]; zoom: number; spots: LatLng[] }> = {
  Rajasthan: {
    center: [26.9, 75.8],
    zoom: 7,
    spots: [
      { lat: 26.9124, lng: 75.7873, label: "Hotel (Jaipur)", type: "hotel", description: "Comfortable stay in the heart of the Pink City with easy access to major attractions, local cuisine, and vibrant bazaars.", duration: "Overnight stay", image: jaipurHotel },
      { lat: 26.9239, lng: 75.8267, label: "Hawa Mahal", type: "spot", description: "The iconic 'Palace of Winds' with 953 small windows, showcasing exquisite Rajputana architecture and offering panoramic city views.", duration: "1–2 hours", image: hawaMahal },
      { lat: 26.9855, lng: 75.8513, label: "Amber Fort", type: "spot", description: "A majestic hilltop fortress blending Hindu and Mughal architecture, famous for its mirror palace and elephant rides.", duration: "2–3 hours", image: amberFort },
      { lat: 24.5854, lng: 73.6803, label: "City Palace, Udaipur", type: "spot", description: "A grand lakeside palace complex with museums, courtyards, and stunning views over Lake Pichola.", duration: "2–3 hours", image: cityPalaceUdaipur },
      { lat: 26.9157, lng: 70.9083, label: "Jaisalmer Fort", type: "spot", description: "One of the world's largest fully preserved fortified cities, rising from the Thar Desert sands with living heritage inside.", duration: "3–4 hours", image: jaisalmerFort },
    ],
  },
  Kerala: {
    center: [9.9, 76.3],
    zoom: 8,
    spots: [
      { lat: 9.4981, lng: 76.3388, label: "Hotel (Alleppey)", type: "hotel", description: "Relaxing waterfront accommodation in the 'Venice of the East' with houseboat views and Keralan hospitality.", duration: "Overnight stay", image: alleppeyHotel },
      { lat: 10.0889, lng: 77.0595, label: "Munnar Tea Gardens", type: "spot", description: "Rolling hills covered with lush tea plantations, offering scenic walks, tea-tasting sessions, and cool mountain air.", duration: "Half day", image: munnarTea },
      { lat: 9.9312, lng: 76.2673, label: "Alleppey Backwaters", type: "spot", description: "A serene network of lagoons and canals best explored by traditional houseboat, passing through palm-fringed villages.", duration: "4–5 hours", image: alleppeyBackwaters },
      { lat: 9.9658, lng: 76.2421, label: "Fort Kochi", type: "spot", description: "A historic port area with Chinese fishing nets, colonial-era churches, spice markets, and vibrant street art.", duration: "2–3 hours", image: fortKochi },
    ],
  },
  Goa: {
    center: [15.4, 73.95],
    zoom: 10,
    spots: [
      { lat: 15.5176, lng: 73.7629, label: "Hotel (Candolim)", type: "hotel", description: "Beachside resort in North Goa with easy access to sandy shores, shacks, and nightlife.", duration: "Overnight stay", image: candolimHotel },
      { lat: 15.5607, lng: 73.7526, label: "Aguada Fort", type: "spot", description: "A well-preserved 17th-century Portuguese fort with a lighthouse offering panoramic views of the Arabian Sea.", duration: "1–2 hours", image: aguadaFort },
      { lat: 15.5009, lng: 73.9118, label: "Old Goa Churches", type: "spot", description: "UNESCO World Heritage basilicas and cathedrals showcasing stunning Portuguese Baroque architecture.", duration: "2–3 hours", image: oldGoaChurches },
      { lat: 15.2227, lng: 73.9685, label: "Palolem Beach", type: "spot", description: "A crescent-shaped beach in South Goa famous for calm waters, kayaking, and bioluminescent plankton at night.", duration: "Half day", image: palolemBeach },
    ],
  },
  "Himachal Pradesh": {
    center: [31.8, 77.2],
    zoom: 8,
    spots: [
      { lat: 31.1048, lng: 77.1734, label: "Hotel (Shimla)", type: "hotel", description: "Charming hillside hotel in the former British summer capital with valley views and colonial-era charm.", duration: "Overnight stay", image: shimlaHotel },
      { lat: 32.2396, lng: 77.1887, label: "Manali", type: "spot", description: "A popular hill station at the northern end of the Kullu Valley, gateway to adventure sports and Rohtang Pass.", duration: "Full day", image: manali },
      { lat: 31.1048, lng: 77.1734, label: "Mall Road, Shimla", type: "spot", description: "The bustling heart of Shimla lined with shops, cafés, and heritage buildings — perfect for an evening stroll.", duration: "2–3 hours", image: mallRoadShimla },
      { lat: 32.5464, lng: 78.0334, label: "Spiti Valley", type: "spot", description: "A remote high-altitude desert valley with ancient monasteries, dramatic landscapes, and star-filled skies.", duration: "Full day", image: spitiValley },
    ],
  },
  Uttarakhand: {
    center: [30.1, 79.0],
    zoom: 8,
    spots: [
      { lat: 30.0869, lng: 78.2676, label: "Hotel (Rishikesh)", type: "hotel", description: "Riverside retreat in the 'Yoga Capital of the World', surrounded by forests and the sound of the Ganges.", duration: "Overnight stay", image: rishikeshHotel },
      { lat: 30.0869, lng: 78.2676, label: "Laxman Jhula", type: "spot", description: "An iconic iron suspension bridge over the Ganges, flanked by temples and ashrams with mountain backdrops.", duration: "1–2 hours", image: laxmanJhula },
      { lat: 29.3803, lng: 79.4636, label: "Nainital Lake", type: "spot", description: "A picturesque pear-shaped lake nestled among green hills, ideal for boating and lakeside walks.", duration: "3–4 hours", image: nainitalLake },
      { lat: 30.3965, lng: 79.5663, label: "Auli", type: "spot", description: "A premier ski destination with sweeping views of Himalayan peaks, lush meadows, and a scenic cable-car ride.", duration: "Half day", image: auli },
    ],
  },
  "Tamil Nadu": {
    center: [10.8, 78.7],
    zoom: 7,
    spots: [
      { lat: 13.0827, lng: 80.2707, label: "Hotel (Chennai)", type: "hotel", description: "Modern stay in India's cultural capital, close to Marina Beach, temples, and a thriving food scene.", duration: "Overnight stay", image: chennaiHotel },
      { lat: 9.9252, lng: 78.1198, label: "Meenakshi Temple, Madurai", type: "spot", description: "A stunning Dravidian temple complex with towering gopurams covered in thousands of colourful sculptures.", duration: "2–3 hours", image: meenakshiTemple },
      { lat: 11.4102, lng: 76.6950, label: "Ooty", type: "spot", description: "The 'Queen of Hill Stations' with botanical gardens, a toy train, and eucalyptus-scented trails.", duration: "Full day", image: ooty },
      { lat: 10.7867, lng: 79.1378, label: "Thanjavur Temple", type: "spot", description: "The Brihadeeswarar Temple, a UNESCO masterpiece of Chola architecture with a massive monolithic dome.", duration: "1–2 hours", image: thanjavurTemple },
    ],
  },
  Maharashtra: {
    center: [19.2, 73.8],
    zoom: 7,
    spots: [
      { lat: 19.0760, lng: 72.8777, label: "Hotel (Mumbai)", type: "hotel", description: "Stay in India's bustling financial capital with easy access to street food, Bollywood, and the seafront.", duration: "Overnight stay", image: mumbaiHotel },
      { lat: 18.9220, lng: 72.8347, label: "Gateway of India", type: "spot", description: "Mumbai's iconic waterfront arch monument, built to commemorate King George V's visit in 1911.", duration: "1 hour", image: gatewayOfIndia },
      { lat: 18.7494, lng: 73.4048, label: "Lonavala", type: "spot", description: "A scenic hill station between Mumbai and Pune, famous for waterfalls, caves, and chikki sweets.", duration: "Half day", image: lonavala },
      { lat: 20.5519, lng: 75.7033, label: "Ajanta Caves", type: "spot", description: "UNESCO-listed rock-cut Buddhist caves dating back to the 2nd century BCE with remarkable murals and sculptures.", duration: "3–4 hours", image: ajantaCaves },
    ],
  },
  "Jammu & Kashmir": {
    center: [34.1, 74.8],
    zoom: 8,
    spots: [
      { lat: 34.0837, lng: 74.7973, label: "Hotel (Srinagar)", type: "hotel", description: "Houseboat or lakeside hotel on Dal Lake with mountain panoramas and Kashmiri hospitality.", duration: "Overnight stay", image: srinagarHotel },
      { lat: 34.0836, lng: 74.8126, label: "Dal Lake", type: "spot", description: "Srinagar's jewel — a vast lake with floating gardens, shikara rides, and vibrant floating markets.", duration: "3–4 hours", image: dalLake },
      { lat: 34.0484, lng: 74.3805, label: "Gulmarg", type: "spot", description: "A meadow of flowers turned world-class ski resort, home to one of the highest gondola rides on Earth.", duration: "Full day", image: gulmarg },
      { lat: 34.0161, lng: 75.3150, label: "Pahalgam", type: "spot", description: "The 'Valley of Shepherds' — a serene base for treks, river rafting, and the Amarnath Yatra pilgrimage.", duration: "Half day", image: pahalgam },
    ],
  },
  Telangana: {
    center: [17.4, 78.5],
    zoom: 9,
    spots: [
      { lat: 17.3850, lng: 78.4867, label: "Hotel (Hyderabad)", type: "hotel", description: "Luxurious stay in the City of Pearls, known for its Nizami heritage, biryani, and IT hub culture.", duration: "Overnight stay", image: hyderabadHotel },
      { lat: 17.3616, lng: 78.4747, label: "Charminar", type: "spot", description: "Hyderabad's iconic 16th-century monument with four grand minarets, surrounded by bustling bazaars and street food.", duration: "1–2 hours", image: charminar },
      { lat: 17.3833, lng: 78.4011, label: "Golconda Fort", type: "spot", description: "A magnificent medieval fortress famous for its acoustic architecture, diamond trade history, and sound-and-light show.", duration: "2–3 hours", image: golcondaFort },
      { lat: 17.2543, lng: 78.6808, label: "Ramoji Film City", type: "spot", description: "The world's largest integrated film studio complex with theme parks, sets, and entertainment shows.", duration: "Full day", image: ramojiFilmCity },
    ],
  },
  "Andhra Pradesh": {
    center: [15.9, 79.7],
    zoom: 7,
    spots: [
      { lat: 17.6868, lng: 83.2185, label: "Hotel (Visakhapatnam)", type: "hotel", description: "Beachfront hotel in the 'City of Destiny' with stunning Bay of Bengal views and fresh seafood.", duration: "Overnight stay", image: vizagHotel },
      { lat: 13.6288, lng: 79.4192, label: "Tirupati Temple", type: "spot", description: "One of the world's most visited religious sites — the sacred Tirumala Venkateswara Temple atop seven hills.", duration: "Half day", image: tirupatiTemple },
      { lat: 18.3273, lng: 82.8756, label: "Araku Valley", type: "spot", description: "A scenic hill station with coffee plantations, tribal culture, and the breathtaking Ananthagiri Hills.", duration: "Full day", image: arakuValley },
      { lat: 18.2821, lng: 83.0363, label: "Borra Caves", type: "spot", description: "Million-year-old limestone caves with stunning stalactite and stalagmite formations deep in the Eastern Ghats.", duration: "2–3 hours", image: borraCaves },
    ],
  },
};

export const getStateLocations = (state: string) =>
  DATA[state] ?? DATA.Rajasthan;
