const products = [
    {
      "id": "1",
      "name": "Nike",
      "price": "70$",
      "imageSrc": "images/pic2.png",
      "rating": 4.5,
      "isFavorite": false
    },
    {
      "id": "2",
      "name": "Nike",
      "price": "100$",
      "imageSrc": "images/pic3.png",
      "rating": 3.5,
      "isFavorite": true
    },
    {
      "id": "3",
      "name": "Nike",
      "price": "125$",
      "imageSrc": "images/pic4.png",
      "rating": 4,
      "isFavorite": false
    },
    {
      "id": "4",
      "name": "Nike",
      "price": "99.99$",
      "imageSrc": "images/pic5.jpeg",
      "rating": 5,
      "isFavorite": true
    },
    {
      "id": "5",
      "name": "New Balance",
      "price": "120$",
      "imageSrc": "images/Pic7.png",
      "rating": 4,
      "isFavorite": false
    },
    {
      "id": "6",
      "name": "Adidas",
      "price": "70$",
      "imageSrc": "images/pic6.png",
      "rating": 3,
      "isFavorite": false
    },
    {
      "id": "7",
      "name": "Nike",
      "price": "300$",
      "imageSrc": "images/img1.png",
      "rating": 5,
      "isFavorite": true
    },
    {
      "id": "8",
      "name": "New Balance",
      "price": "100$",
      "imageSrc": "images/img8.png",
      "rating": 5,
      "isFavorite": false
    }
  ]

  //נחשוף את הפונקציה הזו החוצה
  //והיא בעצם מחזירה מערך  
  function getAllshoes(){
    return products
  }

  // כדי שיהיה ניתן ךקרוא לפונקציה הזו מקובץ אחר 
  module.exports = {
    getAllshoes
}