// HomeScreen.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, Image, Platform, Alert } from 'react-native';

// NOTE: Use local constants for clarity, or import them from App.tsx
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/100/f0f0f0/666666?text=No+Image';

interface MenuItem {
    id: string;
    dishName: string;
    description: string;
    imageUrl?: string;
    image?: any;
    course: string;
    price: number;
}

interface CartItem extends MenuItem {
    quantity: number;
}

interface CartScreenProps {
  cartItems: CartItem[];
  onReturn: () => void;
  onRemove: (id: string) => void;
}

interface MenuItemDetailScreenProps {
  item: MenuItem;
  onReturn: () => void;
  onAddToCart: (item: MenuItem) => void; 
}

// Updated HomeScreenProps - Simplified
interface HomeScreenProps {
  menuItems: MenuItem[];
  onGoToChef: () => void;
  onGoToFilter: () => void; 
}

// =========================================================================
// CartScreen Component 
// =========================================================================
const CartScreen = ({ cartItems, onReturn, onRemove }: CartScreenProps) => {
    const totalCost = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.detailContainer}>
          <TouchableOpacity style={styles.returnButton} onPress={onReturn}>
            <Text style={styles.returnButtonText}>Back to Menu</Text>
          </TouchableOpacity>
          <Text style={styles.cartHeader}>🛒 Your Cart</Text>
          
          <ScrollView style={styles.cartList}>
            {cartItems.length === 0 ? (
              <Text style={styles.emptyCartText}>Your list is empty! Add some dishes from the menu.</Text>
            ) : (
              cartItems.map(item => (
                <View key={item.id} style={styles.cartItemCard}>
                  <Image
                    source={item.image ? item.image : { uri: item.imageUrl || PLACEHOLDER_IMAGE_URL }}
                    style={styles.cartItemImage} 
                  />
                  <View style={styles.cartItemTextContent}>
                    <Text style={styles.cartItemDishName}>{item.dishName}</Text>
                    <Text style={styles.cartItemPrice}>R{(item.price * item.quantity).toFixed(2)}</Text>
                    <Text style={styles.cartItemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <TouchableOpacity style={styles.cartRemoveButton} onPress={() => onRemove(item.id)}>
                    <Text style={styles.cartRemoveButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView> 

          {cartItems.length > 0 && (
            <View style={styles.cartFooterOnlyTotal}> 
              <Text style={styles.cartTotalText}>Total: R{totalCost.toFixed(2)}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
};


// =========================================================================
// MenuItemDetailScreen Component 
// =========================================================================
const MenuItemDetailScreen = ({ item, onReturn, onAddToCart }: MenuItemDetailScreenProps) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.detailContainer}>
      <TouchableOpacity style={styles.returnButton} onPress={onReturn}>
        <Text style={styles.returnButtonText}>Return</Text>
      </TouchableOpacity>
      <Text style={styles.detailDishName}>{item.dishName}</Text>
      <Image
        source={item.image ? item.image : { uri: item.imageUrl || PLACEHOLDER_IMAGE_URL }}
        style={styles.detailImage}
      />
      <Text style={styles.detailDescription}>
        {item.description || 'No description provided.'}
      </Text>
      <View style={styles.detailPriceContainer}>
        <Text style={styles.detailPriceLabel}>Price:</Text>
        <Text style={styles.detailPriceValue}>R{item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.addToMenuButton} 
        onPress={() => {
          onAddToCart(item); 
          onReturn(); 
        }}
      >
        <Text style={styles.addToMenuButtonText}>Add to List (Cart)</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);


// =========================================================================
// HomeScreen Component 
// =========================================================================
type ViewState = 'HOME' | 'DETAIL' | 'CART';

const HomeScreen = ({ menuItems, onGoToChef, onGoToFilter }: HomeScreenProps) => { 
  const [currentView, setCurrentView] = useState<ViewState>('HOME'); 
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null); 
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 

  // --- Handlers ---
  const handleSeeMore = (item: MenuItem) => {
    setSelectedItem(item);
    setCurrentView('DETAIL');
  };
  
  const handleReturnToHome = () => {
    setSelectedItem(null);
    setCurrentView('HOME');
  };
  
  const handleGoToCart = () => {
    setCurrentView('CART');
  };
  
  const handleReturnFromCart = () => {
    setCurrentView('HOME');
  };

  const handleAddToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    Alert.alert("Added to List", `${item.dishName} added to your order list.`);
  };

  const handleRemoveFromCart = (idToRemove: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === idToRemove);
      if (itemToRemove && itemToRemove.quantity > 1) {
        return prevItems.map(item => 
          item.id === idToRemove ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevItems.filter(item => item.id !== idToRemove);
      }
    });
  };


  // --- Calculations ---
  const totalMenuPrice = menuItems.reduce((sum, item) => sum + item.price, 0);
  const averagePrice = menuItems.length > 0 ? totalMenuPrice / menuItems.length : 0;
  
  // --- Conditional Rendering ---
  if (currentView === 'DETAIL' && selectedItem) {
    return <MenuItemDetailScreen 
      item={selectedItem} 
      onReturn={handleReturnToHome} 
      onAddToCart={handleAddToCart} 
    />;
  }

  if (currentView === 'CART') {
    return <CartScreen 
      cartItems={cartItems} 
      onReturn={handleReturnFromCart} 
      onRemove={handleRemoveFromCart}
    />;
  }

  // Default: Render HOME screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* === Header Image and Icons === */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.headerImageBackground}
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.restaurantName}>MAISON CHRISTOFFELS</Text>
            <Text style={styles.restaurantYear}>2009</Text>
          </View>

          {/* Chef Icon (Left side) */}
          <TouchableOpacity style={styles.chefIcon} onPress={onGoToChef}>
            <Text style={styles.chefIconText}>👨‍🍳</Text> 
          </TouchableOpacity>
          
          {/* Filter Icon (Center-Left) */}
          <TouchableOpacity style={styles.filterIcon} onPress={onGoToFilter}>
            <Text style={styles.filterIconText}>☰</Text> 
          </TouchableOpacity>

          {/* Cart Icon (Right side) */}
          <TouchableOpacity style={styles.cartIcon} onPress={handleGoToCart}>
            <Text style={styles.cartIconText}>🛒</Text> 
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.contentArea}>
          <Text style={styles.restaurantDescription}>
            Maison Christoffels translated in english is the house of Christoffels. This business has been run by many forefathers in the Christoffels family name since 2009 with more legendary recipes of the sea passed down thorough generations onto your plate
          </Text>
          
          {/* === Menu displays (Directly in Home Screen) === */}
          
          <Text style={styles.totalCountText}>
            Total Menu Items Displayed: {menuItems.length}
          </Text>
          
          {/* Average Price Display */}
          <Text style={styles.averagePriceText}>
            Average Meal Price: R{averagePrice.toFixed(2)}
          </Text>
          
          {menuItems.map(item => {
            return (
              <TouchableOpacity style={styles.menuItemCard} onPress={() => handleSeeMore(item)} key={item.id}>
                <Image
                  source={item.image ? item.image : { uri: item.imageUrl || PLACEHOLDER_IMAGE_URL }}
                  style={styles.menuItemImage}
                />
                <View style={styles.menuItemTextContent}>
                  <Text style={styles.menuItemDishName}>{item.dishName}</Text>
                  <Text style={styles.menuItemDescription} numberOfLines={2}>
                    {item.description || 'No description provided.'}
                  </Text>
                  <View style={styles.menuItemFooter}>
                    <Text style={styles.menuItemPrice}>R{item.price.toFixed(2)}</Text> 
                    <View style={styles.menuItemActions}>
                      <TouchableOpacity style={[styles.actionButton, styles.seeMoreButton]} onPress={(e) => { e.stopPropagation(); handleSeeMore(item); }}>
                        <Text style={styles.seeMoreButtonText}>See More</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {menuItems.length === 0 && (
            <Text style={styles.emptyListText}>The menu is currently empty or no items match the filter.</Text>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet for the application ---
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: 'white' 
  },

  scrollContent: { 
    paddingBottom: 50 
  },

  headerImageBackground: { 
    height: 300, 
    justifyContent: 'flex-end' 
  },

  headerOverlay: { 
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    padding: 20 
  },

  restaurantName: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: 'white', 
    letterSpacing: 3, 
    textAlign: 'center' 
  },

  restaurantYear: { 
    fontSize: 18, 
    color: 'white', 
    textAlign: 'center' 
  },

  contentArea: { 
    paddingHorizontal: 20, 
    backgroundColor: '#050a30', 
    paddingTop: 20, 
    flex: 1 
  },

  restaurantDescription: { 
    fontSize: 14, 
    color: 'white', 
    fontStyle: 'italic', 
    textAlign: 'center', 
    marginBottom: 20, 
    lineHeight: 20 
  },
  
  // Menu Stats and Card Styles (Re-added)
  totalCountText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: 'white', 
    marginBottom: 5, 
    textAlign: 'center' 
  },

  averagePriceText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#cae8ff', 
    marginBottom: 15, 
    textAlign: 'center' 
  },

  menuItemCard: { 
    flexDirection: 'row', 
    padding: 15, 
    borderRadius: 15, 
    marginVertical: 10, 
    elevation: 8, 
    shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent', 
    shadowOpacity: 0.3, 
    shadowRadius: 5, 
    shadowOffset: { width: 0, height: 2 }, 
    backgroundColor: 'white', 
    borderWidth: Platform.OS === 'android' ? 1 : 0, 
    borderColor: Platform.OS === 'android' ? '#ddd' : 'transparent' 
  },

  menuItemImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 8, 
    marginRight: 15 
  },

  menuItemTextContent: { 
    flex: 1, 
    justifyContent: 'space-between' 
  },

  menuItemDishName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: 'black' 
  },

  menuItemDescription: { 
    fontSize: 12, 
    color: 'black', 
    marginVertical: 5 
  },

  menuItemFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },

  menuItemPrice: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: 'black' 
  },

  menuItemActions: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  actionButton: { 
    paddingHorizontal: 8, 
    paddingVertical: 5, 
    borderRadius: 15, 
    marginLeft: 5 
  },

  seeMoreButton: { 
    backgroundColor: '#3a9bdc' 
  },

  seeMoreButtonText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },

  emptyListText: { 
    textAlign: 'center', 
    color: 'Grey', 
    marginTop: 20 
  },
  
  // Detail Screen Styles 
  detailContainer: { 
    flex: 1, 
    backgroundColor: '#050a30', 
    padding: 20, 
    alignItems: 'center' 
  },

  returnButton: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 50 : 20, 
    left: 20, 
    backgroundColor: '#3a9bdc', 
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

  detailDishName: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: 'white', 
    marginTop: Platform.OS === 'ios' ? 90 : 40, 
    marginBottom: 20, 
    textAlign: 'center' 
  },

  detailImage: { 
    width: '90%', 
    height: 250, 
    borderRadius: 15, 
    marginBottom: 30, 
    resizeMode: 'cover', 
    borderWidth: 3, 
    borderColor: 'white' 
  },

  detailDescription: { 
    fontSize: 16, 
    color: 'white', 
    textAlign: 'center', 
    paddingHorizontal: 10, 
    marginBottom: 40, 
    lineHeight: 24, 
    fontStyle: 'italic' 
  },

  detailPriceContainer: { 
    marginBottom: 30, 
    alignItems: 'center' 
  },

  detailPriceLabel: { 
    fontSize: 16, 
    color: 'white', 
    fontWeight: 'bold' 
  },

  detailPriceValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#cae8ff', 
    marginTop: 5 
  },

  addToMenuButton: { 
    backgroundColor: '#17a2b8', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    width: '90%' 
  },

  addToMenuButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  
  // Icon Styles 
  chefIcon: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 50 : 20, 
    left: 20, 
    padding: 10, 
    zIndex: 1 },

  chefIconText: { 
    fontSize: 30 
  },
  
  filterIcon: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 50 : 20, 
    left: 80, 
    padding: 10, 
    zIndex: 1 },
  
    filterIconText: { 
      fontSize: 30, 
      color: 'white', 
      fontWeight: 'bold' 
    },

  cartIcon: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 50 : 20, 
    right: 20, 
    padding: 10, 
    zIndex: 1 
  },
  
  cartIconText: { 
    fontSize: 30 
  },

  cartBadge: { 
    position: 'absolute', 
    right: 5, 
    top: 5, 
    backgroundColor: '#dc3a3a', 
    borderRadius: 10, 
    width: 20, 
    height: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  cartBadgeText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  
  // Cart Screen Styles
  cartHeader: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'white', 
    marginTop: Platform.OS === 'ios' ? 90 : 40, 
    marginBottom: 20, 
    textAlign: 'center' 
  },

  cartList: { 
    width: '100%', 
    paddingHorizontal: 10, 
    flex: 1 },

  cartItemCard: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: 15, 
    alignItems: 'center', 
    elevation: 3 
  },

  cartItemImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 5, 
    marginRight: 15 
  },

  cartItemTextContent: { 
    flex: 1, 
    justifyContent: 'center' 
  },

  cartItemDishName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: 'black' 
  },

  cartItemPrice: { 
    fontSize: 14, 
    color: '#3a9bdc', 
    fontWeight: 'bold' 
  },

  cartItemQuantity: { 
    fontSize: 12, 
    color: 'gray' 
  },

  cartRemoveButton: { 
    backgroundColor: '#dc3a3a',
     borderRadius: 15, 
     paddingVertical: 8, 
     paddingHorizontal: 12 
    },

  cartRemoveButtonText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },

  emptyCartText: { 
    color: 'gray', 
    fontSize: 16, 
    textAlign: 'center', 
    marginTop: 50 
  },

  cartFooterOnlyTotal: { 
    width: '100%', 
    padding: 15, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderTopWidth: 1, 
    borderTopColor: '#3a9bdc', 
    alignItems: 'center' 
  },

  cartTotalText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#cae8ff' 
  },

});

export default HomeScreen;