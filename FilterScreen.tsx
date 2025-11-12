// FilterScreen.tsx
import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Text, ScrollView, Alert } from 'react-native';
import MenuContent, { COURSES } from './MenuContent'; 

interface MenuItem {
    id: string;
    dishName: string;
    description: string;
    imageUrl?: string;
    image?: any;
    course: string;
    price: number;
}

interface FilterScreenProps {
    allMenuItems: MenuItem[]; 
    activeFilter: string;
    onApplyFilter: (filter: string) => void;
    onReturn: () => void;
}

// Programming with Masoud (2023) states that the useMemo hook can be "used to efficiently compute derived data like filtered lists without unnecessary re-renders."

const FilterScreen = ({ allMenuItems, activeFilter, onApplyFilter, onReturn }: FilterScreenProps) => {

    // Filtering logic code
    const filteredItems = useMemo(() => {
        if (activeFilter === 'ALL') {
            return allMenuItems;
        }
        return allMenuItems.filter(item => item.course === activeFilter);
    }, [allMenuItems, activeFilter]);

    // Placeholder for the see More option 
    const handleSeeMore = (item: MenuItem) => {
        Alert.alert(
            "Viewing Item Detail",
            `You clicked 'See More' for: ${item.dishName}.`,
        );
    };

    return (
        <SafeAreaView style={filterStyles.safeArea}>
            <View style={filterStyles.headerContainer}>
                <TouchableOpacity style={filterStyles.returnButton} onPress={onReturn}>
                    <Text style={filterStyles.returnButtonText}>Return</Text>
                </TouchableOpacity>

                <Text style={filterStyles.headerText}>Filter Page: {activeFilter}</Text>
            </View>

            <ScrollView style={filterStyles.scrollContent}>
                {/* Programming with Masoud, (2023) states, the MenuContent shows the user the filter they have selected */}
                <MenuContent
                    menuItems={filteredItems}
                    allMenuItems={allMenuItems} // Added: full menu for proper filtering
                    activeFilter={activeFilter}
                    onApplyFilter={onApplyFilter} 
                    onSeeMore={handleSeeMore}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

// Styles for FilterScreen
// Added more css styles for the cart and detail screens using platform specific code for ios and android learnt from Css Notes For Professionals (2022).
const filterStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#050a30',
    },
    scrollContent: {
        flex: 1,
        backgroundColor: '#050a30',
    },
    headerContainer: {
        width: '100%',
        height: Platform.OS === 'ios' ? 100 : 70,
        backgroundColor: '#1f2547',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 40 : 10,
        borderBottomWidth: 1,
        borderColor: '#3a9bdc',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    returnButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 45 : 15,
        left: 15,
        backgroundColor: '#3a9bdc',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
        zIndex: 10, 
    },
    returnButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default FilterScreen;
