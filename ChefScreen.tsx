// ChefScreen.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export const COURSES = ['Starters', 'Mains', 'Desserts', 'Platters', 'Sides']; 
export const generateId = (): string => Math.random().toString(36).substring(2, 9);

interface MenuItem {
    id: string;
    dishName: string;
    description: string;
    imageUrl?: string;
    image?: any;
    course: string;
    price: number;
  }

interface AddItemFormProps { 
  onSave: (item: MenuItem) => void;
}

// Adding to the menu code
// Codevolution (2022) states that the AddItemForm component handles the form inputs and submission logic for adding new menu items.
const AddItemForm = ({ onSave }: AddItemFormProps) => {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); 
  const [course, setCourse] = useState(COURSES[0]); 
  const [imageUrl, setImageUrl] = useState('');

  const handleSave = () => { // Error handling for missing details
    if (!dishName || !price || !course) {
      Alert.alert('Missing Details', 'Please fill in the Dish Name, Price, and select a Course.');
      return;
    }

    const numericPrice = parseFloat(price); // Error handling for an invalid price
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price greater than zero.');
      return;
    }

    const newItem: MenuItem = {
      id: generateId(),
      dishName,
      description,
      course,
      price: numericPrice,
      imageUrl: imageUrl,
      image: undefined, 
    };
    
    // The onSave connects the form inputs to the menu management (YouTube, 2025)
    onSave(newItem); 
    
    // This resets the form after the chef submits
    setDishName('');
    setDescription('');
    setPrice('');
    setCourse(COURSES[0]);
    setImageUrl('');
  };

  return (
    <View>
      <Text style={formStyles.formHeader}>Add New Menu Item</Text>

      <Text style={formStyles.label}>Dish Name</Text> // Dish name input code
      <TextInput
        style={formStyles.input}
        placeholder="e.g., Spicy Tuna Roll"
        placeholderTextColor="#999"
        value={dishName}
        onChangeText={setDishName}
      />

      <Text style={formStyles.label}>Description</Text> // Description input code
      <TextInput
        style={[formStyles.input, formStyles.textArea]}
        placeholder="This meal has a delicte..."
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
      />

      <Text style={formStyles.label}>Price (R)</Text> // Price input code
      <TextInput
        style={formStyles.input}
        placeholder="e.g., 149.99"
        placeholderTextColor="#999"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric" 
      />

      <Text style={formStyles.label}>Image URL (Optional)</Text> // Image input code
      <TextInput
        style={formStyles.input}
        placeholder="Paste external image URL here"
        placeholderTextColor="#999"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <Text style={formStyles.label}>Course Category</Text> // Course selection code
      <View style={formStyles.pickerContainer}>
        <Picker
          selectedValue={course}
          onValueChange={(itemValue: string) => setCourse(itemValue)} 
          style={formStyles.picker}
          itemStyle={formStyles.pickerItem}
        >
          {COURSES.map((c) => (
            <Picker.Item key={c} label={c} value={c} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={formStyles.saveButton} onPress={handleSave}> //Submit button to add to menu
        <Text style={formStyles.saveButtonText}>Add Item to Menu</Text>
      </TouchableOpacity>
    </View>
  );
};



// ChefScreen Component the main coponent
//(React Native Notes for Professionals, 2022) The Code is used to combine the form inputs and menu management display

const ChefScreen = ({ menuItems, onAddItem, onRemoveItem, onReturn }: { 
    menuItems: MenuItem[], 
    onAddItem: (item: MenuItem) => void, 
    onRemoveItem: (id: string) => void, 
    onReturn: () => void 
}) => {
    return (
        <SafeAreaView style={formStyles.safeArea}>
            <ScrollView contentContainerStyle={formStyles.scrollContainer}>
                
                {/* Return Button */}
                <TouchableOpacity style={formStyles.returnButton} onPress={onReturn}>
                    <Text style={formStyles.returnButtonText}>Back to Menu</Text>
                </TouchableOpacity>

                {/* --- 1. Add item form --- */}
                <AddItemForm onSave={onAddItem} />

                <View style={formStyles.separator} />

                {/* --- Menu management for the menu by the chef --- */}
                <Text style={formStyles.managementHeader}> Manage Current Menu Items ({menuItems.length})</Text>

                {menuItems.length === 0 ? (
                    <Text style={formStyles.emptyListText}>No items are currently on the menu.</Text>
                ) : (
                    // Display items sorted by ID for consistent ordering
                    menuItems.sort((a, b) => a.id.localeCompare(b.id)).map(item => (
                        <View key={item.id} style={formStyles.menuItemRow}>
                            <View style={formStyles.itemDetails}>
                                <Text style={formStyles.itemNameText}>{item.dishName}</Text>
                                <Text style={formStyles.itemPriceText}>R{item.price.toFixed(2)} ({item.course})</Text>
                            </View>
                            <TouchableOpacity 
                                style={formStyles.removeButton} 
                                onPress={() => {
                                    Alert.alert(
                                        "Confirm Removal",
                                        `Are you sure you want to remove "${item.dishName}"?`,
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            { text: "Remove", style: "destructive", onPress: () => onRemoveItem(item.id) }
                                        ]
                                    );
                                }}
                            >
                                <Text style={formStyles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChefScreen;


// Styles for ChefScreen/AddItemForm

// Added more css styles for the cart and detail screens using platform specific code for ios and android learnt from Css Notes For Proffesionals (2022).
const formStyles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f0f4f8' 
  },

  scrollContainer: { 
    paddingBottom: 50, 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 0 : 20 
  },

  formHeader: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#050a30', 
    textAlign: 'center', 
    marginBottom: 20, 
    marginTop: 10 
  },

  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333', 
    marginTop: 15, 
    marginBottom: 5 
  },

  input: { 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16, 
    color: '#050a30' 
  },

  textArea: { 
    height: 100, 
    textAlignVertical: 'top' 
  },

  pickerContainer: { 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    overflow: 'hidden', 
    marginTop: 5 
  },

  picker: { 
    color: Platform.OS === 'ios' ? '#050a30' : 'black' 
  },
  
  pickerItem: { 
    color: '#050a30' 
  },

  saveButton: { 
    backgroundColor: '#3a9bdc', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 30, 
    elevation: 5 
  },

  saveButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  returnButton: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 50 : 20, 
    left: 20, 
    backgroundColor: '#6c757d', 
    borderRadius: 20, 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    zIndex: 1 
  },

  returnButtonText: { 
    color: 'white', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },

  // Management Styles
  managementHeader: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#050a30', 
    textAlign: 'center', 
    marginTop: 20, 
    marginBottom: 15 
  },

  menuItemRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 12, 
    borderRadius: 8, 
    marginVertical: 5, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },

  itemDetails: { 
    flex: 1, 
    marginRight: 10 
  },

  itemNameText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#050a30' 
  },

  itemPriceText: { 
    fontSize: 14, 
    color: '#666' 
  },

  removeButton: { 
    backgroundColor: '#dc3a3a', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 5 
  },

  removeButtonText: { 
    color: 'white', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },

  separator: { 
    height: 1, 
    backgroundColor: '#3a9bdc', 
    marginVertical: 25, 
    marginHorizontal: -20 
  },

  emptyListText: { 
    textAlign: 'center', 
    color: '#666', 
    marginTop: 10, 
    marginBottom: 20 
  },
});