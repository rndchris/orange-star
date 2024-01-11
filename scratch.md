## Menu Types

1. Master Menu -- Menu with ALL food options
2. Seasonal Menu -- Menu with items that i'm currently interested in
3. Current Menu -- Menu with items that you have ingredients for

Automenus --
I'm in a rush menu -- query current menu for items that take less that 15 minutes to prep

## Inventory

I want inventory to be flexible. Basically, I still want it to be useful even if I half-ass keeping track of my food. some general ideas:
1. Flexible/subsitution ingredients in recipes: E.g. "Protein" used, which automatically be good for "Chicken, Tofu, Beef, etc"
    - Flexipes TM.
2. Subsitutions table, automatically considered when creating current menu from inventory.
3. Critical ingredients approach -- define what must be in inventory to determine if a recipe should be suggested.
4. Important Ingredients -- warn for important ingredients not in inventory when an item is chosen, but still include in menu suggestions.
5. Infinite ingredients - ingredients with quantity -1 are considered to always be in stock
6. Recipes can have ingredients that are not in inventory (not zero in inventory, just straight up not tracked).
    - maybe implement with something like quantity -1 is not tracked, quantity -2 is always in stock

Consider using stupid inventory (tm). Don't track quantity of items in stock at all, rather an item is either in stock or not in stock. When user chooses to cook recipe, they mark whether or not all of an ingredient has been used rather than tracking exact quantity.

Why?   
    1. Only resteraunts care about exact quantities.
    2. Either you have it or you don't is much faster than tracking exact quantity.

Consider even stupider inventory/ingredients. No ingredients table. Ingredients are literally just text, and inventory comparison is just text comparison.
    1. Force inventory to be simple and prevent feature bloating in future. Inventory is supposed to be stupid so that it's easy to use.
    2. Still will need to be an object on the recipe side to track whether or not it's essential for a recipe.
    3. Flexible ingredients might just need to tracked seperate from regular ingredients or be magic keywords. Like, when intepreting ingredients PROTEIN is read as chicken, tofu, beef, etc.
        1. PROTEIN: Chicken, javascript only dipslays Chicken to user, but recognizes it as a flexible ingredient.
    4. OR have an extra spot on a recipe object where appropriate substitutes are aligned with an ingredient.

## Approach to development

Seperate based on what user will need to interact with.
1. Menu interface - general menu display for picking items from menu.
2. Menu creator
3. Grocery list interface
4. Recipe interface
5. Inventory interface

Interfaces should be generic and serve multiple functions: for example, the menu interface is used to interact with a created menu. Items can be added to grocery list from menu, meal plan created from menu. Then the grocery list interface can be used to add items to inventory

## Note to self -- My main reason for developing this is other apps like Grocry requrie a lot of overhead to maintain recipes/inventory/planning. As an end user, I want to spend less than five minutes with the app choosing what to eat, and then I want it to poop out what I need to do.

Super cool feature to consider much later after base app is functional: Barcode scanner for phone to add items to inventory.

Will need to develop way to control display order.