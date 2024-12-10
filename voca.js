const VocaKeys = [
  { word: "merhaba", res: "Merhaba , nasılsınız ? " },
  { word: "selam", res: "Selamm, nasılsın ?" },
  { word: "nasilsin", res: "İyiyim sen nasılsın ?" },
  { word: "saat", res: "gettime" },
  { word: "zaman", res: "gettime" },
  {
    word: "yardım",
    res: "Hemen yardım edeyim. Sorununuzu yalın bir şekilde açıklarmısınz.Örneğin saat kaç ?",
  },
];

function voca(word) {
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].word === word) {

      console.log(obj[i].res);
    }
  }
}
