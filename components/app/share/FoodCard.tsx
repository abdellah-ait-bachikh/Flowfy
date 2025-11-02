import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppText from '@/components/app/share/AppText';
import { fonts } from '@/lib/const';
import { appColors, tailwindColors } from '@/theme/colors';
import { 
  FONT_SIZE_SMALL, 
  FONT_SIZE_EXTRA_SMALL,
  FONT_SIZE_NORMAL,
  BORDER_RADIUS, 
  FONT_SIZE_CARD_TITLE,
  FONT_SIZE_RATING,
  FONT_SIZE_PRICE,
  FONT_SIZE_XSMALL,
  FONT_SIZE_QUANTITY,
  FONT_SIZE_QUANTITY_BUTTON
} from '@/theme/globals';
import pizzaImg from '@/assets/images/pizza.jpg';
import defaultRestaurantLogo from '@/assets/images/icons/default-restaurant-logo.png';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface FoodItem {
  id: number;
  name: string;
  price: string;
  rating: string;
}

interface FoodCardProps {
  item: FoodItem;
  width?: number;
}


const FoodCard: React.FC<FoodCardProps> = ({ item, width = 160 }) => {
  const [quantity, setQuantity] = useState<number>(0);
  const router = useRouter()
  const {t} = useTranslation()
  const handleAddToBag = (): void => {
    setQuantity(1);
  };

  const handleIncrement = (): void => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = (): void => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  };
 const handelFoodDetailsNavigate = (id: string) => {
    router.push({ pathname: "/restaurants/foods/[id]", params: { id } });
  };
  return (
    <View style={[styles.card, { width }]}>
      {/* Touchable for navigation - covers image and content but not cart controls */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>handelFoodDetailsNavigate(`${item.id}`)}
        style={styles.touchableArea}
      >
    

        {/* Restaurant Logo */}
        <View style={styles.logoContainer}>
          <Image
          source={defaultRestaurantLogo}
     
            resizeMode="cover"
            style={styles.logoImage}
          />
        </View>

        {/* Food Image with padding */}
        <View style={styles.imageContainer}>
          <Image
            source={pizzaImg}
            resizeMode="cover"
            style={styles.card_image}
          />
          <View style={styles.imageOverlay} />
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          <AppText style={styles.foodName} numberOfLines={2}>
            {item.name}
          </AppText>

          <View style={styles.bottomRow}>
            <View style={styles.rating}>
              <AppText style={styles.ratingText}>⭐ {item.rating}</AppText>
            </View>
            
            <AppText style={styles.priceText} numberOfLines={2}>
              <AppText style={styles.currencyText}>{t('components.cards.food-card.currency')}
 </AppText>
              {item.price}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>

      {/* Add to Bag / Quantity Controls - Separate from navigation */}
      <View style={styles.cartControls}>
        {quantity === 0 ? (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddToBag}
          >
            <AppText style={styles.addButtonText}>{t('components.cards.food-card.add_to_bag')}
</AppText>
          </TouchableOpacity>
        ) : (
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={handleDecrement}
            >
              <AppText style={styles.quantityButtonText}>-</AppText>
            </TouchableOpacity>
            
            <AppText style={styles.quantityText}>{quantity}</AppText>
            
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={handleIncrement}
            >
              <AppText style={styles.quantityButtonText}>+</AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 230,
    backgroundColor: appColors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: tailwindColors.neutral[100],
  },
  touchableArea: {
    flex: 1, // Take all available space except cart controls
  },
 
  logoContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: appColors.white,
    zIndex: 2,
    shadowColor: tailwindColors.neutral[800],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: tailwindColors.neutral[500],
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  card_image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  foodName: {
    fontSize: FONT_SIZE_CARD_TITLE, // 13
    fontFamily: fonts['Montserrat-SemiBold'],
    color: tailwindColors.neutral[800],
    marginBottom: 4,
    lineHeight: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: "auto"
  },
  rating: {
    backgroundColor: tailwindColors.yellow[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: tailwindColors.yellow[200],
  },
  ratingText: {
    fontSize: FONT_SIZE_RATING, // 10
    fontFamily: fonts['Montserrat-Medium'],
    color: tailwindColors.orange[600],
  },
  priceText: {
    fontSize: FONT_SIZE_PRICE, // 14
    fontFamily: fonts['Montserrat-Bold'],
    color: tailwindColors.green[600],
  },
  currencyText: {
    fontSize: FONT_SIZE_XSMALL, // 8
    fontFamily: fonts['Montserrat-Bold'],
    color: tailwindColors.green[600],
  },
  cartControls: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  addButton: {
    backgroundColor: tailwindColors.green[400],
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: appColors.white,
    fontSize: FONT_SIZE_SMALL, // 14
    fontFamily: fonts['Montserrat-SemiBold'],
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tailwindColors.slate[400],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: appColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: tailwindColors.green[500],
    fontSize: FONT_SIZE_QUANTITY_BUTTON, // 14
    fontFamily: fonts['Montserrat-Bold'],
    lineHeight: 16,
  },
  quantityText: {
    color: appColors.white,
    fontSize: FONT_SIZE_QUANTITY, // 12
    fontFamily: fonts['Montserrat-Bold'],
    minWidth: 18,
    textAlign: 'center',
  },
});

export default FoodCard;