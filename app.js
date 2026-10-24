'use strict';

/* ===== KONFIGURACJA ===== */

const ROUND_SIZE = 10;
const CURRENT_KEY = 'slowkowo-current'; // id ostatnio wybranego gracza
const DATA_VERSION = 1;

// Punkty przyznawane są za całą rundę – liczą się tylko odpowiedzi
// dobre za pierwszym razem i bez podpowiedzi.
const ROUND_POINTS = [
  { min: 10, pts: 10, label: '10 / 10' },
  { min: 9,  pts: 8,  label: '9 / 10' },
  { min: 8,  pts: 6,  label: '8 / 10' },
  { min: 6,  pts: 4,  label: '6–7 / 10' },
  { min: 4,  pts: 2,  label: '4–5 / 10' },
  { min: 0,  pts: 0,  label: 'mniej niż 4' },
];
const roundPoints = correct => ROUND_POINTS.find(r => correct >= r.min).pts;

/* ===== BANK SŁÓWEK ===== */

// Nazwy kategorii (po polsku).
const CATS = {
  animals: 'zwierzątka', colors: 'kolory', numbers: 'liczby 1–10', numbers2: 'liczby 11–20',
  fruitveg: 'owoce i warzywa', family: 'rodzina', body: 'ciało', toys: 'zabawki',
  food: 'jedzenie', clothes: 'ubrania', weather: 'pogoda', wild: 'dzikie zwierzęta',
  home: 'dom', school: 'szkoła', transport: 'pojazdy', verbs: 'czynności',
};

// Obrazek: emoji, kolor (color) albo liczba (num).
const WORDS = [
  // Zwierzątka (domowe i z wiejskiego podwórka)
  { en: 'cat', pl: 'kot', emoji: '🐱', cat: 'animals' },
  { en: 'dog', pl: 'pies', emoji: '🐶', cat: 'animals' },
  { en: 'cow', pl: 'krowa', emoji: '🐮', cat: 'animals' },
  { en: 'pig', pl: 'świnia', emoji: '🐷', cat: 'animals' },
  { en: 'horse', pl: 'koń', emoji: '🐴', cat: 'animals' },
  { en: 'sheep', pl: 'owca', emoji: '🐑', cat: 'animals' },
  { en: 'duck', pl: 'kaczka', emoji: '🦆', cat: 'animals' },
  { en: 'chicken', pl: 'kura', emoji: '🐔', cat: 'animals' },
  { en: 'mouse', pl: 'mysz', emoji: '🐭', cat: 'animals' },
  { en: 'rabbit', pl: 'królik', emoji: '🐰', cat: 'animals' },
  { en: 'fish', pl: 'ryba', emoji: '🐟', cat: 'animals' },
  { en: 'bird', pl: 'ptak', emoji: '🐦', cat: 'animals' },
  { en: 'frog', pl: 'żaba', emoji: '🐸', cat: 'animals' },
  { en: 'goat', pl: 'koza', emoji: '🐐', cat: 'animals' },
  { en: 'hamster', pl: 'chomik', emoji: '🐹', cat: 'animals' },

  // Kolory
  { en: 'red', pl: 'czerwony', color: '#e74c3c', cat: 'colors' },
  { en: 'blue', pl: 'niebieski', color: '#0984e3', cat: 'colors' },
  { en: 'green', pl: 'zielony', color: '#00b84f', cat: 'colors' },
  { en: 'yellow', pl: 'żółty', color: '#ffd32a', cat: 'colors' },
  { en: 'orange', pl: 'pomarańczowy', color: '#ff8c1a', cat: 'colors' },
  { en: 'purple', pl: 'fioletowy', color: '#8e44ad', cat: 'colors' },
  { en: 'pink', pl: 'różowy', color: '#ff7eb6', cat: 'colors' },
  { en: 'brown', pl: 'brązowy', color: '#8d5524', cat: 'colors' },
  { en: 'black', pl: 'czarny', color: '#1e1e1e', cat: 'colors' },
  { en: 'white', pl: 'biały', color: '#ffffff', cat: 'colors' },
  { en: 'grey', pl: 'szary', color: '#95a5a6', cat: 'colors' },

  // Liczby 1–10
  { en: 'one', pl: 'jeden', num: 1, cat: 'numbers' },
  { en: 'two', pl: 'dwa', num: 2, cat: 'numbers' },
  { en: 'three', pl: 'trzy', num: 3, cat: 'numbers' },
  { en: 'four', pl: 'cztery', num: 4, cat: 'numbers' },
  { en: 'five', pl: 'pięć', num: 5, cat: 'numbers' },
  { en: 'six', pl: 'sześć', num: 6, cat: 'numbers' },
  { en: 'seven', pl: 'siedem', num: 7, cat: 'numbers' },
  { en: 'eight', pl: 'osiem', num: 8, cat: 'numbers' },
  { en: 'nine', pl: 'dziewięć', num: 9, cat: 'numbers' },
  { en: 'ten', pl: 'dziesięć', num: 10, cat: 'numbers' },

  // Liczby 11–20
  { en: 'eleven', pl: 'jedenaście', num: 11, cat: 'numbers2' },
  { en: 'twelve', pl: 'dwanaście', num: 12, cat: 'numbers2' },
  { en: 'thirteen', pl: 'trzynaście', num: 13, cat: 'numbers2' },
  { en: 'fourteen', pl: 'czternaście', num: 14, cat: 'numbers2' },
  { en: 'fifteen', pl: 'piętnaście', num: 15, cat: 'numbers2' },
  { en: 'sixteen', pl: 'szesnaście', num: 16, cat: 'numbers2' },
  { en: 'seventeen', pl: 'siedemnaście', num: 17, cat: 'numbers2' },
  { en: 'eighteen', pl: 'osiemnaście', num: 18, cat: 'numbers2' },
  { en: 'nineteen', pl: 'dziewiętnaście', num: 19, cat: 'numbers2' },
  { en: 'twenty', pl: 'dwadzieścia', num: 20, cat: 'numbers2' },

  // Owoce i warzywa
  { en: 'apple', pl: 'jabłko', emoji: '🍎', cat: 'fruitveg' },
  { en: 'banana', pl: 'banan', emoji: '🍌', cat: 'fruitveg' },
  { en: 'pear', pl: 'gruszka', emoji: '🍐', cat: 'fruitveg' },
  { en: 'lemon', pl: 'cytryna', emoji: '🍋', cat: 'fruitveg' },
  { en: 'grapes', pl: 'winogrona', emoji: '🍇', cat: 'fruitveg' },
  { en: 'strawberry', pl: 'truskawka', emoji: '🍓', cat: 'fruitveg' },
  { en: 'cherry', pl: 'czereśnia', emoji: '🍒', cat: 'fruitveg' },
  { en: 'watermelon', pl: 'arbuz', emoji: '🍉', cat: 'fruitveg' },
  { en: 'pineapple', pl: 'ananas', emoji: '🍍', cat: 'fruitveg' },
  { en: 'peach', pl: 'brzoskwinia', emoji: '🍑', cat: 'fruitveg' },
  { en: 'coconut', pl: 'kokos', emoji: '🥥', cat: 'fruitveg' },
  { en: 'carrot', pl: 'marchewka', emoji: '🥕', cat: 'fruitveg' },
  { en: 'potato', pl: 'ziemniak', emoji: '🥔', cat: 'fruitveg' },
  { en: 'tomato', pl: 'pomidor', emoji: '🍅', cat: 'fruitveg' },
  { en: 'cucumber', pl: 'ogórek', emoji: '🥒', cat: 'fruitveg' },
  { en: 'corn', pl: 'kukurydza', emoji: '🌽', cat: 'fruitveg' },
  { en: 'onion', pl: 'cebula', emoji: '🧅', cat: 'fruitveg' },
  { en: 'mushroom', pl: 'grzyb', emoji: '🍄', cat: 'fruitveg' },
  { en: 'broccoli', pl: 'brokuł', emoji: '🥦', cat: 'fruitveg' },

  // Rodzina
  { en: 'mum', pl: 'mama', emoji: '👩', cat: 'family' },
  { en: 'dad', pl: 'tata', emoji: '👨', cat: 'family' },
  { en: 'baby', pl: 'dzidziuś', emoji: '👶', cat: 'family' },
  { en: 'boy', pl: 'chłopiec', emoji: '👦', cat: 'family' },
  { en: 'girl', pl: 'dziewczynka', emoji: '👧', cat: 'family' },
  { en: 'grandma', pl: 'babcia', emoji: '👵', cat: 'family' },
  { en: 'grandpa', pl: 'dziadek', emoji: '👴', cat: 'family' },
  { en: 'family', pl: 'rodzina', emoji: '👨‍👩‍👧', cat: 'family' },

  // Ciało
  { en: 'eye', pl: 'oko', emoji: '👁️', cat: 'body' },
  { en: 'ear', pl: 'ucho', emoji: '👂', cat: 'body' },
  { en: 'nose', pl: 'nos', emoji: '👃', cat: 'body' },
  { en: 'mouth', pl: 'usta', emoji: '👄', cat: 'body' },
  { en: 'tongue', pl: 'język', emoji: '👅', cat: 'body' },
  { en: 'tooth', pl: 'ząb', emoji: '🦷', cat: 'body' },
  { en: 'hand', pl: 'ręka', emoji: '✋', cat: 'body' },
  { en: 'finger', pl: 'palec', emoji: '☝️', cat: 'body' },
  { en: 'arm', pl: 'ramię', emoji: '💪', cat: 'body' },
  { en: 'leg', pl: 'noga', emoji: '🦵', cat: 'body' },
  { en: 'foot', pl: 'stopa', emoji: '🦶', cat: 'body' },
  { en: 'heart', pl: 'serce', emoji: '❤️', cat: 'body' },
  { en: 'brain', pl: 'mózg', emoji: '🧠', cat: 'body' },
  { en: 'bone', pl: 'kość', emoji: '🦴', cat: 'body' },

  // Zabawki
  { en: 'ball', pl: 'piłka', emoji: '⚽', cat: 'toys' },
  { en: 'teddy', pl: 'miś', emoji: '🧸', cat: 'toys' },
  { en: 'kite', pl: 'latawiec', emoji: '🪁', cat: 'toys' },
  { en: 'robot', pl: 'robot', emoji: '🤖', cat: 'toys' },
  { en: 'doll', pl: 'lalka', emoji: '🪆', cat: 'toys' },
  { en: 'balloon', pl: 'balon', emoji: '🎈', cat: 'toys' },
  { en: 'present', pl: 'prezent', emoji: '🎁', cat: 'toys' },
  { en: 'drum', pl: 'bęben', emoji: '🥁', cat: 'toys' },
  { en: 'guitar', pl: 'gitara', emoji: '🎸', cat: 'toys' },
  { en: 'puzzle', pl: 'puzzle', emoji: '🧩', cat: 'toys' },
  { en: 'dice', pl: 'kostka do gry', emoji: '🎲', cat: 'toys' },

  // Jedzenie
  { en: 'bread', pl: 'chleb', emoji: '🍞', cat: 'food' },
  { en: 'cheese', pl: 'ser', emoji: '🧀', cat: 'food' },
  { en: 'egg', pl: 'jajko', emoji: '🥚', cat: 'food' },
  { en: 'milk', pl: 'mleko', emoji: '🥛', cat: 'food' },
  { en: 'water', pl: 'woda', emoji: '💧', cat: 'food' },
  { en: 'juice', pl: 'sok', emoji: '🧃', cat: 'food' },
  { en: 'tea', pl: 'herbata', emoji: '🍵', cat: 'food' },
  { en: 'cake', pl: 'tort', emoji: '🎂', cat: 'food' },
  { en: 'pizza', pl: 'pizza', emoji: '🍕', cat: 'food' },
  { en: 'soup', pl: 'zupa', emoji: '🍲', cat: 'food' },
  { en: 'sandwich', pl: 'kanapka', emoji: '🥪', cat: 'food' },
  { en: 'chocolate', pl: 'czekolada', emoji: '🍫', cat: 'food' },
  { en: 'butter', pl: 'masło', emoji: '🧈', cat: 'food' },
  { en: 'honey', pl: 'miód', emoji: '🍯', cat: 'food' },
  { en: 'cookie', pl: 'ciastko', emoji: '🍪', cat: 'food' },
  { en: 'rice', pl: 'ryż', emoji: '🍚', cat: 'food' },
  { en: 'sweets', pl: 'cukierki', emoji: '🍬', cat: 'food' },
  { en: 'chips', pl: 'frytki', emoji: '🍟', cat: 'food' },

  // Ubrania
  { en: 'shirt', pl: 'koszulka', emoji: '👕', cat: 'clothes' },
  { en: 'dress', pl: 'sukienka', emoji: '👗', cat: 'clothes' },
  { en: 'hat', pl: 'kapelusz', emoji: '👒', cat: 'clothes' },
  { en: 'cap', pl: 'czapka z daszkiem', emoji: '🧢', cat: 'clothes' },
  { en: 'shoes', pl: 'buty', emoji: '👟', cat: 'clothes' },
  { en: 'boots', pl: 'kozaki', emoji: '👢', cat: 'clothes' },
  { en: 'socks', pl: 'skarpetki', emoji: '🧦', cat: 'clothes' },
  { en: 'coat', pl: 'płaszcz', emoji: '🧥', cat: 'clothes' },
  { en: 'jeans', pl: 'dżinsy', emoji: '👖', cat: 'clothes' },
  { en: 'shorts', pl: 'szorty', emoji: '🩳', cat: 'clothes' },
  { en: 'scarf', pl: 'szalik', emoji: '🧣', cat: 'clothes' },
  { en: 'gloves', pl: 'rękawiczki', emoji: '🧤', cat: 'clothes' },
  { en: 'glasses', pl: 'okulary', emoji: '👓', cat: 'clothes' },

  // Pogoda i niebo
  { en: 'sun', pl: 'słońce', emoji: '☀️', cat: 'weather' },
  { en: 'rain', pl: 'deszcz', emoji: '🌧️', cat: 'weather' },
  { en: 'snow', pl: 'śnieg', emoji: '❄️', cat: 'weather' },
  { en: 'cloud', pl: 'chmura', emoji: '☁️', cat: 'weather' },
  { en: 'wind', pl: 'wiatr', emoji: '🌬️', cat: 'weather' },
  { en: 'rainbow', pl: 'tęcza', emoji: '🌈', cat: 'weather' },
  { en: 'storm', pl: 'burza', emoji: '⛈️', cat: 'weather' },
  { en: 'fog', pl: 'mgła', emoji: '🌫️', cat: 'weather' },
  { en: 'umbrella', pl: 'parasol', emoji: '☂️', cat: 'weather' },
  { en: 'snowman', pl: 'bałwan', emoji: '⛄', cat: 'weather' },
  { en: 'moon', pl: 'księżyc', emoji: '🌙', cat: 'weather' },
  { en: 'star', pl: 'gwiazda', emoji: '⭐', cat: 'weather' },
  { en: 'hot', pl: 'gorąco', emoji: '🥵', cat: 'weather' },
  { en: 'cold', pl: 'zimno', emoji: '🥶', cat: 'weather' },

  // Dzikie zwierzęta
  { en: 'bear', pl: 'niedźwiedź', emoji: '🐻', cat: 'wild' },
  { en: 'lion', pl: 'lew', emoji: '🦁', cat: 'wild' },
  { en: 'tiger', pl: 'tygrys', emoji: '🐯', cat: 'wild' },
  { en: 'monkey', pl: 'małpa', emoji: '🐵', cat: 'wild' },
  { en: 'elephant', pl: 'słoń', emoji: '🐘', cat: 'wild' },
  { en: 'giraffe', pl: 'żyrafa', emoji: '🦒', cat: 'wild' },
  { en: 'zebra', pl: 'zebra', emoji: '🦓', cat: 'wild' },
  { en: 'snake', pl: 'wąż', emoji: '🐍', cat: 'wild' },
  { en: 'crocodile', pl: 'krokodyl', emoji: '🐊', cat: 'wild' },
  { en: 'owl', pl: 'sowa', emoji: '🦉', cat: 'wild' },
  { en: 'fox', pl: 'lis', emoji: '🦊', cat: 'wild' },
  { en: 'wolf', pl: 'wilk', emoji: '🐺', cat: 'wild' },
  { en: 'panda', pl: 'panda', emoji: '🐼', cat: 'wild' },
  { en: 'penguin', pl: 'pingwin', emoji: '🐧', cat: 'wild' },
  { en: 'turtle', pl: 'żółw', emoji: '🐢', cat: 'wild' },
  { en: 'bee', pl: 'pszczoła', emoji: '🐝', cat: 'wild' },
  { en: 'butterfly', pl: 'motyl', emoji: '🦋', cat: 'wild' },
  { en: 'spider', pl: 'pająk', emoji: '🕷️', cat: 'wild' },
  { en: 'snail', pl: 'ślimak', emoji: '🐌', cat: 'wild' },
  { en: 'whale', pl: 'wieloryb', emoji: '🐳', cat: 'wild' },
  { en: 'dolphin', pl: 'delfin', emoji: '🐬', cat: 'wild' },
  { en: 'shark', pl: 'rekin', emoji: '🦈', cat: 'wild' },
  { en: 'octopus', pl: 'ośmiornica', emoji: '🐙', cat: 'wild' },

  // Dom
  { en: 'house', pl: 'dom', emoji: '🏠', cat: 'home' },
  { en: 'door', pl: 'drzwi', emoji: '🚪', cat: 'home' },
  { en: 'window', pl: 'okno', emoji: '🪟', cat: 'home' },
  { en: 'bed', pl: 'łóżko', emoji: '🛏️', cat: 'home' },
  { en: 'chair', pl: 'krzesło', emoji: '🪑', cat: 'home' },
  { en: 'sofa', pl: 'kanapa', emoji: '🛋️', cat: 'home' },
  { en: 'bath', pl: 'wanna', emoji: '🛁', cat: 'home' },
  { en: 'shower', pl: 'prysznic', emoji: '🚿', cat: 'home' },
  { en: 'toilet', pl: 'toaleta', emoji: '🚽', cat: 'home' },
  { en: 'key', pl: 'klucz', emoji: '🔑', cat: 'home' },
  { en: 'clock', pl: 'zegar', emoji: '⏰', cat: 'home' },
  { en: 'phone', pl: 'telefon', emoji: '📱', cat: 'home' },
  { en: 'cup', pl: 'kubek', emoji: '☕', cat: 'home' },
  { en: 'spoon', pl: 'łyżka', emoji: '🥄', cat: 'home' },
  { en: 'knife', pl: 'nóż', emoji: '🔪', cat: 'home' },
  { en: 'plate', pl: 'talerz', emoji: '🍽️', cat: 'home' },
  { en: 'toothbrush', pl: 'szczoteczka do zębów', emoji: '🪥', cat: 'home' },

  // Szkoła
  { en: 'school', pl: 'szkoła', emoji: '🏫', cat: 'school' },
  { en: 'teacher', pl: 'nauczyciel', emoji: '🧑‍🏫', cat: 'school' },
  { en: 'book', pl: 'książka', emoji: '📕', cat: 'school' },
  { en: 'notebook', pl: 'zeszyt', emoji: '📒', cat: 'school' },
  { en: 'pen', pl: 'długopis', emoji: '🖊️', cat: 'school' },
  { en: 'pencil', pl: 'ołówek', emoji: '✏️', cat: 'school' },
  { en: 'crayon', pl: 'kredka', emoji: '🖍️', cat: 'school' },
  { en: 'ruler', pl: 'linijka', emoji: '📏', cat: 'school' },
  { en: 'scissors', pl: 'nożyczki', emoji: '✂️', cat: 'school' },
  { en: 'backpack', pl: 'plecak', emoji: '🎒', cat: 'school' },
  { en: 'paper', pl: 'papier', emoji: '📄', cat: 'school' },
  { en: 'computer', pl: 'komputer', emoji: '💻', cat: 'school' },
  { en: 'map', pl: 'mapa', emoji: '🗺️', cat: 'school' },
  { en: 'globe', pl: 'globus', emoji: '🌍', cat: 'school' },
  { en: 'bell', pl: 'dzwonek', emoji: '🔔', cat: 'school' },

  // Pojazdy
  { en: 'car', pl: 'samochód', emoji: '🚗', cat: 'transport' },
  { en: 'bus', pl: 'autobus', emoji: '🚌', cat: 'transport' },
  { en: 'train', pl: 'pociąg', emoji: '🚂', cat: 'transport' },
  { en: 'plane', pl: 'samolot', emoji: '✈️', cat: 'transport' },
  { en: 'boat', pl: 'łódka', emoji: '⛵', cat: 'transport' },
  { en: 'ship', pl: 'statek', emoji: '🚢', cat: 'transport' },
  { en: 'bike', pl: 'rower', emoji: '🚲', cat: 'transport' },
  { en: 'helicopter', pl: 'helikopter', emoji: '🚁', cat: 'transport' },
  { en: 'rocket', pl: 'rakieta', emoji: '🚀', cat: 'transport' },
  { en: 'taxi', pl: 'taksówka', emoji: '🚕', cat: 'transport' },
  { en: 'tractor', pl: 'traktor', emoji: '🚜', cat: 'transport' },
  { en: 'truck', pl: 'ciężarówka', emoji: '🚚', cat: 'transport' },
  { en: 'scooter', pl: 'hulajnoga', emoji: '🛴', cat: 'transport' },
  { en: 'ambulance', pl: 'karetka', emoji: '🚑', cat: 'transport' },

  // Czynności (głównie ruch)
  { en: 'run', pl: 'biegać', emoji: '🏃', cat: 'verbs' },
  { en: 'walk', pl: 'chodzić', emoji: '🚶', cat: 'verbs' },
  { en: 'jump', pl: 'skakać', emoji: '🦘', cat: 'verbs' },
  { en: 'swim', pl: 'pływać', emoji: '🏊', cat: 'verbs' },
  { en: 'dance', pl: 'tańczyć', emoji: '💃', cat: 'verbs' },
  { en: 'climb', pl: 'wspinać się', emoji: '🧗', cat: 'verbs' },
  { en: 'ride', pl: 'jeździć (na rowerze)', emoji: '🚴', cat: 'verbs' },
  { en: 'ski', pl: 'jeździć na nartach', emoji: '⛷️', cat: 'verbs' },
  { en: 'surf', pl: 'surfować', emoji: '🏄', cat: 'verbs' },
  { en: 'fly', pl: 'latać', emoji: '🕊️', cat: 'verbs' },
  { en: 'sleep', pl: 'spać', emoji: '😴', cat: 'verbs' },
  { en: 'eat', pl: 'jeść', emoji: '😋', cat: 'verbs' },
  { en: 'drink', pl: 'pić', emoji: '🥤', cat: 'verbs' },
  { en: 'read', pl: 'czytać', emoji: '📖', cat: 'verbs' },
  { en: 'write', pl: 'pisać', emoji: '✍️', cat: 'verbs' },
  { en: 'sing', pl: 'śpiewać', emoji: '🎤', cat: 'verbs' },
  { en: 'paint', pl: 'malować', emoji: '🎨', cat: 'verbs' },
  { en: 'cook', pl: 'gotować', emoji: '🧑‍🍳', cat: 'verbs' },
  { en: 'play', pl: 'grać', emoji: '🎮', cat: 'verbs' },
  { en: 'cry', pl: 'płakać', emoji: '😭', cat: 'verbs' },
  { en: 'laugh', pl: 'śmiać się', emoji: '😂', cat: 'verbs' },
  { en: 'clap', pl: 'klaskać', emoji: '👏', cat: 'verbs' },
  { en: 'wave', pl: 'machać', emoji: '👋', cat: 'verbs' },
];

/* ===== TRYBY I POZIOMY ===== */

// Rodzaje zadań:
//  pic        – obrazek → wybór słowa z 4
//  picType    – obrazek → wpisz słowo
//  listen     – lektor → wybór obrazka z 4
//  listenType – lektor → wpisz usłyszane słowo
//  letters    – obrazek + po polsku → ułóż z rozsypanych liter
//  type       – obrazek + po polsku → wpisz z klawiatury
const MODES = {
  pic:        { input: 'choice',  speak: false, bubble: 'Jak to jest po angielsku?' },
  picType:    { input: 'keyboard', speak: false, bubble: 'Napisz po angielsku, co widzisz!' },
  listen:     { input: 'choice',  speak: true,  bubble: 'Posłuchaj i wybierz obrazek!' },
  listenType: { input: 'keyboard', speak: true,  bubble: 'Posłuchaj i napisz to słowo!' },
  letters:    { input: 'letters', speak: true,  bubble: 'Ułóż słowo z literek!' },
  type:       { input: 'keyboard', speak: true,  bubble: 'Napisz to po angielsku!' },
};
const isSpelling = mode => MODES[mode].input !== 'choice';

// Poziomy: cats = kategorie słówek, mix = waga (procent) każdego rodzaju zadania,
// maxLen = najdłuższe słowo do pisania (żeby na początku nie było za trudno).
const CATS_1 = ['animals', 'colors', 'numbers'];
const CATS_2 = [...CATS_1, 'fruitveg', 'family', 'body', 'toys'];
const CATS_3 = [...CATS_2, 'numbers2', 'food', 'clothes', 'weather', 'wild'];
const CATS_4 = [...CATS_3, 'home', 'school', 'transport'];
const CATS_ALL = Object.keys(CATS);
const LEVELS = [
  { need: 0,    name: 'Mały Słuchacz',        desc: 'zwierzątka, kolory, liczby do 10', cats: CATS_1,
    mix: { pic: 50, listen: 50 } },
  { need: 10,   name: 'Ciekawski Lisek',      desc: 'więcej kategorii, układanie z liter', cats: CATS_2, maxLen: 6,
    mix: { pic: 35, listen: 35, letters: 30 } },
  { need: 30,   name: 'Mistrz Literek',       desc: 'pisownia z klawiatury', cats: CATS_3, maxLen: 8,
    mix: { pic: 20, listen: 25, letters: 30, type: 25 } },
  { need: 60,   name: 'Odkrywca Słów',        desc: 'wpisywanie słowa na słuch', cats: CATS_4,
    mix: { pic: 15, listen: 15, letters: 20, type: 25, listenType: 25 } },
  { need: 100,  name: 'Król Słówek',          desc: 'wszystkie kategorie i tryby', cats: CATS_ALL,
    mix: { pic: 10, listen: 10, letters: 15, type: 20, listenType: 25, picType: 20 } },
  { need: 1000, name: 'Legenda Angielskiego', desc: 'wszystkie kategorie i tryby', cats: CATS_ALL,
    mix: { pic: 5, listen: 5, letters: 10, type: 20, listenType: 30, picType: 30 } },
];

/* ===== NAGRODY, ODZNAKI, ZWIERZAKI ===== */

// Prawdziwe nagrody do odebrania u rodzica.
const REWARDS = [
  { id: 'phone',  need: 200,  icon: '📱', name: '30 minut grania na telefonie' },
  { id: 'action', need: 500,  icon: '🛍️', name: '50 zł do wydania w Action' },
  { id: 'trip',   need: 1000, icon: '🎡', name: 'Wspólne wyjście lub wycieczka' },
];

const BADGES = [
  { id: 'first',    icon: '🐣', name: 'Pierwszy krok',  desc: 'Odgadnij pierwsze słówko',     test: s => s.solved >= 1 },
  { id: 'streak5',  icon: '🔥', name: 'Gorąca seria',   desc: '5 dobrych odpowiedzi z rzędu',  test: s => s.best >= 5 },
  { id: 'streak10', icon: '☄️', name: 'Kometa',         desc: '10 dobrych odpowiedzi z rzędu', test: s => s.best >= 10 },
  { id: 'streak20', icon: '🚀', name: 'Rakieta',        desc: '20 dobrych odpowiedzi z rzędu', test: s => s.best >= 20 },
  { id: 'perfect',  icon: '💎', name: 'Diament',        desc: 'Runda bez żadnego błędu',       test: s => s.perfectRounds >= 1 },
  { id: 'rounds5',  icon: '🎯', name: 'Wytrwały',       desc: 'Ukończ 5 rund',                 test: s => s.rounds >= 5 },
  { id: 'solved50', icon: '🧠', name: 'Mądra głowa',    desc: 'Odgadnij 50 słówek',            test: s => s.solved >= 50 },
  { id: 'solved200',icon: '🦉', name: 'Mądra sowa',     desc: 'Odgadnij 200 słówek',           test: s => s.solved >= 200 },
  { id: 'pts50',    icon: '🥉', name: 'Brązowy medal',  desc: 'Zdobądź 50 punktów',            test: s => s.points >= 50 },
  { id: 'pts150',   icon: '🥈', name: 'Srebrny medal',  desc: 'Zdobądź 150 punktów',           test: s => s.points >= 150 },
  { id: 'pts300',   icon: '🥇', name: 'Złoty medal',    desc: 'Zdobądź 300 punktów',           test: s => s.points >= 300 },
  { id: 'king',     icon: '👑', name: 'Król Słówek',    desc: 'Dojdź do poziomu 5: Król Słówek', test: s => getLevelIndex(s.points) >= 4 },
];

// Zwierzaki-awatary: nowy co 10 dobrze rozwiązanych zadań (w tej kolejności).
const ANIMALS_EVERY = 10;
const ANIMALS = [
  { id: 'kapibara',        name: 'Kapibara Kasia' },
  { id: 'kotek',           name: 'Kotek Mruczek' },
  { id: 'piesek',          name: 'Piesek Burek' },
  { id: 'kapibara-relaks', name: 'Kapibara Relaks' },
  { id: 'krolik',          name: 'Królik Puszek' },
  { id: 'kotka',           name: 'Kotka Mgiełka' },
  { id: 'wydra',           name: 'Wydra Wanda' },
  { id: 'chomik',          name: 'Chomik Marchewka' },
  { id: 'pandka',          name: 'Pandka Ruda' },
  { id: 'kot',             name: 'Kot Łapka' },
  { id: 'pingwiny',        name: 'Pingwinki' },
  { id: 'leniwiec',        name: 'Leniwiec Leon' },
  { id: 'panda',           name: 'Panda Zjeżdżalska' },
  { id: 'kozka',           name: 'Kózka Skoczka' },
  { id: 'kapibara-mandarynka', name: 'Kapibara Mandarynka' },
  { id: 'jezyk',           name: 'Jeżyk Kolczyk' },
  { id: 'kotek-psotek',    name: 'Kotek Psotek' },
  { id: 'foczka',          name: 'Foczka Śnieżka' },
  { id: 'corgi',           name: 'Corgi Listek' },
  { id: 'kapibara-prysznic', name: 'Kapibara pod Prysznicem' },
  { id: 'koala',           name: 'Koala Przytulanka' },
  { id: 'kaczuszka',       name: 'Kaczuszka Biegaczka' },
  { id: 'kotki-blizniaki', name: 'Kotki Bliźniaki' },
  { id: 'szynszyle',       name: 'Tańczące Szynszyle' },
  { id: 'slonik',          name: 'Słonik Trąbalski' },
  { id: 'kapibara-kapitan', name: 'Kapibara Kapitan' },
  { id: 'swinka',          name: 'Świnka Morska Fistaszek' },
  { id: 'papuga',          name: 'Papuga Imprezka' },
  { id: 'szczeniak',       name: 'Szczeniak Złotko' },
  { id: 'wiewiorka',       name: 'Wiewiórka Orzeszek' },
  { id: 'piskle',          name: 'Pisklę Okruszek' },
  { id: 'fenki',           name: 'Fenki z Maluszkiem' },
  { id: 'lis',             name: 'Lis Skoczek' },
  { id: 'piesek-na-zolwiu', name: 'Piesek na Żółwiu' },
].map(a => ({ ...a, gif: `gifs/${a.id}.gif` }));
const animalById = id => ANIMALS.find(a => a.id === id);

const PRAISE = ['Super!', 'Brawo!', 'Świetnie!', 'Ekstra!', 'Jesteś mistrzem!', 'Wow!', 'Doskonale!', 'Tak trzymaj!', 'Rewelacja!'];
const ENCOURAGE = ['Prawie! Spróbuj jeszcze raz 🙂', 'Nie poddawaj się!', 'Spokojnie, dasz radę!'];
const MASCOTS = ['🦊', '🐻', '🐼', '🐯', '🐸', '🐵'];

/* ===== STAN ===== */

const newPlayer = name => ({
  name, v: DATA_VERSION, points: 0, best: 0, solved: 0, rounds: 0, perfectRounds: 0,
  badges: [], claimed: [], animals: [], avatar: null, mistakes: {}, createdAt: Date.now(),
});

let state = null; // aktualny gracz (rekord z bazy)
let game = null;  // stan bieżącej rundy

function saveState() {
  if (state) DB.put(state).catch(err => console.warn('Zapis nie powiódł się:', err));
}

function getLevelIndex(points) {
  let idx = 0;
  LEVELS.forEach((lvl, i) => { if (points >= lvl.need) idx = i; });
  return idx;
}

async function rankedPlayers() {
  const players = await DB.all();
  return players.sort((a, b) => b.points - a.points || a.createdAt - b.createdAt);
}

/* ===== POMOCNIKI ===== */

const $ = id => document.getElementById(id);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function pickWeighted(weights) {
  const entries = Object.entries(weights).filter(([, w]) => w > 0);
  let r = Math.random() * entries.reduce((sum, [, w]) => sum + w, 0);
  for (const [key, w] of entries) if ((r -= w) < 0) return key;
  return entries[0][0];
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s).trim().toLowerCase();
const MEDALS = ['🥇', '🥈', '🥉'];
const plural = (n, one, few, many) => n === 1 ? one : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) ? few : many;
const wordByEn = en => WORDS.find(w => w.en === en);

// Obrazek słówka jako HTML: emoji, kółko w kolorze albo kafelek z liczbą.
function picHtml(w) {
  if (w.color) return `<span class="swatch" style="background:${w.color}"></span>`;
  if (w.num) return `<span class="numpic">${w.num}</span>`;
  return esc(w.emoji);
}

function avatarHtml(p, cls = '') {
  const a = p && p.avatar && animalById(p.avatar);
  return a
    ? `<img class="avatar ${cls}" src="${a.gif}" alt="${esc(a.name)}">`
    : `<span class="avatar avatar-emoji ${cls}">🦊</span>`;
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

function bump(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth; // restart animacji
  el.classList.add(cls);
}

// Proste zabezpieczenie: pytanie, na które odpowie rodzic, a nie ośmiolatek.
function parentCheck(what) {
  const a = rand(12, 19), b = rand(6, 9);
  const answer = prompt(`${what}\n\nPytanie dla rodzica: ile to ${a} × ${b}?`);
  if (answer === null) return false;
  if (parseInt(answer, 10) === a * b) return true;
  toast('Zła odpowiedź – poproś rodzica 🙂');
  return false;
}

const modalOpen = () => !!document.querySelector('.modal:not([hidden])');

/* ===== DŹWIĘKI ===== */

let audioCtx;
function beep(freqs, dur = 0.12, type = 'sine') {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const start = audioCtx.currentTime + i * dur;
      osc.type = type;
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + dur);
    });
  } catch { /* dźwięk niedostępny */ }
}
const sound = {
  tap:    () => beep([600], 0.05, 'triangle'),
  good:   () => beep([523, 659, 784], 0.1),
  bad:    () => beep([300, 220], 0.15, 'triangle'),
  fanfare:() => beep([523, 659, 784, 1047, 784, 1047], 0.13),
};

/* ===== LEKTOR (WYMOWA) ===== */

const TTS = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let voice = null;

// Najlepszy dostępny głos: brytyjski, potem amerykański, potem dowolny angielski.
function pickVoice() {
  if (!TTS) return;
  const voices = speechSynthesis.getVoices();
  const en = voices.filter(v => /^en[-_]/i.test(v.lang) || v.lang === 'en');
  voice = en.find(v => /en[-_]GB/i.test(v.lang) && v.localService)
    || en.find(v => /en[-_]GB/i.test(v.lang))
    || en.find(v => /en[-_]US/i.test(v.lang) && v.localService)
    || en.find(v => /en[-_]US/i.test(v.lang))
    || en[0] || null;
}
if (TTS) {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

function say(text, slow = false) {
  if (!TTS) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = voice ? voice.lang : 'en-GB';
  if (voice) u.voice = voice;
  u.rate = slow ? 0.45 : 0.8;
  speechSynthesis.speak(u);
}
const stopSpeech = () => { if (TTS) speechSynthesis.cancel(); };

/* ===== KONFETTI ===== */

function confetti(count = 60) {
  const box = $('confetti');
  const colors = ['#ff7675', '#fdcb6e', '#00b894', '#74b9ff', '#a29bfe', '#fd79a8'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = pick(colors);
    p.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
    p.style.animationDelay = Math.random() * 0.4 + 's';
    box.appendChild(p);
    setTimeout(() => p.remove(), 3500);
  }
}

/* ===== WYBÓR GRACZA ===== */

async function renderPlayers() {
  const players = await rankedPlayers();
  const list = $('player-list');
  if (!players.length) {
    list.innerHTML = '<p class="empty">Jeszcze nikt nie gra. Dodaj pierwszego gracza! 👇</p>';
    return;
  }
  list.innerHTML = players.map((p, i) => `
    <div class="player-item">
      <button class="player-btn" data-id="${p.id}">
        ${avatarHtml(p)}
        <span class="pname">${MEDALS[i] || ''} ${esc(p.name)}</span>
        <span class="ppts">⭐ ${p.points}</span>
      </button>
      <button class="player-del" data-del="${p.id}" aria-label="Usuń gracza ${esc(p.name)}">✕</button>
    </div>`).join('');
}

async function selectPlayer(id) {
  const p = await DB.get(id);
  if (!p) return;
  state = normalizePlayer(p);
  try { localStorage.setItem(CURRENT_KEY, String(id)); } catch { /* trudno */ }
  await renderHome();
  showScreen('home');
}

async function addPlayer(name) {
  name = name.trim().slice(0, 16);
  if (!name) return;
  const players = await DB.all();
  if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    toast('Taki gracz już jest! Wybierz go z listy.');
    return;
  }
  const id = await DB.put(newPlayer(name));
  $('input-name').value = '';
  await selectPlayer(id);
  toast(`Witaj, ${name}! 👋`);
}

async function deletePlayer(id) {
  const p = await DB.get(id);
  if (!p || !parentCheck(`Usunąć gracza „${p.name}” razem z punktami?`)) return;
  await DB.remove(id);
  if (state && state.id === id) {
    state = null;
    try { localStorage.removeItem(CURRENT_KEY); } catch { /* trudno */ }
  }
  renderPlayers();
  toast('Gracz usunięty.');
}

/* ===== EKRAN GŁÓWNY ===== */

async function renderHome() {
  const idx = getLevelIndex(state.points);
  const lvl = LEVELS[idx];
  const next = LEVELS[idx + 1];

  $('home-hello').textContent = `Cześć, ${state.name}!`;
  $('home-avatar').innerHTML = avatarHtml(state);
  const left = ANIMALS_EVERY - (state.solved % ANIMALS_EVERY);
  $('home-animals').textContent = state.animals.length < ANIMALS.length
    ? `🐾 Zwierzaki: ${state.animals.length} / ${ANIMALS.length} · nowy za ${left} ${plural(left, 'zadanie', 'zadania', 'zadań')}`
    : `🐾 Wszystkie zwierzaki zebrane! Co ${ANIMALS_EVERY} zadań – taniec radości!`;
  $('home-points').textContent = state.points;
  $('home-best').textContent = state.best;
  $('home-level-name').textContent = `Poziom ${idx + 1}: ${lvl.name} · ${lvl.desc}`;

  if (next) {
    const pct = ((state.points - lvl.need) / (next.need - lvl.need)) * 100;
    $('home-progress').style.width = Math.min(100, pct) + '%';
    $('home-level-next').textContent = `Jeszcze ${next.need - state.points} pkt do poziomu „${next.name}”`;
  } else {
    $('home-progress').style.width = '100%';
    $('home-level-next').textContent = 'Najwyższy poziom! Jesteś legendą! 🏆';
  }

  renderRewards();
  $('rules-table').innerHTML = ROUND_POINTS.map(r =>
    `<tr><td>${r.label}</td><td>${r.pts ? '+' + r.pts + ' ⭐' : 'brak punktów'}</td></tr>`).join('');

  const players = await rankedPlayers();
  const place = players.findIndex(p => p.id === state.id) + 1;
  $('home-place').textContent = place ? (MEDALS[place - 1] || place) : '–';
}

function renderRewards() {
  $('rewards-list').innerHTML = REWARDS.map(r => {
    const claimed = state.claimed.includes(r.id);
    const unlocked = state.points >= r.need;
    if (claimed) {
      return `<div class="reward claimed">
        <div class="ricon">${r.icon}</div>
        <div class="rbody"><div class="rname">${r.name}</div><div class="rinfo">✅ Odebrana – gratulacje!</div></div>
      </div>`;
    }
    if (unlocked) {
      return `<div class="reward unlocked">
        <div class="ricon">${r.icon}</div>
        <div class="rbody"><div class="rname">${r.name}</div><div class="rinfo">🎉 Zdobyta! Pokaż rodzicowi.</div></div>
        <button class="claim" data-reward="${r.id}">Odebrana</button>
      </div>`;
    }
    const pct = Math.min(100, (state.points / r.need) * 100);
    return `<div class="reward locked">
      <div class="ricon">${r.icon}</div>
      <div class="rbody">
        <div class="rname">${r.name}</div>
        <div class="progress"><div class="progress-bar" style="width:${pct}%"></div></div>
        <div class="rinfo">${state.points} / ${r.need} pkt – brakuje ${r.need - state.points}</div>
      </div>
    </div>`;
  }).join('');
}

function claimReward(id) {
  const r = REWARDS.find(x => x.id === id);
  if (!r || state.points < r.need || state.claimed.includes(id)) return;
  if (!parentCheck(`Potwierdź, że ${state.name} odebrał(a) nagrodę: ${r.name}.`)) return;
  state.claimed.push(id);
  saveState();
  renderRewards();
  toast('Nagroda odebrana! 🎉');
}

/* ===== RANKING ===== */

async function renderRanking() {
  const players = await rankedPlayers();
  const podium = $('podium');
  const list = $('ranking-list');

  if (!players.length) {
    podium.innerHTML = '';
    list.innerHTML = '<p class="empty">Ranking jest pusty. Zagraj pierwszą rundę!</p>';
    return;
  }

  // Podium: 2. miejsce – 1. miejsce – 3. miejsce
  podium.innerHTML = [1, 0, 2].filter(i => players[i]).map(i => {
    const p = players[i];
    return `<div class="podium-col p${i + 1}">
      <div class="pmedal">${MEDALS[i]}</div>
      ${avatarHtml(p)}
      <div class="pname">${esc(p.name)}</div>
      <div class="ppts">⭐ ${p.points}</div>
      <div class="block">${i + 1}</div>
    </div>`;
  }).join('');

  list.innerHTML = players.map((p, i) => {
    const rewards = REWARDS.filter(r => p.points >= r.need).map(r => r.icon).join(' ');
    return `<li class="${state && p.id === state.id ? 'me' : ''}">
      <span class="place">${MEDALS[i] || i + 1}</span>
      ${avatarHtml(p)}
      <div class="who">
        <div class="n">${esc(p.name)}</div>
        <div class="l">${LEVELS[getLevelIndex(p.points)].name} · 🏅 ${(p.badges || []).length} ${rewards ? '· ' + rewards : ''}</div>
      </div>
      <span class="pts">⭐ ${p.points}</span>
    </li>`;
  }).join('');
}

let rankingBack = 'home';
function openRanking(from) {
  rankingBack = from;
  renderRanking();
  showScreen('ranking');
}

/* ===== GRA – RUNDA ===== */

function startRound() {
  // Maskotka rundy: wybrany zwierzak-awatar albo losowe zwierzątko-emoji.
  const mascot = state.avatar ? avatarHtml(state, 'mascot-img') : esc(pick(MASCOTS));
  game = {
    index: 0,
    results: [],          // 'ok' | 'half' | 'bad'
    log: [],              // słówka z rundy do podsumowania
    used: new Set(),      // słówka, które już padły w tej rundzie
    lastWord: null,
    pointsAtStart: state.points,
    levelAtStart: getLevelIndex(state.points),
    badgesAtStart: [...state.badges],
    streak: 0,
    mascot,
  };
  $('mascot').innerHTML = mascot;
  $('game-correct').textContent = 0;
  $('game-round-pts').textContent = 0;
  updateStreak();
  showScreen('game');
  nextTask();
}

// Losuje rodzaj zadania i słówko. Słówka, w których dziecko się myliło, padają częściej.
function makeTask() {
  const lvl = LEVELS[getLevelIndex(state.points)];
  const mix = { ...lvl.mix };
  if (!TTS) { delete mix.listen; delete mix.listenType; } // bez lektora nie ma zadań na słuch
  const mode = pickWeighted(mix);

  const pool = WORDS.filter(w => lvl.cats.includes(w.cat));
  let cands = pool.filter(w => !game.used.has(w.en) && w.en !== game.lastWord);
  if (isSpelling(mode) && lvl.maxLen) {
    const short = cands.filter(w => w.en.length <= lvl.maxLen);
    if (short.length) cands = short;
  }
  if (!cands.length) cands = pool.filter(w => w.en !== game.lastWord);

  const weights = {};
  cands.forEach(w => { weights[w.en] = 1 + 3 * Math.min(state.mistakes[w.en] || 0, 3); });
  const word = wordByEn(pickWeighted(weights));
  game.used.add(word.en);
  game.lastWord = word.en;

  const task = { mode, word };
  if (MODES[mode].input === 'choice') {
    // Dystraktory z tej samej kategorii (awaryjnie z całego poziomu).
    let others = shuffle(WORDS.filter(w => w.cat === word.cat && w.en !== word.en));
    if (others.length < 3) others = others.concat(shuffle(pool.filter(w => w.cat !== word.cat)));
    task.options = shuffle([word, ...others.slice(0, 3)]);
  }
  if (MODES[mode].input === 'letters') {
    const letters = [...word.en];
    let mixed;
    do { mixed = shuffle(letters); } while (letters.length > 1 && mixed.join('') === word.en && new Set(letters).size > 1);
    task.tiles = mixed.map(ch => ({ ch, used: false }));
  }
  return task;
}

function nextTask() {
  if (game.index >= ROUND_SIZE) return endRound();

  game.task = makeTask();
  game.input = '';      // wpisywane słowo (klawiatura)
  game.picked = [];     // indeksy wybranych literek (układanie)
  game.fixed = 0;       // ile literek odsłoniła podpowiedź
  game.tries = 0;
  game.usedHint = false;
  game.missed = false;
  game.locked = false;

  const { mode, word } = game.task;
  const cfg = MODES[mode];
  const listenOnly = mode === 'listen' || mode === 'listenType';

  $('task').classList.remove('correct', 'wrong');
  $('task-pic').innerHTML = listenOnly ? '🎧' : picHtml(word);
  $('task-pl').hidden = !(mode === 'letters' || mode === 'type');
  $('task-pl').textContent = word.pl;
  $('audio-row').hidden = !cfg.speak || !TTS;
  $('task-pattern').hidden = true;
  $('task-reveal').hidden = true;
  $('task-slots').hidden = cfg.input !== 'letters';
  $('task-typed').hidden = cfg.input !== 'keyboard';
  $('options').hidden = cfg.input !== 'choice';
  $('letters').hidden = cfg.input !== 'letters';
  $('qwerty').hidden = cfg.input !== 'keyboard';
  $('btn-say').classList.toggle('big', listenOnly);
  $('btn-hint').disabled = false;
  $('bubble').textContent = cfg.bubble;

  if (cfg.input === 'choice') renderOptions();
  if (cfg.input === 'letters') renderLetters();
  if (cfg.input === 'keyboard') renderTyped();
  renderDots();

  if (cfg.speak) say(word.en);
}

function renderDots() {
  const box = $('round-dots');
  box.innerHTML = '';
  for (let i = 0; i < ROUND_SIZE; i++) {
    const d = document.createElement('span');
    if (game.results[i]) d.className = game.results[i];
    else if (i === game.index) d.className = 'current';
    box.appendChild(d);
  }
}

function updateCorrect() {
  const correct = game.results.filter(r => r === 'ok').length;
  const el = $('game-correct');
  el.textContent = correct;
  bump(el.parentElement, 'pop');
  $('game-round-pts').textContent = roundPoints(correct);
}

function updateStreak() {
  $('game-streak').textContent = game.streak;
  $('streak-pill').classList.toggle('hot', game.streak >= 3);
}

/* ===== GRA – WYBÓR Z 4 ===== */

function renderOptions() {
  const { mode, options } = game.task;
  const pics = mode === 'listen';
  $('options').innerHTML = options.map((w, i) =>
    `<button class="option ${pics ? 'pic' : ''}" data-opt="${i}" aria-label="${pics ? 'Obrazek ' + (i + 1) : esc(w.en)}">${pics ? picHtml(w) : esc(w.en)}</button>`
  ).join('');
}

function chooseOption(i) {
  if (!game || game.locked) return;
  const btn = $('options').querySelector(`[data-opt="${i}"]`);
  if (!btn || btn.disabled || btn.classList.contains('gone')) return;
  const w = game.task.options[i];
  if (w.en === game.task.word.en) {
    btn.classList.add('right');
  } else {
    btn.classList.add('wrong');
    btn.disabled = true;
  }
  checkAnswer(w.en);
}

/* ===== GRA – UKŁADANIE Z LITER ===== */

function renderLetters() {
  const { tiles, word } = game.task;
  $('letters').innerHTML = tiles.map((t, i) =>
    `<button class="letter ${t.used ? 'used' : ''}" data-tile="${i}">${esc(t.ch)}</button>`
  ).join('') + '<button class="letter del" data-tile="del" aria-label="Usuń literkę">⌫</button>';
  $('task-slots').innerHTML = [...word.en].map((_, i) => {
    const idx = game.picked[i];
    const ch = idx === undefined ? '' : tiles[idx].ch;
    return `<span class="slot ${i < game.fixed ? 'fixed' : ''}">${esc(ch)}</span>`;
  }).join('');
}

function pickTile(i) {
  if (!game || game.locked) return;
  const { tiles, word } = game.task;
  if (i === 'del') {
    if (game.picked.length > game.fixed) {
      tiles[game.picked.pop()].used = false;
      sound.tap();
    }
  } else {
    const t = tiles[i];
    if (!t || t.used) return;
    t.used = true;
    game.picked.push(i);
    sound.tap();
  }
  $('task').classList.remove('wrong');
  renderLetters();
  if (game.picked.length === word.en.length) {
    checkAnswer(game.picked.map(idx => tiles[idx].ch).join(''));
  }
}

// Literka z klawiatury fizycznej – bierze pierwszy wolny kafelek z tą literą.
function pickTileByLetter(ch) {
  const i = game.task.tiles.findIndex(t => !t.used && t.ch === ch);
  if (i >= 0) pickTile(i);
}

// Cofa ułożone literki (poza odsłoniętymi przez podpowiedź).
function resetTiles() {
  const { tiles } = game.task;
  while (game.picked.length > game.fixed) tiles[game.picked.pop()].used = false;
  renderLetters();
}

/* ===== GRA – KLAWIATURA ===== */

const QWERTY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

function buildQwerty() {
  $('qwerty').innerHTML = QWERTY_ROWS.map((row, r) => {
    let keys = [...row].map(ch => `<button class="qkey" data-q="${ch}">${ch}</button>`).join('');
    if (r === 2) {
      keys = `<button class="qkey wide del" data-q="del" aria-label="Usuń">⌫</button>${keys}` +
             `<button class="qkey wide ok" data-q="ok" aria-label="Sprawdź">✔</button>`;
    }
    return `<div class="qrow">${keys}</div>`;
  }).join('');
}

function renderTyped() {
  $('task-typed').textContent = game.input;
}

function typeKey(key) {
  if (!game || game.locked) return;
  if (key === 'ok') {
    if (game.input.trim()) checkAnswer(game.input);
    return;
  }
  if (key === 'del') game.input = game.input.slice(0, -1);
  else if (game.input.length < 16) game.input += key;
  else return;
  sound.tap();
  $('task').classList.remove('wrong');
  renderTyped();
}

/* ===== GRA – SPRAWDZANIE ===== */

function checkAnswer(value) {
  const { word } = game.task;
  const mascotEl = $('mascot');
  game.tries++;

  if (norm(value) === norm(word.en)) {
    // DOBRZE – do punktów liczy się tylko odpowiedź za pierwszym razem i bez podpowiedzi
    const clean = game.tries === 1 && !game.usedHint;
    if (clean) {
      game.streak++;
      game.results[game.index] = 'ok';
      // Słówko opanowane – rzadziej będzie wracać.
      if (state.mistakes[word.en]) {
        if (--state.mistakes[word.en] <= 0) delete state.mistakes[word.en];
      }
    } else {
      game.streak = 0;
      game.results[game.index] = 'half';
    }
    game.log.push({ en: word.en, ok: true });
    state.solved++;
    state.best = Math.max(state.best, game.streak);
    saveState();

    $('task').classList.add('correct');
    showReveal(true);
    say(word.en);
    bump(mascotEl, 'happy');
    updateCorrect();
    updateStreak();

    let msg = clean ? `${pick(PRAISE)} ✅` : 'Dobrze! Ale to się nie liczy do punktów – następne za pierwszym razem!';
    if (game.streak >= 3) msg += ` Seria ${game.streak}! 🔥`;
    $('bubble').textContent = msg;
    sound.good();
    if (game.streak > 0 && game.streak % 5 === 0) confetti(40);

    checkBadges(true);
    if (state.solved % ANIMALS_EVERY === 0) {
      // Zwierzak zapisany od razu – nawet jeśli runda zostanie przerwana przed pokazaniem okna.
      const unlocked = unlockAnimal();
      game.locked = true;
      $('btn-hint').disabled = true;
      const current = game;
      setTimeout(() => {
        if (game !== current) return; // runda przerwana
        showAnimalModal(unlocked, () => advance(300));
      }, 900);
    } else {
      advance(clean ? 1500 : 2200);
    }
  } else {
    // ŹLE
    game.streak = 0;
    updateStreak();
    if (!game.missed) {
      game.missed = true;
      state.mistakes[word.en] = (state.mistakes[word.en] || 0) + 1;
      saveState();
    }
    const taskEl = $('task');
    taskEl.classList.remove('wrong');
    void taskEl.offsetWidth;
    taskEl.classList.add('wrong');
    bump(mascotEl, 'sad');
    sound.bad();

    if (game.tries >= 2) {
      // Druga pomyłka – pokazujemy poprawną odpowiedź i idziemy dalej.
      game.results[game.index] = 'bad';
      game.log.push({ en: word.en, ok: false });
      showCorrectAnswer();
      showReveal(false);
      $('bubble').textContent = `To było „${word.en}”. Następnym razem się uda! 💪`;
      game.locked = true;
      const current = game;
      setTimeout(() => { if (game === current) say(word.en); }, 400);
      advance(3000);
    } else {
      $('bubble').textContent = pick(ENCOURAGE);
      const current = game;
      game.locked = true;
      setTimeout(() => {
        if (game !== current) return; // runda przerwana
        game.locked = false;
        if (MODES[game.task.mode].input === 'letters') resetTiles();
        if (MODES[game.task.mode].input === 'keyboard') { game.input = ''; renderTyped(); }
      }, 600);
    }
  }
}

// Po zadaniu: pokaż słowo po angielsku i polsku.
function showReveal(ok) {
  const { word } = game.task;
  const listenOnly = game.task.mode === 'listen' || game.task.mode === 'listenType';
  if (listenOnly) $('task-pic').innerHTML = picHtml(word);
  const el = $('task-reveal');
  el.className = 'reveal' + (ok ? '' : ' bad');
  el.innerHTML = `<strong>${esc(word.en)}</strong> = ${esc(word.pl)}`;
  el.hidden = false;
  $('task-pattern').hidden = true;
}

// Zaznacz poprawną odpowiedź w zadaniu (po drugiej pomyłce).
function showCorrectAnswer() {
  const { word, mode } = game.task;
  const input = MODES[mode].input;
  if (input === 'choice') {
    const i = game.task.options.findIndex(w => w.en === word.en);
    $('options').querySelector(`[data-opt="${i}"]`).classList.add('right');
  } else if (input === 'letters') {
    $('task-slots').innerHTML = [...word.en].map(ch => `<span class="slot">${esc(ch)}</span>`).join('');
  } else {
    game.input = word.en;
    renderTyped();
  }
}

function advance(delay) {
  game.locked = true;
  $('btn-hint').disabled = true;
  const current = game;
  setTimeout(() => {
    if (!game || game !== current) return; // runda przerwana (powrót do menu)
    game.index++;
    nextTask();
  }, delay);
}

/* ===== GRA – PODPOWIEDŹ ===== */

function useHint() {
  if (!game || game.locked || game.usedHint) return;
  game.usedHint = true;
  game.streak = 0;
  updateStreak();
  $('btn-hint').disabled = true;
  const { word, mode } = game.task;
  const input = MODES[mode].input;

  if (input === 'choice') {
    // Usuń 2 błędne odpowiedzi.
    const wrong = [...$('options').querySelectorAll('.option')]
      .filter(b => game.task.options[b.dataset.opt].en !== word.en && !b.disabled);
    shuffle(wrong).slice(0, 2).forEach(b => b.classList.add('gone'));
    $('bubble').textContent = 'Zostały tylko 2 możliwości – wybierz dobrze!';
  } else if (input === 'letters') {
    // Odsłoń pierwszą literkę na stałe.
    const { tiles } = game.task;
    while (game.picked.length) tiles[game.picked.pop()].used = false;
    const first = tiles.findIndex(t => t.ch === word.en[0]);
    tiles[first].used = true;
    game.picked.push(first);
    game.fixed = 1;
    renderLetters();
    $('bubble').textContent = `Słowo zaczyna się na „${word.en[0]}”!`;
  } else {
    // Pokaż pierwszą literę i liczbę liter: c _ _
    const pattern = word.en[0] + ' ' + Array(word.en.length - 1).fill('_').join(' ');
    $('task-pattern').textContent = pattern;
    $('task-pattern').hidden = false;
    $('bubble').textContent = `${word.en.length} ${plural(word.en.length, 'literka', 'literki', 'literek')}, pierwsza to „${word.en[0]}”!`;
  }
}

/* ===== OKNO NAGRODY ===== */

let rewardModalDone = null;
function showRewardModal(reward, onClose) {
  $('reward-modal-icon').textContent = reward.icon;
  $('reward-modal-name').textContent = reward.name;
  $('reward-modal').hidden = false;
  rewardModalDone = onClose;
  sound.fanfare();
  confetti(120);
}
$('reward-modal-ok').addEventListener('click', () => {
  $('reward-modal').hidden = true;
  const done = rewardModalDone;
  rewardModalDone = null;
  if (done) done();
});

/* ===== ZWIERZAKI ===== */

// Odblokuj następnego zwierzaka; gdy wszystkie zebrane – wylosuj jednego do "tańca radości".
function unlockAnimal() {
  const next = ANIMALS.find(a => !state.animals.includes(a.id));
  if (!next) return { animal: animalById(pick(state.animals)), isNew: false };
  state.animals.push(next.id);
  if (!state.avatar) state.avatar = next.id; // pierwszy zwierzak od razu zostaje awatarem
  saveState();
  return { animal: next, isNew: true };
}

let animalModalDone = null;
let animalModalId = null;
function showAnimalModal({ animal, isNew }, onClose) {
  animalModalId = animal.id;
  animalModalDone = onClose;
  $('animal-modal-gif').src = animal.gif;
  $('animal-modal-gif').alt = animal.name;
  $('animal-modal-title').textContent = isNew ? 'Nowy przyjaciel! 🎉' : 'Taniec radości! 🎉';
  $('animal-modal-name').textContent = animal.name;
  $('animal-modal-sub').textContent = isNew
    ? `Za ${state.solved} dobrze rozwiązanych zadań! (${state.animals.length} / ${ANIMALS.length})`
    : `Kolejne ${ANIMALS_EVERY} zadań rozwiązanych – brawo!`;
  $('animal-modal-avatar').hidden = state.avatar === animal.id;
  $('animal-modal').hidden = false;
  sound.fanfare();
  confetti(80);
}

function closeAnimalModal() {
  $('animal-modal').hidden = true;
  const done = animalModalDone;
  animalModalDone = null;
  if (done) done();
}

$('animal-modal-ok').addEventListener('click', closeAnimalModal);
$('animal-modal-avatar').addEventListener('click', () => {
  setAvatar(animalModalId);
  closeAnimalModal();
});

function setAvatar(id) {
  if (!state.animals.includes(id)) return;
  state.avatar = id;
  saveState();
  if (game) $('mascot').innerHTML = game.mascot = avatarHtml(state, 'mascot-img');
  toast(`${animalById(id).name} jest teraz Twoim awatarem!`);
}

function renderAnimals() {
  $('animals-grid').innerHTML = ANIMALS.map((a, i) => {
    if (state.animals.includes(a.id)) {
      return `<button class="animal ${state.avatar === a.id ? 'chosen' : ''}" data-animal="${a.id}">
        <img src="${a.gif}" alt="${esc(a.name)}" loading="lazy">
        <span class="name">${esc(a.name)}</span>
        <span class="desc">${state.avatar === a.id ? '⭐ Twój awatar' : 'Dotknij, aby wybrać'}</span>
      </button>`;
    }
    return `<div class="animal locked">
      <div class="mystery">❓</div>
      <span class="name">???</span>
      <span class="desc">po ${(i + 1) * ANIMALS_EVERY} zadaniach</span>
    </div>`;
  }).join('');
}

/* ===== KONIEC RUNDY ===== */

function endRound() {
  const correct = game.results.filter(r => r === 'ok').length;
  const gained = roundPoints(correct);

  state.points += gained;
  state.rounds++;
  if (correct === ROUND_SIZE) state.perfectRounds++;
  saveState();
  checkBadges(false);

  const stars = correct >= 9 ? 3 : correct >= 6 ? 2 : 1;
  $('summary-stars').innerHTML = [1, 2, 3]
    .map(n => `<span class="${n <= stars ? '' : 'off'}">⭐</span>`).join('');
  $('summary-title').textContent = stars === 3 ? 'Fantastycznie!' : stars === 2 ? 'Bardzo dobrze!' : 'Dobra robota!';
  $('summary-mascot').innerHTML = game.mascot;
  $('summary-correct').textContent = correct;
  $('summary-points').textContent = `+${gained} (razem ${state.points})`;

  // Ile brakuje do najbliższej nagrody
  const nextReward = REWARDS.find(r => state.points < r.need);
  $('summary-next-reward').textContent = nextReward
    ? `Do nagrody ${nextReward.icon} brakuje jeszcze ${nextReward.need - state.points} pkt!`
    : 'Masz już wszystkie nagrody! 🏆';

  // Nagrody odblokowane w tej rundzie
  const newRewards = REWARDS.filter(r => game.pointsAtStart < r.need && state.points >= r.need);
  $('summary-rewards').innerHTML = newRewards.map(r =>
    `<div class="reward-unlocked-box">🎁 Nagroda: ${r.icon} ${r.name}!<br>Pokaż to rodzicowi!</div>`).join('');

  // Nowe odznaki zdobyte w tej rundzie
  const newBadges = state.badges.filter(id => !game.badgesAtStart.includes(id));
  $('summary-badges').innerHTML = newBadges.map(id => {
    const b = BADGES.find(x => x.id === id);
    return `<div class="badge-new">Nowa odznaka: ${b.icon} ${b.name}</div>`;
  }).join('');

  const newLevel = getLevelIndex(state.points);
  const lu = $('summary-levelup');
  if (newLevel > game.levelAtStart) {
    lu.hidden = false;
    lu.textContent = `🎉 Nowy poziom: ${LEVELS[newLevel].name}! Teraz: ${LEVELS[newLevel].desc}!`;
  } else {
    lu.hidden = true;
  }

  // Słówka z rundy (z możliwością odsłuchania)
  $('summary-words').innerHTML = game.log.map(({ en, ok }) => {
    const w = wordByEn(en);
    return `<li>
      <span class="wpic">${picHtml(w)}</span>
      <div class="wtxt"><div class="wen">${esc(w.en)}</div><div class="wpl">${esc(w.pl)}</div></div>
      <span>${ok ? '✅' : '❌'}</span>
      ${TTS ? `<button class="wsay" data-say="${esc(w.en)}" aria-label="Posłuchaj: ${esc(w.en)}">🔊</button>` : ''}
    </li>`;
  }).join('');

  showScreen('summary');
  if (newRewards.length) {
    showRewardModal(newRewards[newRewards.length - 1], null);
  } else if (stars === 3 || newLevel > game.levelAtStart || newBadges.length) {
    sound.fanfare();
    confetti(100);
  } else {
    sound.good();
  }
  game = null;
}

/* ===== ODZNAKI ===== */

function checkBadges(notify) {
  let changed = false;
  BADGES.forEach(b => {
    if (!state.badges.includes(b.id) && b.test(state)) {
      state.badges.push(b.id);
      changed = true;
      if (notify) {
        toast(`Nowa odznaka: ${b.icon} ${b.name}!`);
        confetti(50);
      }
    }
  });
  if (changed) saveState();
}

function renderBadges() {
  $('badges-grid').innerHTML = BADGES.map(b => {
    const has = state.badges.includes(b.id);
    return `<div class="badge ${has ? '' : 'locked'}">
      <div class="icon">${b.icon}</div>
      <div class="name">${b.name}</div>
      <div class="desc">${b.desc}</div>
    </div>`;
  }).join('');
}

/* ===== ZDARZENIA ===== */

const goHome = () => { renderHome(); showScreen('home'); };

$('btn-start').addEventListener('click', startRound);
$('btn-again').addEventListener('click', startRound);
$('btn-hint').addEventListener('click', useHint);
$('btn-home').addEventListener('click', () => { game = null; stopSpeech(); goHome(); });
$('btn-summary-home').addEventListener('click', goHome);
$('btn-badges').addEventListener('click', () => { renderBadges(); showScreen('badges'); });
$('btn-badges-back').addEventListener('click', goHome);
$('btn-ranking').addEventListener('click', () => openRanking('home'));
$('btn-ranking-players').addEventListener('click', () => openRanking('players'));
$('btn-ranking-back').addEventListener('click', () => {
  if (rankingBack === 'home' && state) goHome();
  else { renderPlayers(); showScreen('players'); }
});
$('btn-animals').addEventListener('click', () => { renderAnimals(); showScreen('animals'); });
$('btn-animals-back').addEventListener('click', goHome);
$('home-avatar').addEventListener('click', () => { renderAnimals(); showScreen('animals'); });
$('animals-grid').addEventListener('click', e => {
  const btn = e.target.closest('[data-animal]');
  if (btn) { setAvatar(btn.dataset.animal); renderAnimals(); }
});
$('btn-switch').addEventListener('click', () => { renderPlayers(); showScreen('players'); });

$('btn-reset').addEventListener('click', () => {
  if (parentCheck(`Wyzerować wszystkie punkty, odznaki, nagrody i zwierzaki gracza ${state.name}?`)) {
    state = Object.assign(newPlayer(state.name), { id: state.id, createdAt: state.createdAt });
    saveState();
    renderBadges();
    toast('Zaczynamy od nowa!');
  }
});

$('form-add').addEventListener('submit', e => {
  e.preventDefault();
  addPlayer($('input-name').value);
});

$('player-list').addEventListener('click', e => {
  const del = e.target.closest('[data-del]');
  if (del) return deletePlayer(Number(del.dataset.del));
  const btn = e.target.closest('[data-id]');
  if (btn) selectPlayer(Number(btn.dataset.id));
});

$('rewards-list').addEventListener('click', e => {
  const btn = e.target.closest('[data-reward]');
  if (btn) claimReward(btn.dataset.reward);
});

$('btn-say').addEventListener('click', () => { if (game) say(game.task.word.en); });
$('btn-say-slow').addEventListener('click', () => { if (game) say(game.task.word.en, true); });

$('options').addEventListener('click', e => {
  const btn = e.target.closest('[data-opt]');
  if (btn) chooseOption(Number(btn.dataset.opt));
});

$('letters').addEventListener('click', e => {
  const btn = e.target.closest('[data-tile]');
  if (btn) pickTile(btn.dataset.tile === 'del' ? 'del' : Number(btn.dataset.tile));
});

$('qwerty').addEventListener('click', e => {
  const btn = e.target.closest('[data-q]');
  if (btn) typeKey(btn.dataset.q);
});

$('summary-words').addEventListener('click', e => {
  const btn = e.target.closest('[data-say]');
  if (btn) say(btn.dataset.say);
});

// Klawiatura fizyczna: litery, Backspace, Enter, 1–4 przy wyborze, spacja = posłuchaj.
document.addEventListener('keydown', e => {
  if (!game || !$('screen-game').classList.contains('active') || modalOpen()) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const input = MODES[game.task.mode].input;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

  if (key === ' ') {
    e.preventDefault();
    if (MODES[game.task.mode].speak) say(game.task.word.en);
    return;
  }
  if (input === 'choice') {
    if (/^[1-4]$/.test(key)) chooseOption(Number(key) - 1);
  } else if (input === 'letters') {
    if (/^[a-z]$/.test(key)) pickTileByLetter(key);
    else if (key === 'Backspace') { e.preventDefault(); pickTile('del'); }
  } else {
    if (/^[a-z]$/.test(key)) typeKey(key);
    else if (key === 'Backspace') { e.preventDefault(); typeKey('del'); }
    else if (key === 'Enter') { e.preventDefault(); typeKey('ok'); }
  }
});

/* ===== PWA ===== */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW:', err));
  });
}

/* ===== START ===== */

// Uzupełnia brakujące pola w rekordzie gracza (np. po aktualizacji gry).
function normalizePlayer(p) {
  const base = newPlayer(p.name);
  for (const key of Object.keys(base)) {
    if (p[key] === undefined || (p[key] === null && key !== 'avatar')) p[key] = base[key];
  }
  return p;
}

(async function init() {
  buildQwerty();
  let lastId = null;
  try { lastId = Number(localStorage.getItem(CURRENT_KEY)) || null; } catch { /* trudno */ }
  const last = lastId ? await DB.get(lastId) : null;
  if (last) {
    state = normalizePlayer(last);
    await renderHome();
    showScreen('home');
  } else {
    await renderPlayers();
    showScreen('players');
  }
})().catch(err => {
  console.error(err);
  alert('Nie udało się otworzyć bazy danych w tej przeglądarce. Wyłącz tryb prywatny i spróbuj ponownie.');
});
