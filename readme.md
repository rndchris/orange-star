# Orange Star
*Where eating in is eating out.*

What if meal planning was as easy as ordering from a resturant menu? That's the goal of Orange Star. Choosing what to eat, making a grocery list while remembering what you already have in your pantry, and knowing what time to start dinner so it's ready at the same time are skills that can require a significant amount of planning ahead and motivation. Orange star aims to streamline and make that easier.

## Features

1. Create a visually appealing menu to help you choose what you are in the mood to cook
2. Determine what time you need to start cooking to eat at dinner time
3. Create grocery lists by choosing menu items, automatically leaving out ingredients already in your inventory.
4. Easy inventory that still works pretty well even if you half-ass it.

## Overview

Once your typical recipes are in, choose what you want to eat like choosing from from a resturant menu:

1. Make grocery lists easily by choosing what you want to eat from the menu.
2. Easily turn your grocery lists into an inventory of your pantry. 
3. Choose what you want to eat from a menu based on what's in your kitchen, and figure out what time you need to start cooking so that it will be ready at a reasonable hour. 
    
Orange Star keeps your organized. No standing in front of the fridge at 6pm, staring into your fridge and trying to figure out supper. Just order from the menu.

## Screenshots

### The Main Menu

Meal planning is just like ordering from a menu. Choose recipes from the menu and directly add the needed ingredients directly to your grocery list, then when it comes time to cook, figure out what you can cook from what you have on hand with the click of a button. You can even see what time you need to start cooking to have dinner on time. 

<img height="400px" src="./screenshots/main-menu.jpg">

Edit your grocery list anywhere. Getting items into inventory is also a breeze. No scanning, entering endless quantities, or entering items one-by-one. Just click "add to inventory to move your entire grocery list to your inventory, and easily track what food you have on hand. 

<img height="400px" src="./screenshots/grocery-list.jpg">

The inventory manager enables to to add and remove individual ingredients to your inventory as needed. 

<img height="400px" src="./screenshots/inventory.jpg">

Jigsaw is a handy feature that allows you to make use of ingredients that don't add up to a coherent recipe. Jigsaw finds ingredients in inventory that can't currently be used to cook a recipe from your menu and suggests recipes, which allows you to pick up the needed ingredients at the grocery store so you can finally cook through everything in your pantry. 

<img height="400px" src="./screenshots/jigsaw.jpg">

The recipe manager tracks all of your recipes and allows you to add new recipes. The recipe manager also allows you to create new menu items too. Sick of an eating something? You can remove an item from the menu (done on the menu screen), and when you want to add it back to the menu, use the recipe manager to add it back to the menu, without ever deleting the recipe. 

<img height="400px" src="./screenshots/recipe-manager.jpg">

### How is Orange Star different from other nutrition and meal planning apps? Why choose Orange Star?

Orange Star focuses on streamlining meal planning. The goal is to get you from choosing your food, to the grocery store, cooking, and then to stay out of the way. Your interactions with the app should be brief, "like choosing from a resturant menu". No complicated inventory. No complicated search. A few simple choices on a few simple screens.

#### Recipes Ingredients are Flexible

On your recipes, you only mark ingredients you want to compare to inventory. You don't have to make sure you have common ingredients you always have, like black pepper, tracked in inventory, and it won't get constantly automatically added to your grocery list.

#### Stupid Inventory (TM)

You don't need an accurate account of every last gram of flour in your cupboard, and you certainly don't want to enter the exact quantity of every morsel of food in your kitchen into a web app. You just need to know whether or not you have an ingredient to cook with. Orange Star keeps track of what you have in your kitchen with Stupid Inventory. You simply track whether or not an ingredient is present, which makes manually adding individual items to inventory a breeze.

## Installation

Installation is easy with docker compose. Installing npm, docker, and docker compose are pre-requisites.

1. Clone this repository

    >git clone https://www.github.com/rndchris/orange-star.git

2. Install npm dependencies in the web directory

    >cd orange-star/web
    >npm i

3. Edit docker-compose.yml to your preferences.

    >cd ../  
    >nano docker-compose.yml

4. Run docker compose from the root directory of the repository.

    >sudo docker compose up -d

5. Open Orange Star in a web browser by going to http://localhost:[PORT]/

## Suggestions for Getting Started

### 1. Start by creating a small set of recipes.

Start by creating 5-10 recipes in the recipe manager of things that you plan to cook in the next week or two. Trying do inventory or grocery lists without recipes is unecessarily cumbersome, and trying to enter every recipe you have at once would not be fun.

A few tricks:

- Orange star is designed to be useful even when you only put half-effort into it. The only required recipe fields are title and cook time. If you make rice and beans every week, don't bother listing out all of the amounts needed and and putting in detailed directions. Just put in a title, cooktime, and list the ingredients.

- Only ingredients marked with the checkbox marked are used in inventory calculations and the grocery list, so only mark ingredients that you actually need to buy at the grocery store. Using the beans and rice as an example, If you kept rice in bulk and almost always had ample supply of your regular favorite seasoning, you might only mark the beans to be included in grocery/inventory calcuations. When you use the recipe in the future, the app will only add those marked ingredients to your grocery list, and only check your inventory for those ingredients when cooking.

### 2. Start your inital inventory by using the recipes you just created

Fill you initial inventory by using the recipes and grocery list function. Using the menu browser, set the click function to add to grocery list, and then just go through and click recipes that you already have all of the ingredients to cook. Once you're done, you can remove any ingredients you don't actually have on the grocery list editor, add any manual items you want, and then click "add to inventory" to move everything to your inventory rapidly. You can use this same method to quickly remove items from inventory if you don't feel like opening the app after every meal.

## Tricks

- You don't have to remove every ingredient on a recipe when you press the "cook" button in the recipe viewer. Clicking ingredients on a recipe displayed in the viewer will hide the ingredient from the viewer, and then you can "cook" or "add to list" and the rhidden ingredients will be skipped. This does not make any changes to the recipe, and you can see all the ingredients again by reselecting it from the menu.

- You can link a recipe to multiple menu categories from the recipe manager. So you can have your chips & guac both in a Snack category and a Taco Night category.