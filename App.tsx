import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet,
    FlatList,
    Alert 
} from 'react-native';

export default function App() {
    // All the screens we can show
    const [screen, setScreen] = useState('home');
    
    // All the menu items in the restaurant
    const [menuItems, setMenuItems] = useState([
        {
            id: '1',
            name: 'Garlic Bread',
            description: 'Crispy baguette slices topped with garlic butter and herbs.',
            course: 'Starters',
            price: 35.00,
        },
        {
            id: '2',
            name: 'Chicken Alfredo Pasta',
            description: 'Creamy Alfredo sauce tossed with grilled chicken and fettuccine.',
            course: 'Mains',
            price: 120.00,
        },
        {
            id: '3',
            name: 'Beef Burger Deluxe',
            description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce.',
            course: 'Mains',
            price: 110.00,
        },
        {
            id: '4',
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with a gooey molten center served with ice cream.',
            course: 'Desserts',
            price: 60.00,
        },
        {
            id: '5',
            name: 'Greek Salad',
            description: 'Fresh tomatoes, cucumbers, olives, and feta cheese drizzled with olive oil.',
            course: 'Starters',
            price: 45.00,
        }
    ]);

    // Stuff for adding new items
    const [dishName, setDishName] = useState('');
    const [description, setDescription] = useState('');
    const [course, setCourse] = useState('Starters');
    const [priceText, setPriceText] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('All');

    // All the course types the restaurant has
    const courses = ['Starters', 'Mains', 'Desserts'];

    // Function to add a new menu item
    function addMenuItem() {
        // Change the price text to a number
        const price = Number(priceText);

        // To check if whecther you've filled everything correctly
        if (!dishName.trim()) {
            Alert.alert("Oops", "Please enter a dish name.");
            return;
        }
        if (!description.trim()) {
            Alert.alert("Oops", "Please enter a description.");
            return;
        }
        if (Number.isNaN(price) || price <= 0) {
            Alert.alert("Oops", "Please enter a valid price (number > 0).");
            return;
        }

        // Make a new item
        const newItem = {
            id: Math.random().toString(),
            name: dishName.trim(),
            description: description.trim(),
            course: course,
            price: price,
        };

        // To add it to the restaurant's list
        setMenuItems([newItem, ...menuItems]);
        
        // To clear the form
        setDishName('');
        setDescription('');
        setCourse('Starters');
        setPriceText('');
        
        Alert.alert("Nice!", "Menu item added successfully!");
    }

    // To remove a menu item
    function removeMenuItem(id) {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                        const newMenu = [];
                        for (let i = 0; i < menuItems.length; i++) {
                            if (menuItems[i].id !== id) {
                                newMenu.push(menuItems[i]);
                            }
                        }
                        setMenuItems(newMenu);
                    }
                }
            ]
        );
    }

    // To calculate average prices using for loop
    function calculateAveragePrices() {
        const result = {
            Starters: 0,
            Mains: 0,
            Desserts: 0
        };

        // Using for loop to go through each course
        for (let i = 0; i < courses.length; i++) {
            const courseType = courses[i];
            let total = 0;
            let count = 0;

            // Using while loop to count items in this course
            let j = 0;
            while (j < menuItems.length) {
                if (menuItems[j].course === courseType) {
                    total += menuItems[j].price;
                    count++;
                }
                j++;
            }

            result[courseType] = count > 0 ? total / count : 0;
        }

        return result;
    }

    // To get course statistics 
    function getCourseStatistics() {
        const stats = {
            Starters: { count: 0, total: 0 },
            Mains: { count: 0, total: 0 },
            Desserts: { count: 0, total: 0 }
        };

        // To go through menu items
        for (const index in menuItems) {
            const item = menuItems[index];
            stats[item.course].count++;
            stats[item.course].total += item.price;
        }

        return stats;
    }

    // To calculate the averages
    const averagePrices = calculateAveragePrices();
    const courseStats = getCourseStatistics();

    // To filter items based on selected course
    let filteredItems = [];
    if (selectedCourse === "All") {
        filteredItems = menuItems;
    } else {
        filteredItems = menuItems.filter(item => item.course === selectedCourse);
    }

    const totalItems = menuItems.length;

    // Calculate total menu value using for loop
    function calculateTotalValue() {
        let total = 0;
        for (let i = 0; i < menuItems.length; i++) {
            total += menuItems[i].price;
        }
        return total;
    }

    const totalMenuValue = calculateTotalValue();

    // For the navigation bar at the top
    function NavBar() {
        return (
            <View style={styles.nav}>
                <TouchableOpacity 
                    style={[styles.navItem, screen === 'home' && styles.navItemActive]}
                    onPress={() => setScreen('home')}
                >
                    <Text style={[styles.navText, screen === 'home' && styles.navTextActive]}>
                        Home
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.navItem, screen === 'add' && styles.navItemActive]}
                    onPress={() => setScreen('add')}
                >
                    <Text style={[styles.navText, screen === 'add' && styles.navTextActive]}>
                        Add Item
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.navItem, screen === 'filter' && styles.navItemActive]}
                    onPress={() => setScreen('filter')}
                >
                    <Text style={[styles.navText, screen === 'filter' && styles.navTextActive]}>
                        Filter
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // The Home Screen which shows everything
    if (screen === 'home') {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Chrisotoffel's Menu</Text>
                <NavBar />

                {/* Show some numbers about the menu */}
                <View style={styles.statsContainer}>
                    <Text style={styles.statsTitle}>Menu Info</Text>
                    <Text style={styles.statsText}>Total Items: {totalItems}</Text>
                    <Text style={styles.statsText}>Total Value: R{totalMenuValue.toFixed(2)}</Text>
                    
                    <Text style={styles.statsSubtitle}>Average Prices:</Text>
                    <Text style={styles.statsText}>
                        Starters: R{averagePrices.Starters.toFixed(2)} ({courseStats.Starters.count} items)
                    </Text>
                    <Text style={styles.statsText}>
                        Mains: R{averagePrices.Mains.toFixed(2)} ({courseStats.Mains.count} items)
                    </Text>
                    <Text style={styles.statsText}>
                        Desserts: R{averagePrices.Desserts.toFixed(2)} ({courseStats.Desserts.count} items)
                    </Text>
                </View>

                {/* Show all the menu items */}
                <Text style={styles.sectionTitle}>All Menu Items ({totalItems} total)</Text>
                <FlatList
                    data={menuItems}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={styles.menuItem}>
                            <View style={styles.menuItemContent}>
                                <Text style={styles.dishName}>{item.name}</Text>
                                <Text style={styles.course}>{item.course}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                                <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.removeButton}
                                onPress={() => removeMenuItem(item.id)}
                            >
                                <Text style={styles.removeText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        );
    }

    // This is for the Add Screen where one can add new items
    if (screen === 'add') {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Add New Food Item</Text>
                <NavBar />

                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.formTitle}>Create New Dish</Text>

                    <Text style={styles.label}>Food Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Pizza"
                        value={dishName}
                        onChangeText={setDishName}
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="What's in it..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    <Text style={styles.label}>What Course?</Text>
                    <View style={styles.courseRow}>
                        {courses.map((courseOption) => (
                            <TouchableOpacity
                                key={courseOption}
                                style={[
                                    styles.courseOption,
                                    course === courseOption && styles.selectedCourse,
                                ]}
                                onPress={() => setCourse(courseOption)}
                            >
                                <Text style={[
                                    styles.courseText,
                                    course === courseOption && styles.selectedCourseText
                                ]}>
                                    {courseOption}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Price in Rands</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., 100.00"
                        value={priceText}
                        onChangeText={setPriceText}
                        keyboardType="decimal-pad"
                    />

                    <TouchableOpacity style={styles.primaryButton} onPress={addMenuItem}>
                        <Text style={styles.primaryButtonText}>Add to Menu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.secondaryButton} 
                        onPress={() => setScreen('home')}
                    >
                        <Text style={styles.secondaryButtonText}>Back to Menu</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // For the Filter Screen 
    if (screen === 'filter') {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Filter by Course</Text>
                <NavBar />

                <View style={styles.filterContent}>
                    <Text style={styles.formTitle}>Choose a Course to See</Text>

                    <View style={styles.courseRow}>
                        {["All", ...courses].map((courseOption) => (
                            <TouchableOpacity
                                key={courseOption}
                                style={[
                                    styles.courseOption,
                                    selectedCourse === courseOption && styles.selectedCourse,
                                ]}
                                onPress={() => setSelectedCourse(courseOption)}
                            >
                                <Text style={[
                                    styles.courseText,
                                    selectedCourse === courseOption && styles.selectedCourseText
                                ]}>
                                    {courseOption}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.resultsCount}>
                        Showing {filteredItems.length} of {menuItems.length} items
                    </Text>

                    <FlatList
                        data={filteredItems}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        renderItem={({ item }) => (
                            <View style={styles.menuItem}>
                                <View style={styles.menuItemContent}>
                                    <Text style={styles.dishName}>{item.name}</Text>
                                    <Text style={styles.course}>{item.course}</Text>
                                    <Text style={styles.description}>{item.description}</Text>
                                    <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
                                </View>
                            </View>
                        )}
                    />

                    <TouchableOpacity 
                        style={styles.secondaryButton} 
                        onPress={() => setScreen('home')}
                    >
                        <Text style={styles.secondaryButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return null;
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f8ff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: 'darkgreen',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    navItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    navItemActive: {
        backgroundColor: 'lightgreen',
    },
    navText: {
        fontSize: 14,
        color: 'gray',
    },
    navTextActive: {
        fontWeight: 'bold',
        color: 'darkgreen',
    },
    statsContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'darkgreen',
        marginBottom: 10,
        textAlign: 'center',
    },
    statsSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'green',
        marginTop: 10,
        marginBottom: 5,
    },
    statsText: {
        fontSize: 14,
        marginBottom: 4,
        color: 'black',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'darkgreen',
        marginBottom: 10,
        marginLeft: 16,
    },
    listContainer: {
        paddingBottom: 20,
    },
    formContainer: {
        paddingBottom: 40,
    },
    filterContent: {
        flex: 1,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'darkgreen',
        marginBottom: 20,
        textAlign: 'center',
    },
    menuItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'lightgray',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    menuItemContent: {
        flex: 1,
    },
    dishName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    description: {
        fontSize: 14,
        color: 'gray',
        marginVertical: 5,
    },
    course: {
        fontSize: 14,
        color: 'green',
        fontWeight: '600',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'darkgreen',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'lightgray',
        fontSize: 14,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: 'darkblue',
    },
    courseRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 15,
    },
    courseOption: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    selectedCourse: {
        backgroundColor: 'green',
        borderColor: 'green',
    },
    courseText: {
        fontSize: 14,
        color: 'black',
    },
    selectedCourseText: {
        color: 'white',
    },
    primaryButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'green',
    },
    secondaryButtonText: {
        color: 'green',
        fontSize: 16,
        fontWeight: '600',
    },
    removeButton: {
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'red',
    },
    removeText: {
        color: 'red',
        fontWeight: '600',
    },
    resultsCount: {
        fontSize: 14,
        color: 'gray',
        textAlign: 'center',
        marginVertical: 12,
        fontStyle: 'italic',
    },
});