import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  Linking,
} from "react-native";
import React, { useState, useRef } from "react";
import { appColors, tailwindColors } from "@/theme/colors";
import { fonts } from "@/lib/const";
import {
  FONT_SIZE_SMALL,
  FONT_SIZE_EXTRA_SMALL,
  FONT_SIZE_NORMAL,
  FONT_SIZE_MEDUIME,
} from "@/theme/globals";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import AppText from "@/components/app/share/AppText";

interface BaseOrderItem {
  id: number;
  name: string;
  price?: number;
}

interface QuantityOrderItem extends BaseOrderItem {
  type: "quantity";
  quantity: number;
  price: number;
}

interface WeightOrderItem extends BaseOrderItem {
  type: "weight";
  weight: number;
}

type OrderItem = QuantityOrderItem | WeightOrderItem;

interface BaseOrder {
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
}

interface ActiveOrder extends BaseOrder {
  status: "preparing" | "on_the_way";
  estimatedDelivery: string;
  deliveryPerson: {
    name: string;
    phone: string;
    vehicle: string;
  };
}

interface DeliveredOrder extends BaseOrder {
  status: "delivered";
  deliveredTime: string;
}

type Order = ActiveOrder | DeliveredOrder;

interface OrderSection {
  day: string;
  data: Order[];
}

export const bagData = [
  {
    day: "2025 Monday 07/30",
    data: [
      {
        id: 1,
        orderNumber: "ORD-7842-2025",
        status: "preparing",
        statusText: "Preparing your order",
        restaurant: "Fresh Market",
        restaurantLogo: "🛒",
        items: [
          { id: 1, name: "Margherita Pizza", type: "quantity", quantity: 1, price: 12.99 },
          { id: 2, name: "Fresh Apples", type: "weight", weight: 1.5 },
          { id: 3, name: "Coca Cola", type: "quantity", quantity: 1, price: 2.49 },
          { id: 4, name: "Tomatoes", type: "weight", weight: 0.75 },
        ],
        total: 25.46,
        orderTime: "10:30 AM",
        estimatedDelivery: "11:30 AM",
        address: "123 Main St, Apartment 4B",
        customer: {
          fullName: "John Smith",
          phone: "+1234567890",
        },
        deliveryPerson: {
          name: "John Doe",
          phone: "+1234567890",
          vehicle: "Motorcycle",
        },
      },
      {
        id: 2,
        orderNumber: "ORD-9153-2025",
        status: "on_the_way",
        statusText: "On the way",
        restaurant: "Burger King",
        restaurantLogo: "🍔",
        items: [
          { id: 1, name: "Whopper Burger", type: "quantity", quantity: 2, price: 8.99 },
          { id: 2, name: "French Fries", type: "quantity", quantity: 1, price: 3.49 },
          { id: 3, name: "Chocolate Shake", type: "quantity", quantity: 1, price: 4.99 },
        ],
        total: 26.46,
        orderTime: "09:15 AM",
        estimatedDelivery: "10:00 AM",
        address: "123 Main St, Apartment 4B",
        customer: {
          fullName: "Sarah Johnson",
          phone: "+1987654321",
        },
        deliveryPerson: {
          name: "Mike Johnson",
          phone: "+1987654321",
          vehicle: "Bicycle",
        },
      },
    ],
  },
  {
    day: "2025 Sunday 07/29",
    data: [
      {
        id: 3,
        orderNumber: "ORD-6291-2025",
        status: "delivered",
        statusText: "Delivered",
        restaurant: "Mixed Basket",
        restaurantLogo: "🛍️",
        items: [
          { id: 1, name: "Chicken Breast", type: "weight", weight: 1.2 },
          { id: 2, name: "Onions", type: "weight", weight: 1.0 },
          { id: 3, name: "Energy Drink", type: "quantity", quantity: 1, price: 2.99 },
          { id: 4, name: "Bell Peppers", type: "weight", weight: 0.8 },
          { id: 5, name: "Chips", type: "quantity", quantity: 3, price: 1.49 },
        ],
        total: 27.93,
        orderTime: "07:20 PM",
        deliveredTime: "08:05 PM",
        address: "123 Main St, Apartment 4B",
        customer: {
          fullName: "Mike Chen",
          phone: "+1122334455",
        },
      },
      {
        id: 4,
        orderNumber: "ORD-4378-2025",
        status: "delivered",
        statusText: "Delivered",
        restaurant: "Pizza Hut",
        restaurantLogo: "🍕",
        items: [
          { id: 1, name: "Pepperoni Pizza", type: "quantity", quantity: 1, price: 14.99 },
          { id: 2, name: "Garlic Bread", type: "quantity", quantity: 2, price: 5.99 },
          { id: 3, name: "Coca Cola", type: "quantity", quantity: 2, price: 2.49 },
        ],
        total: 31.95,
        orderTime: "06:45 PM",
        deliveredTime: "07:30 PM",
        address: "123 Main St, Apartment 4B",
        customer: {
          fullName: "Emily Davis",
          phone: "+1567890123",
        },
      },
    ],
  },
  {
    day: "2025 Saturday 07/28",
    data: [
      {
        id: 5,
        orderNumber: "ORD-5567-2025",
        status: "delivered",
        statusText: "Delivered",
        restaurant: "Farmers Market",
        restaurantLogo: "🌾",
        items: [
          { id: 1, name: "Strawberries", type: "weight", weight: 1.0 },
          { id: 2, name: "Blueberries", type: "weight", weight: 0.5 },
          { id: 3, name: "Raspberries", type: "weight", weight: 0.3 },
          { id: 4, name: "Mixed Greens", type: "weight", weight: 0.4 },
        ],
        total: 32.15,
        orderTime: "02:30 PM",
        deliveredTime: "03:15 PM",
        address: "123 Main St, Apartment 4B",
        customer: {
          fullName: "David Wilson",
          phone: "+1678901234",
        },
      },
      {
        id: 6,
        orderNumber: "ORD-7789-2025",
        status: "delivered",
        statusText: "Delivered",
        restaurant: "KFC",
        restaurantLogo: "🍗",
        items: [
          { id: 1, name: "Bucket Chicken", type: "quantity", quantity: 1, price: 19.99 },
          { id: 2, name: "Coleslaw", type: "quantity", quantity: 2, price: 2.99 },
          { id: 3, name: "Biscuits", type: "quantity", quantity: 4, price: 1.49 },
        ],
        total: 29.93,
        orderTime: "05:20 PM",
        deliveredTime: "06:10 PM",
        address: "123 Main St, Apartment 4B",
        customer: {
          fullName: "Lisa Brown",
          phone: "+1789012345",
        },
      },
    ],
  },
  {
    day: "2025 Friday 07/27",
    data: [
      {
        id: 7,
        orderNumber: "ORD-8890-2025",
        status: "delivered",
        statusText: "Delivered",
        restaurant: "Organic Groceries",
        restaurantLogo: "🥦",
        items: [
          { id: 1, name: "Bananas", type: "weight", weight: 2.0 },
          { id: 2, name: "Carrots", type: "weight", weight: 0.5 },
          { id: 3, name: "Potatoes", type: "weight", weight: 3.0 },
          { id: 4, name: "French Bread", type: "quantity", quantity: 2, price: 3.99 },
        ],
        total: 17.47,
        orderTime: "11:30 AM",
        deliveredTime: "12:15 PM",
        address: "123 Main St, Apartment 4B",
        customer: {
          fullName: "Alex Turner",
          phone: "+1456789012",
        },
      },
      {
        id: 8,
        orderNumber: "ORD-9921-2025",
        status: "delivered",
        statusText: "Delivered",
        restaurant: "Starbucks",
        restaurantLogo: "☕",
        items: [
          { id: 1, name: "Caramel Macchiato", type: "quantity", quantity: 1, price: 5.45 },
          { id: 2, name: "Blueberry Muffin", type: "quantity", quantity: 2, price: 3.25 },
          { id: 3, name: "Iced Coffee", type: "quantity", quantity: 1, price: 4.75 },
        ],
        total: 16.70,
        orderTime: "08:15 AM",
        deliveredTime: "08:45 AM",
        address: "123 Main St, Apartment 4B",
        customer: {
          fullName: "Maria Garcia",
          phone: "+1345678901",
        },
      },
    ],
  },
];

const Bag = () => {
  const [orders, setOrders] = useState(bagData);
  const [stickyHeader, setStickyHeader] = useState(orders[0]?.day || "");
  const sectionListRef = useRef<SectionList>(null);
  const router = useRouter();

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "preparing":
        return "⏳";
      case "on_the_way":
        return "🚗";
      case "delivered":
        return "✅";
      default:
        return "📦";
    }
  };

  const formatItemDisplay = (item: OrderItem) => {
    if (item.type === "quantity") {
      return `${item.quantity}x`;
    } else {
      return `${item.weight}kg`;
    }
  };

  const formatItemPrice = (item: OrderItem) => {
    if (item.type === "quantity") {
      return `$${item.price.toFixed(2)}`;
    } else {
      return "Price at checkout";
    }
  };

  const hasWeightItems = (items: OrderItem[]) => {
    return items.some(item => item.type === "weight");
  };

  const getTotalDescription = (items: OrderItem[]) => {
    const hasWeight = hasWeightItems(items);
    const hasQuantity = items.some(item => item.type === "quantity");
    
    if (hasWeight && hasQuantity) {
      return "Includes fixed prices + weight-based calculations";
    } else if (hasWeight) {
      return "Total based on actual weight at checkout";
    } else {
      return "All items with fixed prices";
    }
  };

  const getTotalStyle = (items: OrderItem[]) => {
    const hasWeight = hasWeightItems(items);
    
    if (hasWeight) {
      return styles.totalNoteWeight;
    } else {
      return styles.totalNoteFixed;
    }
  };

  const handleReorder = (orderId: number) => {
    console.log("Reorder order:", orderId);
  };

  const handleCallDeliveryPerson = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.log("Error opening phone dialer:", err)
    );
  };

  const handleViewDetails = (order: Order) => {
    router.push({ pathname: "/(tabs)/bag/[id]", params: { id: order.id } });
  };

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const scrollY = contentOffset.y;

    let currentSection = "";
    let accumulatedHeight = 0;

    for (const section of orders) {
      const sectionHeight = 60 + section.data.length * 200;
      if (scrollY <= accumulatedHeight + sectionHeight) {
        currentSection = section.day;
        break;
      }
      accumulatedHeight += sectionHeight;
    }

    if (currentSection && currentSection !== stickyHeader) {
      setStickyHeader(currentSection);
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const hasWeight = hasWeightItems(item.items);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.bagLogo}>
            <Feather
              name="shopping-bag"
              color={tailwindColors.neutral[500]}
              size={28}
            />
            <View>
              <AppText style={styles.orderNumber}>{item.orderNumber}</AppText>
              <AppText style={styles.orderTime}>{item.orderTime}</AppText>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <AppText style={styles.statusIcon}>{getStatusIcon(item.status)}</AppText>
            <AppText style={styles.statusText}>{item.statusText}</AppText>
          </View>
        </View>

        <View style={styles.itemsContainer}>
          {item.items.map((orderItem: OrderItem) => (
            <View key={orderItem.id} style={styles.itemRow}>
              <View style={styles.itemNameContainer}>
                <AppText style={styles.itemName}>{orderItem.name}</AppText>
                {orderItem.type === "weight" && (
                  <AppText style={styles.variablePriceNote}>
                    • Price calculated by weight
                  </AppText>
                )}
              </View>
              
              <View style={styles.quantityWeightContainer}>
                <View style={[
                  styles.quantityWeightBadge,
                  orderItem.type === "weight" ? styles.weightBadge : styles.quantityBadge
                ]}>
                  <AppText style={styles.quantityWeightText}>
                    {formatItemDisplay(orderItem)}
                  </AppText>
                </View>
              </View>

              <AppText style={[
                styles.itemPrice,
                orderItem.type === "weight" && styles.variablePriceText
              ]}>
                {formatItemPrice(orderItem)}
              </AppText>
            </View>
          ))}
        </View>

        <View style={styles.orderDetails}>
          {item.status === "on_the_way" && (
            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel}>Delivery Person:</AppText>
              <AppText style={styles.detailValue}>{item.deliveryPerson.name}</AppText>
            </View>
          )}

          <View style={styles.detailRow}>
            <AppText style={styles.detailLabel}>Address:</AppText>
            <AppText style={styles.detailValue}>{item.address}</AppText>
          </View>

          <View style={styles.detailRow}>
            <AppText style={styles.detailLabel}>Total:</AppText>
            <View style={styles.totalContainer}>
              <AppText style={styles.totalPrice}>${item.total.toFixed(2)}</AppText>
              <View style={[
                styles.totalNoteContainer,
                hasWeight ? styles.totalNoteWeightContainer : styles.totalNoteFixedContainer
              ]}>
                <Ionicons 
                  name={hasWeight ? "scale-outline" : "pricetag-outline"} 
                  size={12} 
                  color={hasWeight ? tailwindColors.orange[500] : tailwindColors.green[500]} 
                />
                <AppText style={getTotalStyle(item.items)}>
                  {getTotalDescription(item.items)}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {item.status === "delivered" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.detailsButton]}
              onPress={() => handleViewDetails(item)}
            >
              <Ionicons
                name="document-text-outline"
                size={16}
                color={tailwindColors.gray[600]}
              />
              <AppText
                style={[
                  styles.actionButtonText,
                  { color: tailwindColors.gray[600] },
                ]}
              >
                View Details
              </AppText>
            </TouchableOpacity>
          )}

          {item.status === "delivered" ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.reorderButton]}
              onPress={() => handleReorder(item.id)}
            >
              <Ionicons
                name="refresh"
                size={16}
                color={tailwindColors.green[600]}
              />
              <AppText
                style={[
                  styles.actionButtonText,
                  { color: tailwindColors.green[600] },
                ]}
              >
                Reorder
              </AppText>
            </TouchableOpacity>
          ) : (
            item.deliveryPerson?.phone && (
              <TouchableOpacity
                style={[styles.actionButton, styles.callButton]}
                onPress={() =>
                  handleCallDeliveryPerson(item.deliveryPerson.phone)
                }
              >
                <Ionicons
                  name="call"
                  size={16}
                  color={tailwindColors.blue[600]}
                />
                <AppText
                  style={[
                    styles.actionButtonText,
                    { color: tailwindColors.blue[600] },
                  ]}
                >
                  Call Delivery
                </AppText>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.dayHeader}>
      <View style={styles.borderLine} />
      <AppText style={styles.dayHeaderText}>{section.day}</AppText>
      <View style={styles.borderLine} />
    </View>
  );

  const allOrders = (orders as OrderSection[]).flatMap(
    (section) => section.data
  );
  const activeOrders = allOrders.filter(
    (order): order is ActiveOrder => order.status !== "delivered"
  );
  const pastOrders = allOrders.filter(
    (order): order is DeliveredOrder => order.status === "delivered"
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>My Orders</AppText>
        <AppText style={styles.orderCount}>
          {activeOrders.length} Active, {pastOrders.length} Delivered
        </AppText>
      </View>

      {stickyHeader && orders.length > 0 && (
        <View style={styles.stickyHeader}>
          <View style={styles.borderLine} />
          <AppText style={styles.stickyHeaderText}>{stickyHeader}</AppText>
          <View style={styles.borderLine} />
        </View>
      )}

      <SectionList
        ref={sectionListRef}
        sections={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        renderSectionHeader={renderSectionHeader}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sectionListContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppText style={styles.emptyStateTitle}>No Orders Yet</AppText>
            <AppText style={styles.emptyStateText}>
              Your orders will appear here once you place an order.
            </AppText>
          </View>
        }
        stickySectionHeadersEnabled={false}
       ListHeaderComponent={
  <View style={styles.pricingInfoCard}>
    <View style={styles.pricingInfoContent}>
      <Ionicons name="information-circle-outline" size={20} color={tailwindColors.blue[500]} />
      <View style={styles.pricingInfoText}>
        <AppText style={styles.pricingInfoTitle}>About Weight-Based Items</AppText>
        <AppText style={styles.pricingInfoDescription}>
          Items sold by weight (fruits, vegetables, meat) have variable pricing. The final price is calculated when your order is prepared based on the actual weight. You'll see the exact total when the delivery arrives.
          {"\n\n"}
          If your order contains only fixed-price items, you'll see the exact total price that you'll pay upfront.
        </AppText>
      </View>
    </View>
  </View>

        }
      />
    </View>
  );
};

export default Bag;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: FONT_SIZE_MEDUIME,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
  },
  orderCount: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[500],
    marginTop: 4,
  },
  pricingInfoCard: {
    backgroundColor: tailwindColors.blue[50],
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 45,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: tailwindColors.blue[200],
  },
  pricingInfoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pricingInfoText: {
    flex: 1,
  },
  pricingInfoTitle: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.blue[800],
    marginBottom: 4,
  },
  pricingInfoDescription: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.blue[700],
    lineHeight: 16,
  },
  stickyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: tailwindColors.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: tailwindColors.gray[200],
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  stickyHeaderText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[700],
    marginHorizontal: 12,
  },
  sectionListContent: {
    flexGrow: 1,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 24,
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[500],
    marginHorizontal: 12,
  },
  borderLine: {
    flex: 1,
    height: 1,
    backgroundColor: tailwindColors.gray[300],
  },
  orderCard: {
    backgroundColor: appColors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: tailwindColors.gray[200],
    shadowColor: tailwindColors.gray[900],
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  bagLogo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  orderNumber: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
  },
  orderTime: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[500],
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: appColors.white,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 4,
  },
  itemNameContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[700],
  },
  variablePriceNote: {
    fontSize: 9,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.orange[500],
    marginTop: 2,
  },
  quantityWeightContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  quantityWeightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
  },
  quantityBadge: {
    backgroundColor: tailwindColors.blue[50],
    borderWidth: 1,
    borderColor: tailwindColors.blue[200],
  },
  weightBadge: {
    backgroundColor: tailwindColors.orange[50],
    borderWidth: 1,
    borderColor: tailwindColors.orange[200],
  },
  quantityWeightText: {
    fontSize: 10,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[700],
  },
  itemPrice: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
    textAlign: "right",
    minWidth: 80,
  },
  variablePriceText: {
    color: tailwindColors.orange[500],
    fontStyle: "italic",
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: tailwindColors.gray[200],
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[600],
  },
  detailValue: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[700],
    textAlign: "right",
    flex: 1,
    marginLeft: 8,
  },
  totalContainer: {
    alignItems: "flex-end",
  },
  totalPrice: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Bold"],
    color: tailwindColors.green[600],
  },
  totalNoteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  totalNoteFixedContainer: {
    backgroundColor: tailwindColors.green[50],
    borderWidth: 1,
    borderColor: tailwindColors.green[200],
  },
  totalNoteWeightContainer: {
    backgroundColor: tailwindColors.orange[50],
    borderWidth: 1,
    borderColor: tailwindColors.orange[200],
  },
  totalNoteFixed: {
    fontSize: 9,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.green[700],
  },
  totalNoteWeight: {
    fontSize: 9,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.orange[700],
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  detailsButton: {
    borderColor: tailwindColors.gray[300],
    backgroundColor: tailwindColors.gray[50],
  },
  callButton: {
    borderColor: tailwindColors.blue[200],
    backgroundColor: tailwindColors.blue[50],
  },
  reorderButton: {
    borderColor: tailwindColors.green[200],
    backgroundColor: tailwindColors.green[50],
  },
  actionButtonText: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZE_NORMAL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[600],
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[500],
    textAlign: "center",
    lineHeight: 20,
  },
});