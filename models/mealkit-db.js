var mealData = 
[
    {
        title : "Alu Puri",
        includes : "whole wheat and aloo",
        description: "The combination of Aloo and Puri is a must-have for the people who want Indian delicacy to taste. ",
        category :"Vegan Meals",
        price :10.95,
        cookingTime:20,
        servings:1,
        imageUrl:"/img/AluPuri.jpg",
        topMeal:false
    },
    {
        title : "Samosa",
        includes : "whole wheat, peas and potatoes",
        description: "Samosa is a very famous food in India",
        category :"Vegan Meals",
        price :7.25,
        cookingTime:20,
        servings:5,
        imageUrl:"/img/Samosa.jpg",
        topMeal:true
    },
    {
        title : "Vegetable Mixed Briyani",
        includes : "Brown rice, potato and veggies.",
        description: "Biryani is very popular in India but generally,served non veg items.",
        category :"Vegan Meals",
        price :9.85,
        cookingTime:25,
        servings:1,
        imageUrl:"/img/vegetableBriyani.jpg",
        topMeal:false
    },
    {
        title : "Bacon Egg",
        includes : "8 large eggs 9 oz. bacon, in slices",
        description: "2 eggs, Bacon, Salad, Muffin, Cheese, chive, Coconut oil and potatoes", 
        category :"Classic Meals",
        price :11.99,
        cookingTime:25,
        servings:1,
        imageUrl:"/img/baconEgg.jpg",
        topMeal:true
    },
    {
        title : "Biscuit and Gravy",
        includes : "Crunchy Biscuits",
        description: "Gingery pork, crunchy cucumbers, and toasty peanuts",
        category :" Classic Meals",
        price :19.99,
        cookingTime:25,
        servings:2,
        imageUrl:'/img/biscuit.jpg',
        topMeal:false
    },
    {
        title : "Hash Brown",
        includes : "2 medium russet potatoes, shredded, ½ medium onion, finely chopped, ¼ cup flour and 1 egg",
        description: "Perfect with hot pepper sauce and ketchup!",
        category :"Classic Meals",
        price :10.99,
        cookingTime:25,
        servings:2,
        imageUrl:'/img/hashBrown.jpg',
        topMeal:true
    },
    {
        title : "Waffles",
        includes : "Eggs, Flour, Milk, Vanilla and Baking powder",
        description: "Simple pantry ingredients mix up quickly in this easy batter",
        category :" Classic Meals",
        price :7.99,
        cookingTime:25,
        servings:2,
        imageUrl:'/img/waffles.jpg',
        topMeal:true
    },
    {
        title : "French Toast",
        includes : "White Bread, Eggs, Milk, Vanilla and Cinnamon",
        description: "Serve hot with butter or margarine and maple syrup",
        category :" Classic Meals",
        price :8.99,
        cookingTime:25,
        servings:3,
        imageUrl:'/img/french_toast.png' ,
        topMeal:true
    },
    {
        title : "Breakfast Burrito",
        includes : "Tortilla, Eggs, Ham, Cheese and Sausage or mushroom",
        description: "a flour tortilla rolled or folded around a filling",
        category :" Classic Meals",
        price :12.99,
        cookingTime:25,
        servings:2,
        imageUrl:'/img/baconEgg.jpg',
        topMeal:true
    }
];
module.exports.getTopMealkits = function(){
    return mealData;
}
module.exports.getMealkitsByCategory = function(){
    var filtered = [{category:"",
    meal:[]},{category:"",
    meal:[]}];
    for(var i=0; i<mealData.length; i++){
        if(mealData[i].category ==="Vegan Meals"){
            filtered[0].category = mealData[i].category;

            filtered[0].meal.push(mealData[i]);
        }
        else{
            filtered[1].category = mealData[i].category;

            filtered[1].meal.push(mealData[i]);
        }
    }
    return filtered;
}