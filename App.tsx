// App.tsx

import React, { useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

// Import your screens
import HomeScreen from './HomeScreen'; 
import ChefScreen from './ChefScreen';
import FilterScreen from './FilterScreen'; 
import { COURSES } from './MenuContent'; // Uses the COURSES from MenuContent

// --- States the interface and placeholder image ---
export interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  imageUrl?: string;
  image?: any;
  course: string;
  price: number;
}

export const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/100/f0f0f0/666666?text=No+Image';

const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Start of 33 Menu items.

  // Mains
  { id: '1', dishName: 'Roasted Lobster Tails', 
    description: 'Two succulent lobster tails, broiled golden brown with a savory blend of melted butter.', 
    price: 379.99, 
    course: 'Mains', 
    image: require('./assets/Lobster.jpg') },

  { id: '2', 
    dishName: 'Marry me Shrimp Pasta', 
    description: 'This Marry Me shrimp pasta is filled with tender, seasoned shrimp, a rich, creamy sun-dried tomato sauce, and al dente penne pasta', 
    price: 269.99, course: 'Mains', 
    image: require('./assets/MarryMeShrimpPasta.jpeg')},

  { id: '3', 
    dishName: 'Salmon Steaks',
    description: 'Tender salmon steak finished with our signature sweet and spicy glaze, a fresh lemon, pure honey, minced garlic, and red pepper.', 
    price: 295.99, 
    course: 'Mains', 
    image: require('./assets/SalmonSteaks.jpeg') },

  { id: '4', 
    dishName: 'Mussel Risotto',
    description: 'Rich tapestry of Italian cuisine with our Golden Saffron Risotto with Plump Mussels', 
    price: 259.99, 
    course: 'Mains', 
    image: require('./assets/SaffronMusselRisotto.jpeg') },

  { id: '5', 
    dishName: 'Prawn Sushi Bowl', 
    description: 'Sushi Bowl with Prawns, Avocado Rose, Wasabi Mayonnaise, Nori and Soy Sauce', 
    price: 235.99, 
    course: 'Mains', 
    image: require('./assets/SushiBowl.jpeg') },

  { id: '6', 
    dishName: 'Recette Paella', 
    description: 'Sofrito, toasted rice, saffron broth, chicken, shrimp, mussels, and peas.', 
    price: 315.99, 
    course: 'Mains', 
    image: require('./assets/RecettePaella.jpeg') },

  { id: '7', 
    dishName: 'Classic Fish and Chips', 
    description: 'Extra crispy exterior with a combination of all-purpose flour, rice flour, beer and a bit of vodka.', 
    price: 189.99, 
    course: 'Mains', 
    image: require('./assets/ClassicFishandChips.jpeg') },
 
    { id: '8', 
    dishName: 'Linguine and Clams', 
    description: 'Buttery sauce with garlic clams, white wine and sweet tomatoes infused with pasta', 
    price: 255.99, 
    course: 'Mains', 
    image: require('./assets/LinguineandClams.jpeg') },

    // Starters
 
    { id: '9', 
    dishName: 'Crab Cake Bites', 
    description: 'Fresh crab, shrimp, and the perfect blend of seasonings', 
    price: 165.99, 
    course: 'Starters', 
    image: require('./assets/CrabCakes.jpeg') },
 
    { id: '10', 
    dishName: 'Bacon Wrapped Scallops', 
    description: 'Crispy bacon wrapped around tender, juicy scallops', 
    price: 155.99, course: 'Starters', 
    image: require('./assets/ScallopsWrappedinBacon.jpeg') },
 
    { id: '11', 
    dishName: 'Fried Calamari', 
    description: 'Crispy deep fried calamari with a side of tartar sauce.', 
    price: 145.99, 
    course: 'Starters', 
    image: require('./assets/FriedCalamariRecipe.jpeg') },
 
    { id: '12', 
    dishName: 'Grilled Oysters', 
    description: 'Grilled oysters topped with rich garlic butter.', 
    price: 169.99, 
    course: 'Starters', 
    image: require('./assets/GrilledClams.jpeg') },
 
    { id: '13', 
    dishName: 'Seafood Chowder', 
    description: 'A luxurious and deeply satisfying bowl of classic seafood chowder.', 
    price: 139.99, 
    course: 'Starters', 
    imageUrl: 'https://via.placeholder.com/100?text=Chowder' },
 
    { id: '14', 
    dishName: 'Mussels and Clams Arrabiata', 
    description: 'Succulent mussels and clams topped with the flavours of Arrabiata sauce.', 
    price: 159.99, 
    course: 'Starters', 
    image: require('./assets/Mussels&ClamsArrabiata.jpeg') },
 
    { id: '15', 
    dishName: 'Shrimp Scampi Pizza', 
    description: 'A pizza flatbread base coated in buttery garlic covered in succulent shrimp.', 
    price: 175.99, 
    course: 'Starters', 
    image: require('./assets/ShrimpScampiFlatbreads.jpeg') },
 
    { id: '16', 
    dishName: 'Vietnamese Summer Rolls', 
    description: 'Shrimp, vegetables, herbs, and rice noodles wrapped in rice paper', 
    price: 135.99, 
    course: 'Starters', 
    image: require('./assets/SummerRolls.jpeg') },
 
    { id: '17', 
    dishName: 'Octopus Poke with Kimchi', 
    description: 'Chewy octopus combined with crunchy kimchi.', 
    price: 185.99, 
    course: 'Starters', 
    image: require('./assets/OctopusPokeWithKimchi.jpeg') },

    // Platters
 
    { id: '18', 
    dishName: 'Classically Chilled', 
    description: 'Lobster, King Crab legs, king Prawns and Shrimp with sauces of choice served chilled on an iced tray', 
    price: 495.99, 
    course: 'Platters', 
    image: require('./assets/Chilled.jpeg') },
 
    { id: '19', 
    dishName: 'Grilled Seafood Platter', 
    description: 'Comes with grilled lobster, prawn, shrimp, salmon, swordfish, hake, octopus, scallops.', 
    price: 529.99, 
    course: 'Platters', 
    image: require('./assets/Grilled.jpeg') },
 
    { id: '20', 
    dishName: 'Middle Eastern Cuisine', 
    description: 'Served with hot and spicy salmon, snoek, shrimp, prawn, octopus, mussels, lobster coated with peri peri sauce, garlic butter and soaked in spicy broth with vegetables.', 
    price: 489.99, 
    course: 'Platters', 
    image: require('./assets/MiddleEastern.jpeg') },
 
    { id: '21', 
    dishName: 'Sushi Sashimi', 
    description: 'Served with thinly sliced tuna, salmon, yellowfish, eal as well as spicy tuna rolls, dragon roll, california roll, volcano roll, tiger roll with sides of wasabi, soy sauce, radish, kimchi and gari.', 
    price: 459.99, 
    course: 'Platters', 
    image: require('./assets/SushiSashimi.jpeg') },

    // Sides
 
    { id: '22', 
    dishName: 'Cheesy Garlic Rolls', 
    description: 'Cheesy roll overlaid with garlic coating.', 
    price: 65.99, 
    course: 'Sides', 
    image: require('./assets/CheesyGarlicBread.jpeg') },
 
    { id: '23', 
      dishName: 'Potato Wedges', 
      description: 'Roasted potato cuts', 
      price: 59.99, 
      course: 'Sides', 
      image: require('./assets/PotatoWedges.jpeg') },
 
      { id: '24', 
    dishName: 'Vegetables', 
    description: 'Asparagus, butternut and spinach', 
    price: 49.99, 
    course: 'Sides', 
    image: require('./assets/Vegetables.jpeg') },
 
    { id: '25', 
    dishName: 'Crusty Bread', 
    description: 'Toasted sliced baguettes', 
    price: 39.99, 
    course: 'Sides', 
    image: require('./assets/CrustyBread.jpeg') },

    // Desserts
 
    { id: '26', 
    dishName: 'Brown com Gelato', 
    description: 'Authentic Italian-style ice cream with a rich flavors of vanilla, chocolate, or pistachio under a chocolatey brownie', 
    price: 79.99, 
    course: 'Desserts', 
    image: require('./assets/BrownieComGelato.jpeg') },
 
    { id: '27', 
    dishName: 'Chocolate Lava Cake', 
    description: 'Warm, decadent chocolate cake with a gooey center, served with a scoop of vanilla ice cream and a drizzle of rich fudge sauce.', 
    price: 95.99, 
    course: 'Desserts', 
    image: require('./assets/ChocolateLavaCake.jpeg') },
 
    { id: '28', 
    dishName: 'Cheesecake', 
    description: 'Creamy baked cheesecake on a buttery biscuit base, topped with your choice of berry compote or caramel drizzle.', 
    price: 89.99, 
    course: 'Desserts', 
    image: require('./assets/Cheesecake.jpeg') },
 
    { id: '29', 
    dishName: 'Tiramisu', 
    description: 'A classic Italian dessert layered with espresso-soaked ladyfingers, mascarpone cream, and dusted with fine cocoa powder', 
    price: 92.99, 
    course: 'Desserts', 
    image: require('./assets/Tiramisu.jpeg') },
 
    { id: '30', 
    dishName: 'Panna Cotta', 
    description: 'Smooth, creamy vanilla custard topped with a tangy passion fruit', 
    price: 84.99, 
    course: 'Desserts', 
    image: require('./assets/PannaCotta.jpeg') },
 
    { id: '31', 
    dishName: 'Milk Tart', 
    description: 'A South African favorite — creamy custard with a hint of cinnamon on a buttery pastry crust, served chilled.', 
    price: 69.99, 
    course: 'Desserts', 
    image: require('./assets/MilkTart.jpeg') },
 
    { id: '32', 
    dishName: 'Red Velvet', 
    description: 'Soft red velvet layers filled with rich cream cheese frosting', 
    price: 89.99, 
    course: 'Desserts', 
    image: require('./assets/RedVelvet.jpeg') },
 
    { id: '33', 
    dishName: 'Lemon Meringue', 
    description: 'Zesty lemon curd on a buttery crust topped with toasted, fluffy meringue', 
    price: 79.99, 
    course: 'Desserts', 
    image: require('./assets/LemonMeringue.jpeg') },
]; // End of 33 Menu items

export const generateId = (): string => Math.random().toString(36).substring(2, 9);


type AppViewState = 'HOME' | 'CHEF_MANAGEMENT' | 'FILTER'; 
type CourseFilter = string | 'ALL'; 

const App = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [currentAppView, setCurrentAppView] = useState<AppViewState>('HOME');
  const [activeFilter, setActiveFilter] = useState<CourseFilter>('ALL'); 

  // --- Filtering Logic ---
  // Codevolution (2022), states that by using useMeno we can avoid unnecessary recalculations on every render.
  const filteredMenuItems = useMemo(() => {
    if (activeFilter === 'ALL') {
      return menuItems;
    }
    return menuItems.filter(item => item.course === activeFilter);
  }, [menuItems, activeFilter]);

  // --- Filter Handlers ---
  // Programming with Mash, (2023), states that this function is used to apply the courses filters 
  
  const handleApplyFilters = (filter: CourseFilter) => {
    setActiveFilter(filter);
  };
  
  // --- Chef Management Handlers ---
  // React Native Mastery, (2023) states that this code is used to add and remove menu items.
  const handleAddItem = (newItem: MenuItem) => {
    const finalNewItem: MenuItem = {
        ...newItem,
        image: newItem.image || (newItem.imageUrl ? { uri: newItem.imageUrl } : undefined)
    };
    setMenuItems(prev => [...prev, finalNewItem]);
    setCurrentAppView('HOME'); 
  };
  
  const handleRemoveItem = (idToRemove: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== idToRemove));
    // Simple filter reset if the category becomes empty
    if (!menuItems.filter(item => item.course === activeFilter).length) {
        setActiveFilter('ALL');
    }
  };


  // --- View Switching Handlers ---
  const handleGoToChef = () => setCurrentAppView('CHEF_MANAGEMENT');
  
  // 🔑 CRITICAL FIX: Reset the filter state when returning to the HOME view
  const handleReturnToHome = () => {
    setActiveFilter('ALL'); // Set filter back to default to display all items
    setCurrentAppView('HOME');
  }

  const handleGoToFilter = () => setCurrentAppView('FILTER'); 

  
  // --- Logic Based on Current View ---
  if (currentAppView === 'CHEF_MANAGEMENT') {
    return (
      <>
        <ChefScreen 
            menuItems={menuItems} 
            onAddItem={handleAddItem} 
            onRemoveItem={handleRemoveItem} 
            onReturn={handleReturnToHome} 
        />
        <StatusBar style="auto" />
      </>
    );
  }

  if (currentAppView === 'FILTER') { 
    return (
      <>
        <FilterScreen 
            allMenuItems={menuItems}
            activeFilter={activeFilter}
            onApplyFilter={handleApplyFilters}
            onReturn={handleReturnToHome} // This function now ensures filter is reset on return
        />
        <StatusBar style="auto" />
      </>
    );
  }

  // Web Dev Simplified, (2023) states that using this code means "data is passing rendering between parent and child components" 
  return (
    <>
      <HomeScreen 
        // filteredMenuItems will be the full list if activeFilter is 'ALL'
        menuItems={filteredMenuItems} 
        onGoToChef={handleGoToChef} 
        onGoToFilter={handleGoToFilter} 
      />
      <StatusBar style="auto" />
    </>
  );
};

export default App;