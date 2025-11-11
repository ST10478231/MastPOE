// MenuContent.tsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';

export const COURSES = ['Starters', 'Mains', 'Desserts', 'Platters', 'Sides'];
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/100/f0f0f0/666666?text=No+Image';

// This is the MenuItem interface
interface MenuItem {
    id: string;
    dishName: string;
    description: string;
    imageUrl?: string;
    image?: any;
    course: string;
    price: number;
}
 // This is the props interface for MenuContent
interface MenuContentProps {
    menuItems: MenuItem[];
    allMenuItems: MenuItem[]; 
    activeFilter: string;
    onApplyFilter: (filter: string) => void;
    onSeeMore: (item: MenuItem) => void;
}

// =========================================================================
// MenuItemCard Component
// =========================================================================
const MenuItemCard = ({ item, onSeeMore }: { item: MenuItem, onSeeMore: (item: MenuItem) => void }) => (
  <TouchableOpacity style={menuContentStyles.menuItemCard} onPress={() => onSeeMore(item)}>
    <Image
      source={item.image ? item.image : { uri: item.imageUrl || PLACEHOLDER_IMAGE_URL }}
      style={menuContentStyles.menuItemImage}
    />
    <View style={menuContentStyles.menuItemTextContent}>
      <Text style={menuContentStyles.menuItemDishName}>{item.dishName}</Text>
      <Text style={menuContentStyles.menuItemDescription} numberOfLines={2}>
        {item.description || 'No description provided.'}
      </Text>
      <View style={menuContentStyles.menuItemFooter}>
        <Text style={menuContentStyles.menuItemPrice}>R{item.price.toFixed(2)}</Text> 
        <View style={menuContentStyles.menuItemActions}>
          <TouchableOpacity style={[menuContentStyles.actionButton, menuContentStyles.seeMoreButton]} onPress={(e) => { e.stopPropagation(); onSeeMore(item); }}>
            <Text style={menuContentStyles.seeMoreButtonText}>See More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);


// Menu Content code 

const MenuContent = ({ menuItems, allMenuItems, activeFilter, onApplyFilter, onSeeMore }: MenuContentProps) => {
    
    // Calculations for display purposes
    const totalMenuPrice = menuItems.reduce((sum, item) => sum + item.price, 0);
    const averagePrice = menuItems.length > 0 ? totalMenuPrice / menuItems.length : 0;

    // Function to calculate the count for each filter button
    const getCountForFilter = (filter: string) => {
      if (filter === 'ALL') {
        return allMenuItems.length;
      }
      return allMenuItems.filter(item => item.course === filter).length;
    };

    return (
        <View style={menuContentStyles.contentArea}>
            
            {/* === Filter code === */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={menuContentStyles.courseFilterContainer}>
                {['ALL', ...COURSES].map(course => (
                    <TouchableOpacity
                        key={course}
                        style={[
                            menuContentStyles.courseButton,
                            activeFilter === course && menuContentStyles.activeCourseButton,
                        ]}
                        onPress={() => onApplyFilter(course)}
                    >
                        <Text
                            style={[
                                menuContentStyles.courseButtonText,
                                activeFilter === course && menuContentStyles.activeCourseButtonText,
                            ]}
                        >
                            {course} ({getCountForFilter(course)})
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            
            {/* === Menu Displays code === */}
            
            <Text style={menuContentStyles.totalCountText}>
                Total Menu Items Displayed: {menuItems.length}
            </Text>
            
            <Text style={menuContentStyles.averagePriceText}>
                Average Meal Price: R{averagePrice.toFixed(2)}
            </Text>
            
            {menuItems.map(item => {
                return <MenuItemCard item={item} onSeeMore={onSeeMore} key={item.id} />;
            })}

            {menuItems.length === 0 && (
                <Text style={menuContentStyles.emptyListText}>No items match the current filter.</Text>
            )}

        </View>
    );
};

// Styles for MenuContent
const menuContentStyles = StyleSheet.create({
    contentArea: { paddingHorizontal: 20, backgroundColor: '#050a30', paddingTop: 20, flex: 1 },
    
    // Filter Styles
    courseFilterContainer: {
        paddingVertical: 10,
        marginBottom: 15,
        marginHorizontal: -20, 
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#1f2547',
        backgroundColor: '#050a30',
    },
    courseButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1f2547',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#3a9bdc',
    },
    activeCourseButton: {
        backgroundColor: '#3a9bdc',
        borderColor: '#cae8ff',
    },
    courseButtonText: {
        color: '#cae8ff',
        fontWeight: '500',
        fontSize: 14,
    },
    activeCourseButtonText: {
        color: '#050a30',
        fontWeight: 'bold',
    },
    
    // Menu Stats and Cards Styles
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

});

export default MenuContent;