const products = [
  {
    "id": "1",
    "name": "Nike",
    "price": "70$",
    "imageSrc": "images/pic2.png",
    "rating": 4.5,
  },
  {
    "id": "2",
    "name": "Nike",
    "price": "100$",
    "imageSrc": "images/pic3.png",
    "rating": 3.5,
  },
  {
    "id": "3",
    "name": "Nike",
    "price": "125$",
    "imageSrc": "images/pic4.png",
    "rating": 4,

  },
  {
    "id": "4",
    "name": "Nike",
    "price": "99.99$",
    "imageSrc": "images/pic5.jpeg",
    "rating": 5,

  },
  {
    "id": "5",
    "name": "New Balance",
    "price": "120$",
    "imageSrc": "images/Pic7.png",
    "rating": 4,
  
  },
  {
    "id": "6",
    "name": "Adidas",
    "price": "70$",
    "imageSrc": "images/pic6.png",
    "rating": 3,
    
  },
  {
    "id": "7",
    "name": "Nike",
    "price": "300$",
    "imageSrc": "images/img1.png",
    "rating": 5,

  },
  {
    "id": "8",
    "name": "New Balance",
    "price": "100$",
    "imageSrc": "images/img8.png",
    "rating": 5,
  
  }
  ]

  //נחשוף את הפונקציה הזו החוצה
  //והיא בעצם מחזירה מערך  
  function getAllshoes(){
    return products
  }
  

  function getOneshoe(id){
    return products.filter(product => product.id == id)[0];
  }

  function deleteShoe(id){
    const indexTodelete = products.findIndex(product => product.id == id);
    products.splice(indexTodelete,1)
  }
  

  // כדי שיהיה ניתן ךקרוא לפונקציה הזו מקובץ אחר 
  module.exports = {
    getAllshoes,getOneshoe,deleteShoe
  }