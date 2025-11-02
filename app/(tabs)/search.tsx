import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { appColors, tailwindColors } from "@/theme/colors";
import { fonts } from "@/lib/const";
import { Spinner } from "@/components/ui/spinner";

const Search = () => {
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null); // Change to number | null

  // Static demo suggestions array for testing - simulating backend data
  const demoSuggestions = [
    "Pizza Margherita",
    "Pepperoni Pizza",
    "Cheese Burger",
    "Chicken Burger",
    "California Sushi Roll",
    "Salmon Sushi",
    "Spaghetti Carbonara",
    "Fettuccine Alfredo",
    "Caesar Salad",
    "Greek Salad",
    "Cappuccino Coffee",
    "Latte Macchiato",
    "Vanilla Ice Cream",
    "Chocolate Ice Cream",
    "Club Sandwich",
    "Turkey Sandwich",
    "French Fries",
    "Onion Rings",
    "Chicken Wings",
    "Mozzarella Sticks",
    "Chocolate Cake",
    "Cheesecake",
    "Apple Pie",
    "Brownie Sundae",
    "Orange Juice",
    "Lemonade",
    "Iced Tea",
    "Smoothie Bowl"
  ];

  // Simulate backend API call
  const fetchSuggestionsFromBackend = async (query: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const filteredSuggestions = demoSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
    
    return filteredSuggestions;
  };

  const handleSearchChange = async (query: string) => {
    // Update the query state immediately for display purposes
    setSearchQuery(query);
    setShowSuggestions(false);
    
    // Clear previous timeout to avoid multiple API calls
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (query.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearchLoading(false);
      return;
    }

    // Show loading immediately when user starts typing
    setIsSearchLoading(true);

    // Set new timeout to wait for user to stop typing
    const newTimeout = setTimeout(async () => {
      try {
        console.log("Calling backend API for query:", query);
        
        const backendSuggestions = await fetchSuggestionsFromBackend(query);
        
        console.log("Backend returned:", backendSuggestions);
        setSuggestions(backendSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions from backend:", error);
        setSuggestions([]);
        setShowSuggestions(true);
      } finally {
        setIsSearchLoading(false);
      }
    }, 800);

    setTypingTimeout(newTimeout); // newTimeout is a number
  };

  const handleSuggestionPress = async (suggestion: string) => {
    // When a suggestion is pressed, update the search query
    // This will trigger the SearchBar to update through the onSearch callback
    handleSearchChange(suggestion);
    
    console.log("Selected suggestion:", suggestion);
    
    // Simulate searching for the selected suggestion with backend call
    setIsSearchLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Backend search completed for:", suggestion);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    // Clear everything
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearchLoading(false);
    
    // Clear any pending timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <ScrollView 
      contentContainerStyle={styles.screen}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.search_container}>
        <SearchBar
          placeholder="Search for food, restaurants..."
          onSearch={handleSearchChange}
          loading={isSearchLoading}
          containerStyle={styles.search_wrapper}
          inputStyle={styles.search_input}
          autoFocus={true}
          // Remove the value prop to let SearchBar manage its own state
          // value={searchQuery}
          onClear={handleClearSearch}
        />
        
        {/* Display current search query for debugging */}
        {/* <Text style={styles.debugText}>Current query: "{searchQuery}"</Text> */}
        
        {/* Suggestions Container */}
        {(showSuggestions || isSearchLoading) && (
          <View style={styles.suggestionsContainer}>
            {isSearchLoading ? (
              <View style={styles.loadingContainer}>
                <Spinner size="sm" />
                <Text style={styles.loadingText}>
                  {searchQuery ? `Searching for "${searchQuery}"...` : "Searching..."}
                </Text>
              </View>
            ) : suggestions.length > 0 ? (
              <>
                <Text style={styles.suggestionsTitle}>
                  Found {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} for "{searchQuery}"
                </Text>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : searchQuery.length > 0 ? (
              <Text style={styles.noResultsText}>
                No results found for "{searchQuery}"
              </Text>
            ) : null}
          </View>
        )}

        {/* Demo instructions */}
        {!showSuggestions && !isSearchLoading && searchQuery === "" && (
          <View style={styles.demoInstructions}>
            <Text style={styles.instructionsTitle}>Demo Instructions:</Text>
            <Text style={styles.instructionsText}>
              • Type "pizza", "burger", or "sushi" to see suggestions{"\n"}
              • Type "abc" to test no results state{"\n"}
              • Wait 0.8 seconds after typing to see results{"\n"}
              • Results come from simulated backend (1s delay){"\n"}
              • Tap any suggestion to select it
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Search;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  search_container: {
    paddingHorizontal: 10,
    position: "relative",
  },
  search_wrapper: {
    backgroundColor: tailwindColors.gray[50],
    borderWidth: 2,
    borderColor: tailwindColors.gray[300],
    borderRadius: 12,
  },
  search_input: {
    fontFamily: fonts["Montserrat-Medium"],
    fontSize: 14
  },
  debugText: {
    fontFamily: fonts["Montserrat-Medium"],
    fontSize: 12,
    color: tailwindColors.red[500],
    marginTop: 8,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 10,
    right: 10,
    backgroundColor: appColors.white,
    borderWidth: 1,
    borderColor: tailwindColors.gray[300],
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    zIndex: 1000,
    maxHeight: 300,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 12,
    fontFamily: fonts["Montserrat-Medium"],
    fontSize: 14,
    color: tailwindColors.gray[600],
  },
  suggestionsTitle: {
    fontFamily: fonts["Montserrat-SemiBold"],
    fontSize: 14,
    color: tailwindColors.gray[700],
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: tailwindColors.gray[200],
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: tailwindColors.gray[100],
  },
  suggestionText: {
    fontFamily: fonts["Montserrat-Medium"],
    fontSize: 14,
    color: tailwindColors.gray[800],
  },
  noResultsText: {
    fontFamily: fonts["Montserrat-Medium"],
    fontSize: 14,
    color: tailwindColors.gray[500],
    textAlign: "center",
    paddingVertical: 16,
  },
  demoInstructions: {
    marginTop: 24,
    padding: 16,
    backgroundColor: tailwindColors.amber[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tailwindColors.amber[200],
  },
  instructionsTitle: {
    fontFamily: fonts["Montserrat-SemiBold"],
    fontSize: 14,
    color: tailwindColors.amber[800],
    marginBottom: 8,
  },
  instructionsText: {
    fontFamily: fonts["Montserrat-Medium"],
    fontSize: 12,
    color: tailwindColors.amber[700],
    lineHeight: 18,
  },
});