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

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

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
        customer: {
          fullName: "Mike Chen",
          phone: "+1122334455",
        },
      },
    ],
  },
  {
    day: "2025 Saturday 07/28",
    data: [
      {
        id: 4,
        orderNumber: "ORD-4378-2025",
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
        customer: {
          fullName: "Emily Davis",
          phone: "+1567890123",
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

  // Render individual order item
  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.bagLogo}>
          <Feather
            name="shopping-bag"
            color={tailwindColors.neutral[500]}
            size={28}
          />
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
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
        {item.status === "on_the_way" && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery Person:</Text>
            <Text style={styles.detailValue}>{item.deliveryPerson.name}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{item.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${item.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Action Buttons */}
<View style={styles.actionButtons}>
  {/* Only show View Details for delivered orders */}
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
      <Text
        style={[
          styles.actionButtonText,
          { color: tailwindColors.gray[600] },
        ]}
      >
        View Details
      </Text>
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
