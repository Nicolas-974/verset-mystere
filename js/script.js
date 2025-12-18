const btn = document.getElementById('generate-btn');
const verseText = document.getElementById('verse-content');
const verseRef = document.getElementById('verse-reference');

// Configuration
const TOTAL_IMAGES = 15; 
const IMAGE_PATH = 'images/'; // Chemin relatif depuis index.html

let bibleData = null;

// Chargement initial
async function loadBible() {
    try {
        console.log("Début chargement Bible...");
        const response = await fetch('json/bible_lsg.json');
        if (!response.ok) throw new Error("Erreur HTTP: " + response.status);
        bibleData = await response.json();
        console.log("Bible chargée !");
        btn.disabled = false;
        getVerse();
    } catch (error) {
        console.error("Erreur chargement Bible:", error);
        verseText.textContent = "Erreur de chargement de la Bible.";
    }
}

loadBible();

btn.addEventListener('click', getVerse);

function getVerse() {
    if (!bibleData) {
        console.warn("Données bibliques non prêtes.");
        return;
    }

    // --- 1. Logique Verset ---
    let allBooks = [];
    bibleData.Testaments.forEach(t => t.Books.forEach(b => allBooks.push(b)));

    const randomBook = allBooks[Math.floor(Math.random() * allBooks.length)];
    const randomChapter = randomBook.Chapters[Math.floor(Math.random() * randomBook.Chapters.length)];
    const randomVerse = randomChapter.Verses[Math.floor(Math.random() * randomChapter.Verses.length)];

    const text = randomVerse.Text;
    const ref = `${randomBook.Name || randomBook.Text} ${randomChapter.ID}:${randomVerse.ID}`;

    // --- 2. Changement d'image (DEBUG) ---
    const randomImgNum = Math.floor(Math.random() * TOTAL_IMAGES) + 1;
    
    // Formatage : ajoute un 0 devant (ex: 1 -> "01")
    const formattedNum = randomImgNum.toString().padStart(2, '0');
    
    // Construction de l'URL
    const imageUrl = `${IMAGE_PATH}bg${formattedNum}.png`;
    
    console.log(`[DEBUG] Numéro tiré : ${randomImgNum}`);
    console.log(`[DEBUG] Nom formaté : ${formattedNum}`);
    console.log(`[DEBUG] URL tentée : ${imageUrl}`);

    // Création de l'objet Image pour tester le chargement
    const img = new Image();
    
    img.onload = () => {
        console.log(`[SUCCÈS] Image chargée : ${imageUrl}`);
        document.body.style.backgroundImage = `url('${imageUrl}')`;
    };
    
    img.onerror = (e) => {
        console.error(`[ERREUR] Impossible de charger l'image : ${imageUrl}`);
        console.error("Vérifiez que le dossier 'images' est bien au même niveau que 'index.html'");
    };

    img.src = imageUrl;

    // --- 3. Affichage du texte ---
    verseText.textContent = `"${text}"`;
    verseRef.textContent = ref;
}