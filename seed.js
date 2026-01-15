const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

mongoose.connect('mongodb://localhost:27017/tastyrecipes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleRecipes = [
  {
    title: 'Vegetable Stir Fry',
    ingredients: ['broccoli', 'carrots', 'bell peppers', 'soy sauce', 'garlic'],
    instructions: [
      'Chop all vegetables into bite-sized pieces.',
      'Heat oil in a pan and sauté garlic.',
      'Add vegetables and stir fry for 5-7 minutes.',
      'Add soy sauce and cook for another 2 minutes.',
    ],
    dietaryPreferences: ['vegetarian', 'vegan'],
    calories: 200,
    cuisine: 'Asian',
  },
  {
    title: 'Chicken Alfredo Pasta',
    ingredients: ['chicken breast', 'pasta', 'heavy cream', 'parmesan cheese', 'garlic'],
    instructions: [
      'Cook pasta according to package instructions.',
      'Sauté chicken breast in a pan until cooked through.',
      'Add garlic and heavy cream to the pan, then stir in parmesan cheese.',
      'Combine pasta with the sauce and serve.',
    ],
    dietaryPreferences: [],
    calories: 600,
    cuisine: 'Italian',
  },
];

Recipe.insertMany(sampleRecipes)
  .then(() => {
    console.log('Sample recipes added to the database!');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  });