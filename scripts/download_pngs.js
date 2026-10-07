import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CONCEPTS = {
  eyes: ["Human eye macro", "Eye iris close-up", "Blue human eye", "Brown human eye"],
  ears: ["Human ear side", "Ear anatomy external", "Human ear lobe", "Outer ear close-up"],
  cat: ["Domestic cat sitting", "Cat portrait close-up", "Tabby cat", "White cat portrait"],
  dog: ["Golden Retriever dog", "Dog sitting outdoor", "German Shepherd dog", "Puppy portrait"],
  elephant: ["Asian elephant", "African elephant portrait", "Elephant walking", "Elephant calf"],
  fish: ["Goldfish swimming", "Clownfish reef", "Trout fish", "Tropical fish aquarium"],
  horse: ["Horse portrait", "Brown horse standing", "White horse portrait", "Horse in field"],
  lion: ["Male lion portrait", "Lion sitting", "Lioness portrait", "African lion male"],
  tiger: ["Bengal tiger portrait", "Tiger sitting", "Siberian tiger", "Tiger close-up"],
  rabbit: ["European rabbit", "Domestic rabbit white", "Brown rabbit sitting", "Cottontail rabbit"],
  monkey: ["Rhesus macaque portrait", "Capuchin monkey", "Squirrel monkey", "Langur monkey"],
  parrot: ["Scarlet macaw parrot", "Green parrot", "Parrot bird portrait", "Cockatoo bird"],
  tree: ["Oak tree sunny", "Pine tree forest", "Banyan tree large", "Green leafy tree"],
  sun: ["Sun in sky bright", "Sun flare morning", "Golden sun sky", "Sunset sun orb"],
  moon: ["Full moon high resolution", "Crescent moon night", "Moon surface crater", "Waxing gibbous moon"],
  star: ["Star field night sky", "Pleiades star cluster", "Bright star astronomical", "Star night astronomy"],
  rain: ["Rain drops window", "Rain falling puddle", "Rain shower garden", "Heavy rain street"],
  rainbow: ["Complete rainbow sky", "Double rainbow landscape", "Rainbow green field", "Rainbow horizon"],
  water: ["Clear water splash", "Drinking water glass", "Water ripple wave", "Clean river water"],
  apple: ["Red delicious apple", "Green granny smith apple", "Fresh red apple fruit", "Ripe apples"],
  mango: ["Ripe mango fruit", "Alphonso mango", "Sliced fresh mango", "Yellow mangoes"],
  orange: ["Orange fruit whole", "Sliced orange citrus", "Oranges on tree", "Ripe orange isolated"],
  grapes: ["Purple grapes bunch", "Green grapes cluster", "Fresh wine grapes", "Table grapes ripe"],
  watermelon: ["Watermelon sliced red", "Whole green watermelon", "Watermelon slice fresh", "Sweet watermelon"],
  flower: ["Blooming flower petal", "Sunflower bright", "Daisy white flower", "Tulip red flower"],
  rose: ["Red rose blooming", "Pink rose flower", "Yellow rose close-up", "White rose petal"],
  lotus: ["Nelumbo nucifera lotus", "Pink sacred lotus", "Lotus flower water", "White lotus pond"],
  book: ["Open printed book", "Hardcover book closed", "Stack of library books", "Old open textbook"],
  car: ["Red modern car", "Blue sedan automobile", "Passenger car side", "White automobile vehicle"],
  bus: ["City transit bus", "School bus yellow", "Red double decker bus", "Modern passenger coach"],
  train: ["High speed train track", "Steam locomotive train", "Modern passenger train", "Electric train railway"],
  aeroplane: ["Boeing airplane flight", "Commercial passenger plane", "Airplane in blue sky", "Jet aircraft flying"],
  house: ["Modern family house", "Cottage country house", "Suburban brick house", "Small residential home"],
  ball: ["Soccer football ball", "Basketball leather", "Tennis ball yellow", "Volleyball ball"],
  pencil: ["Wooden graphite pencil", "Sharpened yellow pencil", "Colored pencils group", "Pencil writing paper"],
  watch: ["Wristwatch face luxury", "Classic wrist watch", "Leather strap watch", "Analog wristwatch dial"],
  leaf: ["Green maple leaf", "Fresh tree leaf vein", "Oak leaf green", "Autumn orange leaf"],
  bird: ["Robin bird sitting", "Sparrow bird branch", "Bluebird perching", "Pigeon bird standing"],
  cow: ["Dairy cow Holstein", "Brown dairy cow", "Cow in pasture", "Calf young cow"],
  milk: ["Glass of fresh milk", "Pouring milk splash", "Bottle of dairy milk", "Pitcher with milk"],
  rice: ["Bowl of white rice", "Paddy rice grains", "Cooked jasmine rice", "Uncooked white rice"],
  bread: ["Loaf of crusty bread", "Sliced wheat bread", "Fresh baguette bread", "Artisan bakery bread"],
  heart: ["Human heart model", "Cardiac heart anatomy", "Heart organ diagram", "Medical heart visual"],
  brain: ["Human brain model", "Cerebral brain lobes", "Brain anatomy model", "Neurology brain visual"],
  earth: ["Planet earth from space", "Apollo 17 blue marble", "Earth globe photography", "Earth western hemisphere"],
  river: ["Mountain river flowing", "Wide winding river", "Clean freshwater river", "River valley stream"],
  pot: ["Clay pot water", "Terracotta pottery", "Cooking pot ceramic", "Clay pitcher vessel"],
  tap: ["Water tap running", "Chrome faucet sink", "Outdoor water spigot", "Kitchen faucet flowing"],
  smile: ["Smiling child face", "Happy smiling person", "Smiling boy portrait", "Smiling girl happy"],
  run: ["Runner in sprint", "Running in park athlete", "Child running grass", "Jogger running morning"],
  boy: ["School boy portrait", "Happy boy outdoors", "Young boy smiling", "Boy with backpack"],
  girl: ["School girl portrait", "Happy girl outdoors", "Young girl smiling", "Girl with book"],
  doctor: ["Doctor with stethoscope", "Physician clinic smiling", "Medical doctor consultation", "Pediatrician with patient"],
  teacher: ["Teacher classroom whiteboard", "Teacher educating students", "School teacher smiling", "Teacher holding book"]
};

async function fetchWikiImage(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json`;
    const res = await fetch(url, { headers: { "User-Agent": "DysLearn/1.0 (educational app)" } });
    const data = await res.json();
    const pages = data.query ? Object.values(data.query.pages) : [];
    for (const p of pages) {
      if (p.imageinfo && p.imageinfo[0]) {
        const thumb = p.imageinfo[0].thumburl || p.imageinfo[0].url;
        if (thumb && !thumb.endsWith(".svg") && !thumb.endsWith(".ogg") && !thumb.endsWith(".tif")) {
          return thumb;
        }
      }
    }
  } catch (e) {}
  return null;
}

async function main() {
  const baseDir = "./client/public/learning/images";
  fs.mkdirSync(baseDir, { recursive: true });

  for (const [concept, queries] of Object.entries(CONCEPTS)) {
    const conceptDir = path.join(baseDir, concept);
    fs.mkdirSync(conceptDir, { recursive: true });

    for (let i = 0; i < queries.length; i++) {
      const targetPath = path.join(conceptDir, `${i + 1}.png`);
      if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
        continue;
      }

      const q = queries[i];
      let imgUrl = await fetchWikiImage(q);
      if (!imgUrl) {
        imgUrl = await fetchWikiImage(`${concept} photograph`);
      }

      if (imgUrl) {
        try {
          const res = await fetch(imgUrl, { headers: { "User-Agent": "DysLearn/1.0" } });
          if (res.ok) {
            const buf = Buffer.from(await res.arrayBuffer());
            const tmpFile = `/tmp/dl_${concept}_${i}.tmp`;
            fs.writeFileSync(tmpFile, buf);
            execSync(`convert ${tmpFile} -resize 500x500 ${targetPath}`);
            console.log(`Saved ${concept} ${i + 1}.png (${fs.statSync(targetPath).size} bytes)`);
          }
        } catch (err) {
          console.error(`Error saving ${concept} ${i + 1}:`, err.message);
        }
      } else {
        console.warn(`No image found for ${concept} ${i + 1}`);
      }
    }
  }
  console.log("All concept PNG downloads complete!");
}

main();
