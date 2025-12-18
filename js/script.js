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
        // 1. On prévient l'utilisateur que ça charge
        verseText.textContent = "Téléchargement de la Bible en cours... (Cela peut prendre quelques secondes)";
        verseText.style.opacity = "0.7"; // Petit effet visuel
        
        console.log("Début chargement Bible...");
        const response = await fetch('json/bible_lsg.json');
        
        if (!response.ok) throw new Error("Erreur HTTP: " + response.status);
        
        bibleData = await response.json();
        
        console.log("Bible chargée !");
        
        // 2. C'est fini, on invite à cliquer
        verseText.style.opacity = "1";
        verseText.textContent = "La Bible est prête. Cliquez sur le bouton !";
        btn.disabled = false;
        btn.textContent = "Découvrir un verset"; // Change le texte du bouton
        
        // Optionnel : Lancer un premier verset direct si tu veux
        // getVerse(); 
        
    } catch (error) {
        console.error("Erreur chargement Bible:", error);
        verseText.textContent = "Erreur : La connexion est trop lente pour télécharger la Bible.";
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