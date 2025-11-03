import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { tailwindColors, appColors } from "@/theme/colors";

interface BagItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const CurrentBag = () => {
  const { top } = useSafeAreaInsets();
  const [isBagVisible, setIsBagVisible] = useState(false);
  const [bagItems, setBagItems] = useState<BagItem[]>([
    {
      id: 1,
      name: "Margherita Pizza",
      price: 12.99,
      quantity: 1,
    },
    {
      id: 2,
      name: "Caesar Salad",
      price: 8.99,
      quantity: 2,
    },
    {
      id: 3,
      name: "Garlic Bread",
      price: 4.99,
      quantity: 1,
    },
  ]);

  // Animation values
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const containerScale = useRef(new Animated.Value(0.7)).current;
  const itemOpacities = useRef(
    bagItems.map(() => new Animated.Value(0))
  ).current;
  const itemTranslates = useRef(
    bagItems.map(() => new Animated.Value(50))
  ).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(30)).current;

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 0) return;

    setBagItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: number) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setBagItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
          );
        },
      },
    ]);
  };

  const calculateItemTotal = (item: BagItem) => {
    return item.price * item.quantity;
  };

  const calculateSubtotal = () => {
    return bagItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateDeliveryFee = () => {
    return 2.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee();
  };

  const getTotalItems = () => {
    return bagItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate container height (rest of screen height minus 50)
  const containerHeight = SCREEN_HEIGHT - (160+70);

  const openBag = () => {
    setIsBagVisible(true);

    // Reset animations
    containerOpacity.setValue(0);
    containerScale.setValue(0.7);
    footerOpacity.setValue(0);
    footerTranslateY.setValue(30);

    // Reset item animations
    itemOpacities.forEach((opacity) => opacity.setValue(0));
    itemTranslates.forEach((translate) => translate.setValue(50));

    // Container animation sequence
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(containerScale, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Items animation with staggered delay
    bagItems.forEach((_, index) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(itemOpacities[index], {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(itemTranslates[index], {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      }, 200 + index * 100); // Staggered delay
    });

    // Footer animation with longer delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(footerTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);
  };

  const closeBag = () => {
    // Reverse animation sequence
    Animated.parallel([
      Animated.timing(footerOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(footerTranslateY, {
        toValue: 30,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // Reverse items animation
    bagItems.forEach((_, index) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(itemOpacities[index], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(itemTranslates[index], {
            toValue: 50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 50); // Staggered close
    });

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(containerScale, {
          toValue: 0.7,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsBagVisible(false);
      });
    }, 200);
  };

  const toggleBag = () => {
    if (isBagVisible) {
      closeBag();
    } else {
      openBag();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.fixedBagContainer, { top: 50 }]}
        onPress={toggleBag}
      >
        <View style={styles.bagIconContainer}>
          <Feather
            name="shopping-bag"
            color={tailwindColors.neutral[500]}
            size={28}
          />
          {getTotalItems() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {getTotalItems() > 9 ? "9+" : getTotalItems()}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Bag Container that appears below the bag icon */}
      {isBagVisible && (
        <Animated.View
          style={[
            styles.bagContainer,
            {
              top: 50 + 70,
              height: containerHeight,
              opacity: containerOpacity,
              transform: [{ scale: containerScale }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.containerHeader}>
            <Text style={styles.containerTitle}>Your Bag</Text>
            <TouchableOpacity onPress={closeBag} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={20}
                color={tailwindColors.neutral[500]}
              />
            </TouchableOpacity>
          </View>

          {/* Items List */}
          <ScrollView
            style={styles.itemsContainer}
            showsVerticalScrollIndicator={false}
          >
            {bagItems.length === 0 ? (
              <Animated.View
                style={[
                  styles.emptyBag,
                  {
                    opacity: containerOpacity,
                    transform: [{ scale: containerScale }],
                  },
                ]}
              >
                <Feather
                  name="shopping-bag"
                  size={48}
                  color={tailwindColors.neutral[300]}
                />
                <Text style={styles.emptyBagText}>Your bag is empty</Text>
                <Text style={styles.emptyBagSubtext}>
                  Add some delicious items to get started!
                </Text>
              </Animated.View>
            ) : (
              <>
                {bagItems.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    style={[
                      styles.itemCard,
                      {
                        opacity: itemOpacities[index],
                        transform: [{ translateX: itemTranslates[index] }],
                      },
                    ]}
                  >
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>
                        ${item.price.toFixed(2)} each
                      </Text>
                      <Text style={styles.itemTotal}>
                        ${calculateItemTotal(item).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={[
                          styles.quantityButton,
                          item.quantity <= 1 && styles.quantityButtonDisabled,
                        ]}
                        onPress={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.quantityText}>{item.quantity}</Text>

                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeItem(item.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color={tailwindColors.red[500]}
                        />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                ))}
              </>
            )}
          </ScrollView>

          {/* Footer with pricing and checkout */}
          {bagItems.length > 0 && (
            <Animated.View
              style={[
                styles.footer,
                {
                  opacity: footerOpacity,
                  transform: [{ translateY: footerTranslateY }],
                },
              ]}
            >
              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Subtotal</Text>
                  <Text style={styles.priceValue}>
                    ${calculateSubtotal().toFixed(2)}
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Delivery Fee</Text>
                  <Text style={styles.priceValue}>
                    ${calculateDeliveryFee().toFixed(2)}
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Tax (8%)</Text>
                  <Text style={styles.priceValue}>
                    ${calculateTax().toFixed(2)}
                  </Text>
                </View>

                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    ${calculateTotal().toFixed(2)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fixedBagContainer: {
    position: "absolute",
    right: 20,
    zIndex: 99999,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bagIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: tailwindColors.red[500],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  bagContainer: {
    position: "absolute",
    right: 20,
    width: 320,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 99998,
    overflow: "hidden",
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tailwindColors.neutral[200],
    backgroundColor: tailwindColors.neutral[50],
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: tailwindColors.neutral[800],
  },
  closeButton: {
    padding: 4,
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyBag: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyBagText: {
    fontSize: 16,
    fontWeight: "600",
    color: tailwindColors.neutral[600],
    marginTop: 12,
    marginBottom: 6,
  },
  emptyBagSubtext: {
    fontSize: 13,
    color: tailwindColors.neutral[500],
    textAlign: "center",
  },
  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tailwindColors.neutral[100],
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: tailwindColors.neutral[800],
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: tailwindColors.neutral[600],
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: tailwindColors.green[600],
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tailwindColors.neutral[200],
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDisabled: {
    backgroundColor: tailwindColors.neutral[100],
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: tailwindColors.neutral[700],
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: tailwindColors.neutral[800],
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    padding: 6,
    marginLeft: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: tailwindColors.neutral[200],
    backgroundColor: tailwindColors.neutral[50],
  },
  priceBreakdown: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 13,
    color: tailwindColors.neutral[600],
  },
  priceValue: {
    fontSize: 13,
    fontWeight: "500",
    color: tailwindColors.neutral[700],
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: tailwindColors.neutral[300],
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: tailwindColors.neutral[800],
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: tailwindColors.green[600],
  },
  checkoutButton: {
    backgroundColor: tailwindColors.green[500],
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CurrentBag;