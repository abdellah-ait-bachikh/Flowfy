import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
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
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface BaseOrder {
  id: number;
  status: string;
  statusText: string;
  restaurant: string;
  restaurantLogo: string;
  items: OrderItem[];
  total: number;
  orderTime: string;
  address: string;
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

const bagData = [
  {
    day: "2025 Monday 07/30",
    data: [
      {
        id: 1,
        status: "preparing",
        statusText: "Preparing your order",
        restaurant: "Pizza Palace",
        restaurantLogo: "🍕",
        items: [
          { id: 1, name: "Margherita Pizza", quantity: 1, price: 12.99 },
          { id: 2, name: "Garlic Bread", quantity: 2, price: 4.99 },
          { id: 3, name: "Coca Cola", quantity: 1, price: 2.49 },
        ],
        total: 25.46,
        orderTime: "10:30 AM",
        estimatedDelivery: "11:30 AM",
        address: "123 Main St, Apartment 4B",
        deliveryPerson: {
          name: "John Doe",
          phone: "+1234567890",
          vehicle: "Motorcycle",
        },
      },
      {
        id: 2,
        status: "on_the_way",
        statusText: "On the way",
        restaurant: "Burger Hub",
        restaurantLogo: "🍔",
        items: [
          { id: 1, name: "Double Cheeseburger", quantity: 1, price: 8.99 },
          { id: 2, name: "French Fries", quantity: 1, price: 3.49 },
          { id: 3, name: "Chocolate Shake", quantity: 1, price: 4.99 },
        ],
        total: 17.47,
        orderTime: "09:15 AM",
        estimatedDelivery: "10:00 AM",
        address: "123 Main St, Apartment 4B",
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
        status: "delivered",
        statusText: "Delivered",
        restaurant: "Sushi Express",
        restaurantLogo: "🍣",
        items: [
          { id: 1, name: "California Roll", quantity: 2, price: 6.99 },
          { id: 2, name: "Salmon Nigiri", quantity: 4, price: 3.99 },
          { id: 3, name: "Miso Soup", quantity: 1, price: 2.99 },
        ],
        total: 27.93,
        orderTime: "07:20 PM",
        deliveredTime: "08:05 PM",
        address: "123 Main St, Apartment 4B",
      },
    ],
  },
  {
    day: "2025 Saturday 07/28",
    data: [
      {
        id: 4,
        status: "delivered",
        statusText: "Delivered",
        restaurant: "Taco Fiesta",
        restaurantLogo: "🌮",
        items: [
          { id: 1, name: "Beef Tacos", quantity: 3, price: 3.49 },
          { id: 2, name: "Guacamole", quantity: 1, price: 2.99 },
          { id: 3, name: "Churros", quantity: 2, price: 4.99 },
        ],
        total: 20.44,
        orderTime: "06:45 PM",
        deliveredTime: "07:30 PM",
        address: "123 Main St, Apartment 4B",
      },
    ],
  },
];

const Bag = () => {
  const [orders, setOrders] = useState(bagData);
  const [stickyHeader, setStickyHeader] = useState(orders[0]?.day || "");
  const sectionListRef = useRef<SectionList>(null);

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

  const handleReorder = (orderId: number) => {
    console.log("Reorder order:", orderId);
  };

  const handleCallDeliveryPerson = (phoneNumber: string) => {
    // Open phone dialer with the delivery person's number
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.log("Error opening phone dialer:", err)
    );
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

  // Render individual order item
  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantLogo}>{item.restaurantLogo}</Text>
          <View>
            <Text style={styles.restaurantName}>{item.restaurant}</Text>
            <Text style={styles.orderTime}>{item.orderTime}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
          <Text style={styles.statusText}>{item.statusText}</Text>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.itemsContainer}>
        {item.items.map((orderItem: any) => (
          <View key={orderItem.id} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {orderItem.quantity}x {orderItem.name}
            </Text>
            <Text style={styles.itemPrice}>${orderItem.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Order Details */}
      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${item.total.toFixed(2)}</Text>
        </View>

        {item.status === "on_the_way" && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery Person:</Text>
              <Text style={styles.detailValue}>{item.deliveryPerson.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vehicle:</Text>
              <Text style={styles.detailValue}>
                {item.deliveryPerson.vehicle}
              </Text>
            </View>
          </>
        )}

        {item.status === "delivered" && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivered:</Text>
            <Text style={styles.detailValue}>{item.deliveredTime}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{item.address}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
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
            <Text
              style={[
                styles.actionButtonText,
                { color: tailwindColors.green[600] },
              ]}
            >
              Reorder
            </Text>
          </TouchableOpacity>
        ) : (
          // Show call button for preparing and on_the_way orders
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
              <Text
                style={[
                  styles.actionButtonText,
                  { color: tailwindColors.blue[600] },
                ]}
              >
                Call Delivery
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );

  // Render section header
  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.dayHeader}>
      <View style={styles.borderLine} />
      <Text style={styles.dayHeaderText}>{section.day}</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.orderCount}>
          {activeOrders.length} Active, {pastOrders.length} Delivered
        </Text>
      </View>

      {/* Sticky header */}
      {stickyHeader && orders.length > 0 && (
        <View style={styles.stickyHeader}>
          <View style={styles.borderLine} />
          <Text style={styles.stickyHeaderText}>{stickyHeader}</Text>
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
            <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
            <Text style={styles.emptyStateText}>
              Your orders will appear here once you place an order.
            </Text>
          </View>
        }
        stickySectionHeadersEnabled={false}
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
    paddingHorizontal: 16,
    flexGrow: 1,
    paddingTop: 70,
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
  },
  restaurantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  restaurantLogo: {
    fontSize: 24,
    marginRight: 12,
  },
  restaurantName: {
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
    marginBottom: 6,
  },
  itemName: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[700],
    flex: 1,
  },
  itemPrice: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
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
  totalPrice: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Bold"],
    color: tailwindColors.green[600],
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
