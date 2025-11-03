import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { appColors, tailwindColors } from "@/theme/colors";
import { fonts } from "@/lib/const";
import {
  FONT_SIZE_SMALL,
  FONT_SIZE_EXTRA_SMALL,
  FONT_SIZE_NORMAL,
  FONT_SIZE_MEDUIME,
} from "@/theme/globals";
import { Ionicons, Feather } from "@expo/vector-icons";
import { bagData } from "./index"; 

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  statusText: string;
  restaurant: string;
  restaurantLogo: string;
  items: OrderItem[];
  total: number;
  orderTime: string;
  address: string;
  customer: {
    fullName: string;
    phone: string;
  };
  estimatedDelivery?: string;
  deliveryPerson?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  deliveredTime?: string;
}
interface OrderSection {
  day: string;
  data: Order[];
}
const BagDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);

  useEffect(() => {
  // Flatten all orders from all days and find the order by ID
  const allOrders = (bagData as OrderSection[]).flatMap((section) => section.data);
  const foundOrder = allOrders.find(
    (order) => order.id === parseInt(id as string)
  );

  if (foundOrder) {
    setOrder(foundOrder);
    setEditedOrder({ ...foundOrder });
  } else {
    Alert.alert("Error", "Order not found");
  }
}, [id]);

  const handleSaveChanges = () => {
    if (editedOrder) {
      // In a real app, you would make an API call here
      setOrder(editedOrder);
      setIsEditing(false);
      Alert.alert("Success", "Order updated successfully!");
    }
  };

  const handleCancelEdit = () => {
    setEditedOrder(order ? { ...order } : null);
    setIsEditing(false);
  };

  const handleAddItems = () => {
    // Navigate to home screen where user can add more items
    // You might want to pass the order ID or some context to the home screen
    router.push("/");
  };

  const updateCustomerField = (
    field: keyof Order["customer"],
    value: string
  ) => {
    if (editedOrder) {
      setEditedOrder({
        ...editedOrder,
        customer: {
          ...editedOrder.customer,
          [field]: value,
        },
      });
    }
  };

  const updateAddress = (address: string) => {
    if (editedOrder) {
      setEditedOrder({
        ...editedOrder,
        address,
      });
    }
  };

  const updateItemQuantity = (itemId: number, newQuantity: number) => {
    if (editedOrder && newQuantity >= 0) {
      const updatedItems = editedOrder.items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      // Recalculate total
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      setEditedOrder({
        ...editedOrder,
        items: updatedItems,
        total: parseFloat(newTotal.toFixed(2)),
      });
    }
  };

  const removeItem = (itemId: number) => {
    if (editedOrder) {
      const updatedItems = editedOrder.items.filter(
        (item) => item.id !== itemId
      );
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      setEditedOrder({
        ...editedOrder,
        items: updatedItems,
        total: parseFloat(newTotal.toFixed(2)),
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return tailwindColors.orange[500];
      case "on_the_way":
        return tailwindColors.blue[500];
      case "delivered":
        return tailwindColors.green[500];
      default:
        return tailwindColors.gray[500];
    }
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading order...</Text>
      </View>
    );
  }

  const currentOrder = isEditing ? editedOrder! : order;

  // Calculate price breakdown
  const subtotal = currentOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;
  const calculatedTotal = subtotal + deliveryFee + tax;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={tailwindColors.gray[700]}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>{currentOrder.orderNumber}</Text>
            <Text style={styles.restaurantName}>{currentOrder.restaurant}</Text>
            <Text style={styles.orderTime}>
              Ordered at {currentOrder.orderTime}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(currentOrder.status) },
            ]}
          >
            <Text style={styles.statusText}>{currentOrder.statusText}</Text>
          </View>
        </View>

        {currentOrder.estimatedDelivery && (
          <View style={styles.estimatedDelivery}>
            <Text style={styles.estimatedDeliveryText}>
              Estimated delivery: {currentOrder.estimatedDelivery}
            </Text>
          </View>
        )}

        {currentOrder.deliveredTime && (
          <View style={styles.deliveredInfo}>
            <Text style={styles.deliveredText}>
              Delivered at: {currentOrder.deliveredTime}
            </Text>
          </View>
        )}
      </View>

      {/* Customer Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButton}>
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              value={currentOrder.customer.fullName}
              onChangeText={(value) => updateCustomerField("fullName", value)}
              placeholder="Enter full name"
            />
          ) : (
            <Text style={styles.inputValue}>
              {currentOrder.customer.fullName}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              value={currentOrder.customer.phone}
              onChangeText={(value) => updateCustomerField("phone", value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.inputValue}>{currentOrder.customer.phone}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Delivery Address</Text>
          {isEditing ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={currentOrder.address}
              onChangeText={updateAddress}
              placeholder="Enter delivery address"
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.inputValue}>{currentOrder.address}</Text>
          )}
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {isEditing && (
            <TouchableOpacity
              style={styles.addItemsButton}
              onPress={handleAddItems}
            >
              <Ionicons
                name="add-circle"
                size={20}
                color={tailwindColors.blue[600]}
              />
              <Text style={styles.addItemsText}>Add Items</Text>
            </TouchableOpacity>
          )}
        </View>

        {currentOrder.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                ${item.price.toFixed(2)} each
              </Text>
            </View>
            <View style={styles.quantityControls}>
              {isEditing && (
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateItemQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 0}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.quantityText}>{item.quantity}x</Text>
              {isEditing && (
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              )}
              {isEditing && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={tailwindColors.red[500]}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {currentOrder.items.length === 0 && (
          <View style={styles.emptyItems}>
            <Text style={styles.emptyItemsText}>No items in this order</Text>
          </View>
        )}
      </View>

      {/* Price Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Breakdown</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Subtotal</Text>
          <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Delivery Fee</Text>
          <Text style={styles.priceValue}>${deliveryFee.toFixed(2)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Tax (8%)</Text>
          <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
        </View>

        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${calculatedTotal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Delivery Information */}
      {currentOrder.deliveryPerson && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryText}>
              <Text style={styles.deliveryLabel}>Delivery Person: </Text>
              {currentOrder.deliveryPerson.name}
            </Text>
            <Text style={styles.deliveryText}>
              <Text style={styles.deliveryLabel}>Contact: </Text>
              {currentOrder.deliveryPerson.phone}
            </Text>
            <Text style={styles.deliveryText}>
              <Text style={styles.deliveryLabel}>Vehicle: </Text>
              {currentOrder.deliveryPerson.vehicle}
            </Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancelEdit}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default BagDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: appColors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: tailwindColors.gray[200],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FONT_SIZE_MEDUIME,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
  },
  headerRight: {
    width: 32,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: tailwindColors.gray[100],
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: FONT_SIZE_NORMAL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[600],
    marginBottom: 2,
  },
  orderTime: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[500],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: appColors.white,
  },
  estimatedDelivery: {
    backgroundColor: tailwindColors.blue[50],
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: tailwindColors.blue[500],
  },
  estimatedDeliveryText: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.blue[700],
  },
  deliveredInfo: {
    backgroundColor: tailwindColors.green[50],
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: tailwindColors.green[500],
  },
  deliveredText: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.green[700],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FONT_SIZE_NORMAL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
  },
  editButton: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.blue[600],
  },
  addItemsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: tailwindColors.blue[50],
    borderRadius: 8,
  },
  addItemsText: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.blue[600],
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[600],
    marginBottom: 8,
  },
  inputValue: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[800],
    padding: 12,
    backgroundColor: tailwindColors.gray[50],
    borderRadius: 8,
  },
  textInput: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[800],
    padding: 12,
    backgroundColor: tailwindColors.gray[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: tailwindColors.gray[300],
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tailwindColors.gray[100],
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[800],
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[500],
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tailwindColors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: FONT_SIZE_NORMAL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[700],
  },
  quantityText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
    minWidth: 30,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
  emptyItems: {
    padding: 20,
    alignItems: "center",
  },
  emptyItemsText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[500],
    fontStyle: "italic",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[600],
  },
  priceValue: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[700],
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: tailwindColors.gray[300],
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
  },
  totalValue: {
    fontSize: FONT_SIZE_NORMAL,
    fontFamily: fonts["Montserrat-Bold"],
    color: tailwindColors.green[600],
  },
  deliveryInfo: {
    backgroundColor: tailwindColors.gray[50],
    padding: 16,
    borderRadius: 8,
  },
  deliveryText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[700],
    marginBottom: 6,
  },
  deliveryLabel: {
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
  },
  actionSection: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: tailwindColors.green[500],
  },
  saveButtonText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: appColors.white,
  },
  cancelButton: {
    backgroundColor: tailwindColors.gray[200],
  },
  cancelButtonText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[700],
  },
  loadingText: {
    fontSize: FONT_SIZE_NORMAL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[600],
    textAlign: "center",
    marginTop: 50,
  },
});
