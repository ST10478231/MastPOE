import React, { useState, useMemo } from 'react';

import { View, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, Image, TextInput, Platform, Alert } from 'react-native';

import { Picker } from '@react-native-picker/picker';

export const COURSES = ['All', 'Starters', 'Mains', 'Desserts', 'Platters'];

export const generateId = (): string => Math.random().toString(36).substring(2, 9);

export const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/100/f0f0f0/666666?text=No+Image';

const INITIAL_MENU_ITEMS = [

  
  { id: '1', dishName: 'Roasted Lobster Tails', description: 'Two succulent lobster tails, broiled golden brown with a savory blend of melted butter.', price: 379.99, course: 'Mains', image: require('./assets/Lobster.jpg') },

  { id: '2', dishName: 'Marry me Shrimp Pasta', description: 'This Marry Me shrimp pasta is filled with tender, seasoned shrimp, a rich, creamy sun-dried tomato sauce, and al dente penne pasta', price: 269.99, course: 'Mains', image: require('./assets/MarryMeShrimpPasta.jpeg') },

  { id: '3', dishName: 'Salmon Steaks', description: 'Tender salmon steak finished with our signature sweet and spicy glaze, a fresh lemon, pure honey, minced garlic, and red pepper.', price: 295.99, course: 'Mains', image: require('./assets/SalmonSteaks.jpeg') },

  { id: '4', dishName: 'Mussel Risotto', description: 'Rich tapestry of Italian cuisine with our Golden Saffron Risotto with Plump Mussels', price: 259.99, course: 'Mains', image: require('./assets/SaffronMusselRisotto.jpeg') },

  { id: '5', dishName: 'Prawn Sushi Bowl', description: 'Sushi Bowl with Prawns, Avocado Rose, Wasabi Mayonnaise, Nori and Soy Sauce', price: 235.99, course: 'Mains', image: require('./assets/SushiBowl.jpeg') },

  { id: '6', dishName: 'Recette Paella', description: 'Sofrito, toasted rice, saffron broth, chicken, shrimp, mussels, and peas.', price: 315.99, course: 'Mains', image: require('./assets/RecettePaella.jpeg') },

  { id: '7', dishName: 'Classic Fish and Chips', description: 'Extra crispy exterior  with a combination of all-purpose flour, rice flour, beer and a bit of vodka.', price: 189.99, course: 'Mains', image: require('./assets/ClassicFishandChips.jpeg') },

  { id: '8', dishName: 'Linguine and Clams', description: 'Buttery sauce with garlic clams, white wine and sweet tomatoes infused with pasta', price: 255.99, course: 'Mains', image: require('./assets/LinguineandClams.jpeg') },


  { id: '9', dishName: 'Crab Cake Bites', description: 'Fresh crab, shrimp, and the perfect blend of seasonings', price: 165.99, course: 'Starters', image: require('./assets/CrabCakes.jpeg') },

  { id: '10', dishName: 'Bacon Wrapped Scallops', description: 'Crispy bacon wrapped around tender, juicy scallops', price: 155.99, course: 'Starters', image: require('./assets/ScallopsWrappedinBacon.jpeg') },

  { id: '11', dishName: 'Fried Calamari', description: 'Crispy deep fried calamari with a side of tartar sauce.', price: 145.99, course: 'Starters', image: require('./assets/FriedCalamariRecipe.jpeg') },

  { id: '12', dishName: 'Grilled Oysters', description: 'Grilled oysters topped with rich garlic butter.', price: 169.99, course: 'Starters', image: require('./assets/GrilledClams.jpeg') },

  { id: '13', dishName: 'Seafood Chowder', description: '', price: 139.99, course: 'Starters', image: require('./assets/CreamySeafoodChowder.jpeg') },

  { id: '14', dishName: 'Mussels and Clams Arrabiata', description: 'Succulent mussels and clams topped with the flavours of Arrabiata sauce.', price: 159.99, course: 'Starters', image: require('./assets/Mussels&ClamsArrabiata.jpeg') },

  { id: '15', dishName: 'Shrimp Scampi Pizza', description: 'A pizza flatbread base coated in buttery garlic covered in succulent shrimp.', price: 175.99, course: 'Starters', image: require('./assets/ShrimpScampiFlatbreads.jpeg') },

  { id: '16', dishName: 'Vietnamese Summer Rolls', description: 'Shrimp, vegetables, herbs, and rice noodles wrapped in rice paper', price: 135.99, course: 'Starters', image: require('./assets/SummerRolls.jpeg') },

  { id: '17', dishName: 'Octopus Poke with Kimchi', description: 'Chewy octupos combined with crunchy kimchi.', price: 185.99, course: 'Starters', image: require('./assets/OctopusPokeWithKimchi.jpeg') },


  { id: '18', dishName: 'Classicly Chilled', description: 'Lobster, King Crab legs, king Prawns and Shrimp with sauces of choice served chilled on an iced tray', price: 495.99, course: 'Platters', image: require('./assets/Chilled.jpeg') },

  { id: '19', dishName: 'Grilled Seafood Platter', description: 'Comes with grileed lobster, prawn, shrimp, salmon, swordfish, hake, octopus, scallops.', price: 529.99, course: 'Platters', image: require('./assets/Grilled.jpeg') },

  { id: '20', dishName: 'Middle Eastern Cuisine', description: 'Served with hot and spicy salmon, snoek, shrimp, prawn, octopus, mussels, lobster coated with peri peri sauce, garlic butter and soaked in spicy broth with vegetables.', price: 489.99, course: 'Platters', image: require('./assets/MiddleEastern.jpeg') },

  { id: '21', dishName: 'Sushi Sashimi', description: 'Served with thinly sliced tuna, salmon, yellowfish, eal as well as spicy tuna rolls, dragon roll, california roll, volcano roll, tiger roll with sides of wasabi, soy sause, radish, kimchi and gari.', price: 459.99, course: 'Platters', image: require('./assets/SushiSashimi.jpeg') },


  { id: '22', dishName: 'Cheesy Garlic Rolls', description: 'Cheesy roll overlayed with garlic coating.', price: 65.99, course: 'Sides', image: require('./assets/CheesyGarlicBread.jpeg')   },

  { id: '23', dishName: 'Potato Wedges', description: 'Roasted potatoe cuts', price: 59.99, course: 'Sides', image: require('./assets/PotatoWedges.jpeg')  },

  { id: '24', dishName: 'Vegetables', description: 'Asparagus, butternut and spinach', price: 49.99, course: 'Sides', image: require('./assets/Vegetables.jpeg') },

  { id: '25', dishName: 'Crusty Bread', description: 'Toasted sliced baugettes', price: 39.99, course: 'Sides', image: require('./assets/CrustyBread.jpeg')  },


  { id: '26', dishName: 'Brown com Gelato', description: 'Authentic Italian-style ice cream with a rich flavors of vanilla, chocolate, or pistachio under a choclatey brownie', price: 79.99, course: 'Desserts', image: require('./assets/BrownieComGelato.jpeg')  },

  { id: '27', dishName: 'Chocolate Lava Cake', description: 'Warm, decadent chocolate cake with a gooey center, served with a scoop of vanilla ice cream and a drizzle of rich fudge sauce.', price: 95.99, course: 'Desserts', image: require('./assets/ChocolateLavaCake.jpeg')  },

  { id: '28', dishName: 'Cheesecake', description: 'Creamy baked cheesecake on a buttery biscuit base, topped with your choice of berry compote or caramel drizzle.', price: 89.99, course: 'Desserts', image: require('./assets/Cheesecake.jpeg')  },

  { id: '29', dishName: 'Tiramisu', description: 'A classic Italian dessert layered with espresso-soaked ladyfingers, mascarpone cream, and dusted with fine cocoa powder', price: 92.99, course: 'Desserts', image: require('./assets/Tiramisu.jpeg')  },

  { id: '30', dishName: 'Panna Cotta', description: 'Smooth, creamy vanilla custard topped with a tangy passion fruit', price: 84.99, course: 'Desserts', image: require('./assets/PannaCotta.jpeg')  },

  { id: '31', dishName: 'Milk Tart', description: 'A South African favorite — creamy custard with a hint of cinnamon on a buttery pastry crust, served chilled.', price: 69.99, course: 'Desserts', image: require('./assets/MilkTart.jpeg')  },

  { id: '32', dishName: 'Red Velvet', description: 'Soft red velvet layers filled with rich cream cheese frosting', price: 89.99, course: 'Desserts', image: require('./assets/RedVelvet.jpeg')  },

  { id: '33', dishName: 'Lemon Meringue', description: 'Zesty lemon curd on a buttery crust topped with toasted, fluffy meringue', price: 79.99, course: 'Desserts', image: require('./assets/LemonMeringue.jpeg')  },
  
];


interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  imageUrl?: string;
  image?: any;
  course: string;
  price: number;
}

// Updated MenuItemCard to accept an onRemove prop
const MenuItemCard = ({ item, onRemove }: { item: MenuItem, onRemove: (id: string) => void }) => (
  <TouchableOpacity style={styles.menuItemCard}>
    <Image
      source={item.image ? item.image : { uri: item.imageUrl || PLACEHOLDER_IMAGE_URL }}
      style={styles.menuItemImage}
    />
    <View style={styles.menuItemTextContent}>
      <Text style={styles.menuItemDishName}>{item.dishName}</Text>
      <Text style={styles.menuItemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.menuItemFooter}>
        <Text style={styles.menuItemPrice}>R{item.price.toFixed(2)}</Text>
        <View style={styles.menuItemActions}>
          <TouchableOpacity style={[styles.actionButton, styles.removeButton]} onPress={() => onRemove(item.id)}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.seeMoreButton]}>
            <Text style={styles.seeMoreButtonText}>See More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// 2. Add New Item Form (Matches Image 1 Style)
interface AddItemFormProps {
  onSave: (item: MenuItem) => void;
}
const AddItemForm = ({ onSave }: AddItemFormProps) => {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState(COURSES[1]);
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE_URL);

  const handleSave = () => {
    if (!dishName || !price) {
      Alert.alert("Required Fields", "Dish Name and Price are required.");
      return;
    }
    
    const newItem = {
      id: generateId(),
      dishName,
      description,
      course,
      price: parseFloat(price) || 0,
      imageUrl,
    };
    
    onSave(newItem);
    
    // Reset form for next entry (Feature 5: Chef can add all menu items to the list)
    setDishName('');
    setDescription('');
    setCourse(COURSES[1]);
    setPrice('');
    setImageUrl(PLACEHOLDER_IMAGE_URL);
  };
  
  // Mock function for image selection to match the style
  const pickImage = () => {
    const tempImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    setImageUrl(imageUrl === PLACEHOLDER_IMAGE_URL ? tempImg : PLACEHOLDER_IMAGE_URL);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formHeader}>New Menu Item </Text>

      {/* Input Card - Based on Image 1 */}
      <View style={styles.inputCard}>
        {/* Image Placeholder */}
        <TouchableOpacity onPress={pickImage} style={styles.inputImagePlaceholder}>
          <Image source={{ uri: imageUrl }} style={styles.inputImage} />
          <Text style={styles.inputImageText}>Add image</Text>
        </TouchableOpacity>
        
        <View style={styles.inputGroup}>
          {/* Dish Name (Feature 1a) */}
          <TextInput
            placeholder="Add name"
            placeholderTextColor={'#d9d9d9'}
            style={styles.input}
            value={dishName}
            onChangeText={setDishName}
          />
          {/* Description (Feature 1b) */}
          <TextInput
            placeholder="Add Description..."
            placeholderTextColor={'#d9d9d9'}
            style={[styles.input, { height: 60 }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />
          
          {/* Price (Feature 1d) */}
          <TextInput
            placeholder="Add Price"
            placeholderTextColor={'#d9d9d9'}
            style={styles.input}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          
          {/* Course Picker (Feature 1c & 2) */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={course}
              onValueChange={(itemValue: string) => setCourse(itemValue)}
              style={styles.picker}
              dropdownIconColor={'#cae8ff'}
              mode="dropdown"
            >
              {COURSES.slice(1).map(c => (
                <Picker.Item label={`Select Course: ${c}`} value={c} color={'black'} key={c} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.addToMenuButton} onPress={handleSave}>
        <Text style={styles.addToMenuButtonText}>Add to Menu</Text>
      </TouchableOpacity>
    </View>
  );
};


// --- MAIN APP COMPONENT ---

const HomeScreen = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedCourse, setSelectedCourse] = useState('All');

  // Function to add a new item (Feature 5)
  const addMenuItem = (newItem: MenuItem) => {
    setMenuItems(prevItems => [...prevItems, newItem]);
  };
  
  // Function to remove an item (NEW FEATURE)
  const removeMenuItem = (idToRemove: string) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
  };


  // Filter menu items based on the selected course
  const filteredMenuItems = useMemo(() => {
    if (selectedCourse === 'All') {
      return menuItems;
    }
    return menuItems.filter(item => item.course === selectedCourse);
  }, [menuItems, selectedCourse]);
  
  // Calculate counts for filters (Feature 2)
  const getCourseCount = (course: string) => {
    if (course === 'All') return menuItems.length;
    return menuItems.filter(item => item.course === course).length;
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* === RESTAURANT HEADER (Image 2 Top) === */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.headerImageBackground}
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.restaurantName}>MAISON CHRISTOFFELS</Text>
            <Text style={styles.restaurantYear}>2009</Text>
          </View>
        </ImageBackground>

        <View style={styles.contentArea}>
          <Text style={styles.restaurantDescription}>
            Maison Christoffels translated in english is the house of Christoffels. This business has been run by many forefathers in the Christoffels family name since 2009 with more legendary recipes of the sea passed down thourgh generations onto your plate
          </Text>
          
          {/* === ADD ITEM FORM (Features 1 & 5) === */}
          <AddItemForm onSave={addMenuItem} />

          {/* === MENU DISPLAY AND FILTERS === */}
          
          {/* Total Item Count (Feature 4) */}
          <Text style={styles.totalCountText}>
            Total Menu Items to select from: {menuItems.length}
          </Text>
          
          {/* Filter Buttons (Image 1 Top) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {COURSES.map(course => (
              <TouchableOpacity
                key={course}
                style={[
                  styles.filterButton,
                  selectedCourse === course && styles.filterButtonActive
                ]}
                onPress={() => setSelectedCourse(course)}
              >
                <Text style={styles.filterButtonText}>
                  {course} ({getCourseCount(course)})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Menu List (Feature 3) */}
          {filteredMenuItems.map(item => {
            return <MenuItemCard item={item} onRemove={removeMenuItem} key={item.id} />;
          })}

          {filteredMenuItems.length === 0 && (
            <Text style={styles.emptyListText}>No {selectedCourse} items found.</Text>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLESHEET ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  // --- Header Styles ---
  headerImageBackground: {
    height: 300,
    justifyContent: 'flex-end',
  },
  headerOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
  },
  restaurantName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 3,
    // fontFamily: 'Hammersmith One', // Commented out to prevent errors if font isn't loaded
    textAlign: 'center',
  },
  restaurantYear: {
    fontSize: 18,
    color: 'white',
    // fontFamily: 'Hammersmith One', // Commented out to prevent errors if font isn't loaded
    textAlign: 'center',
  },
  contentArea: {
    paddingHorizontal: 20,
    backgroundColor: '#050a30',
    paddingTop: 20,
  },
  restaurantDescription: {
    fontSize: 14,
    color: 'white',
    // fontFamily: 'Playfair Display', // Commented out to prevent errors if font isn't loaded
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  // --- Chef Tools / Form Styles (Image 1) ---
  formContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'white',
    marginBottom: 20,
  },
  formHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputImagePlaceholder: {
    alignItems: 'center',
    marginRight: 15,
  },
  inputImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },
  inputImageText: {
    marginTop: 5,
    fontSize: 12,
    color: 'grey',
  },
  inputGroup: {
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
    marginBottom: 10,
    fontSize: 15,
    color: 'black',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    height: 45,
    justifyContent: 'center',
    marginBottom: 10,
  },
  picker: {
    height: 45,
    width: '100%',
    color: 'black',
  },
  addToMenuButton: {
    backgroundColor: '#3a9bdc',
    borderRadius: 25,
    paddingVertical: 12,
    alignSelf: 'center',
    paddingHorizontal: 30,
    marginTop: 10,
  },
  addToMenuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // --- Menu Display / Filter Styles ---
  totalCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterScroll: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    borderColor: '#3a9bdc',
    backgroundColor: 'rgba(100, 181, 246, 0.2)',
  },
  filterButtonText: {
    color: 'white',
    // fontFamily: 'Hammersmith One', // Commented out to prevent errors if font isn't loaded
    fontSize: 14,
  },
  // --- Menu Item Card Styles (Image 2 Bottom) ---
  menuItemCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    elevation: 8, // Android shadow
    shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: 'white',
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    borderColor: Platform.OS === 'android' ? '#ddd' : 'transparent',
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  menuItemTextContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  menuItemDishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  menuItemDescription: {
    fontSize: 12,
    color: 'black',
    marginVertical: 5,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  // New Styles for Actions
  menuItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 5, // Spacing between buttons
  },
  seeMoreButton: {
    backgroundColor: '#3a9bdc',
  },
  seeMoreButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Style for the new Remove button
  removeButton: {
    backgroundColor: '#dc3a3a', // Red color for removal
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    color: 'Grey',
    marginTop: 20,
  },
});

export default HomeScreen;
