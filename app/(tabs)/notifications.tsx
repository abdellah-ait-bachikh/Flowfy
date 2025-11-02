import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SectionList,
} from "react-native";
import React, { useState, useRef } from "react";
import { appColors, tailwindColors } from "@/theme/colors";
import { fonts } from "@/lib/const";
import {
  FONT_SIZE_SMALL,
  FONT_SIZE_EXTRA_SMALL,
  FONT_SIZE_NORMAL,
} from "@/theme/globals";
import { FontAwesome5 } from "@expo/vector-icons";

// Static notifications data grouped by day
const notificationsData = [
  {
    day: "2025 Monday 07/30",
    data: [
      {
        id: 1,
        title: "Order Confirmed",
        description:
          "Your order #12345 has been confirmed and is being prepared.",
        time: "10:30 AM",
        read: false,
      },
      {
        id: 2,
        title: " Special Offer",
        description:
          "Get 20% off on all pizza orders today! Limited time offer.",
        time: "09:15 AM",
        read: true,
      },
      {
        id: 3,
        title: "Delivery Update",
        description: "Your food will arrive in 15-20 minutes. Get ready!",
        time: "08:45 AM",
        read: false,
      },
    ],
  },
  {
    day: "2025 Sunday 07/29",
    data: [
      {
        id: 4,
        title: "Payment Successful",
        description:
          "Your payment of $25.99 for order #12344 has been processed.",
        time: "07:20 PM",
        read: true,
      },
      {
        id: 5,
        title: "New Restaurant",
        description:
          "Check out our new partner restaurant 'Sushi Palace' now available!",
        time: "03:45 PM",
        read: true,
      },
      {
        id: 6,
        title: "Rating Reminder",
        description:
          "How was your recent order? Rate your experience and help us improve.",
        time: "01:30 PM",
        read: false,
      },
      {
        id: 7,
        title: "Weekly Summary",
        description: "You saved $12.50 this week with our loyalty program!",
        time: "10:00 AM",
        read: true,
      },
    ],
  },
  {
    day: "2025 Saturday 07/28",
    data: [
      {
        id: 8,
        title: "Order Delivered",
        description:
          "Your order has been successfully delivered. Enjoy your meal!",
        time: "08:15 PM",
        read: true,
      },
      {
        id: 9,
        title: "Promo Code",
        description:
          "Use code WELCOME15 for 15% off your next order. Valid for 7 days.",
        time: "11:30 AM",
        read: true,
      },
    ],
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [stickyHeader, setStickyHeader] = useState(notificationsData[0]?.day || "");
  const sectionListRef = useRef<SectionList>(null);

  const handleRemoveNotification = (
    dayIndex: number,
    notificationId: number
  ) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[dayIndex].data = updatedNotifications[
      dayIndex
    ].data.filter(
      (notification) => notification.id !== notificationId
    );

    // Remove day group if no notifications left
    if (updatedNotifications[dayIndex].data.length === 0) {
      updatedNotifications.splice(dayIndex, 1);
    }

    setNotifications(updatedNotifications);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setStickyHeader("");
  };

  const markAsRead = (dayIndex: number, notificationId: number) => {
    const updatedNotifications = [...notifications];
    const dayData = updatedNotifications[dayIndex];
    const notification = dayData.data.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    setNotifications(updatedNotifications);
  };

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const scrollY = contentOffset.y;
    
    // Find which section is currently at the top
    let currentSection = "";
    let accumulatedHeight = 0;

    for (const section of notifications) {
      const sectionHeight = 60 + (section.data.length * 100); // Approximate heights
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

  // Render individual notification item
  const renderNotification = ({ item, section }: { item: any; section: any }) => {
    const dayIndex = notifications.findIndex(day => day.day === section.day);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.read && styles.unreadNotification,
        ]}
        onPress={() => markAsRead(dayIndex, item.id)}
      >
        {/* Unread indicator */}
        {!item.read && (
          <View style={styles.unreadIndicator} />
        )}

        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>
            {item.title}
          </Text>
          <Text style={styles.notificationDescription}>
            {item.description}
          </Text>
          <Text style={styles.notificationTime}>
            {item.time}
          </Text>
        </View>

        {/* Trash icon for deletion */}
        <TouchableOpacity
          style={styles.trashButton}
          onPress={() => handleRemoveNotification(dayIndex, item.id)}
        >
          <FontAwesome5 name="trash-alt" color={tailwindColors.red[600]} size={14} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Render section header
  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.dayHeader}>
      <View style={styles.borderLine} />
      <Text style={styles.dayHeaderText}>{section.day}</Text>
      <View style={styles.borderLine} />
    </View>
  );

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Notifications</Text>
      <Text style={styles.emptyStateText}>
        You're all caught up! New notifications will appear here.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Clear All button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sticky header */}
      {stickyHeader && notifications.length > 0 && (
        <View style={styles.stickyHeader}>
          <View style={styles.borderLine} />
          <Text style={styles.stickyHeaderText}>{stickyHeader}</Text>
          <View style={styles.borderLine} />
        </View>
      )}

      <SectionList
        ref={sectionListRef}
        sections={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        renderSectionHeader={renderSectionHeader}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={renderEmptyState}
        stickySectionHeadersEnabled={false} // We handle sticky headers manually
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,

    borderBottomColor: tailwindColors.gray[200],
    // backgroundColor: appColors.white,
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: FONT_SIZE_NORMAL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: tailwindColors.red[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tailwindColors.red[200],
  },
  clearButtonText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.red[600],
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
    top: 60, // Below the main header
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
  flatListContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
    paddingTop: 50, // Space for sticky header
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
  dayGroup: {
    marginBottom: 24,
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
  notificationCard: {
    backgroundColor: appColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: tailwindColors.gray[200],
    position: "relative",
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: tailwindColors.amber[500],
    backgroundColor: tailwindColors.amber[50],
  },
  unreadIndicator: {
    position: "absolute",
    top: 16,
    left: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tailwindColors.amber[500],
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.gray[800],
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[600],
    lineHeight: 16,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
    color: tailwindColors.gray[400],
  },
  trashButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: tailwindColors.red[50],
    borderWidth: 1,
    borderColor: tailwindColors.red[200],
  },
});