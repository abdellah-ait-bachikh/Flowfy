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
import { FONT_SIZE_SMALL } from '@/theme/globals';
import pizzaImg from '@/assets/images/pizza.jpg';
import { useRouter } from 'expo-router';

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
    <TouchableOpacity
      style={[styles.card, { width }]}
      activeOpacity={0.8}
      onPress={()=>handelFoodDetailsNavigate(`${item.id}`)}
    >
      {/* Ranking Badge */}
      <View style={styles.rankingBadge}>
        <AppText style={styles.rankingText}>#{item.id}</AppText>
      </View>

      {/* Food Image */}
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
          
          <AppText style={styles.priceText}>MAD {item.price}</AppText>
        </View>

        {/* Add to Bag / Quantity Controls */}
        <View style={styles.cartControls}>
          {quantity === 0 ? (
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={handleAddToBag}
            >
              <AppText style={styles.addButtonText}>Add to Bag</AppText>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 220, // Increased height to accommodate cart controls
    backgroundColor: appColors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: tailwindColors.neutral[800],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: tailwindColors.neutral[100],
  },
  rankingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: tailwindColors.green[500],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 2,
    shadowColor: tailwindColors.neutral[800],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  rankingText: {
    color: appColors.white,
    fontSize: 10,
    fontFamily: fonts['Montserrat-Bold'],
  },
  imageContainer: {
    width: '100%',
    height: 110,
    position: 'relative',
    overflow: 'hidden',
  },
  card_image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  foodName: {
    fontSize: 13,
    fontFamily: fonts['Montserrat-SemiBold'],
    color: tailwindColors.neutral[800],
    marginBottom: 4,
    lineHeight: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    fontSize: 10,
    fontFamily: fonts['Montserrat-Medium'],
    color: tailwindColors.orange[600],
  },
  priceText: {
    fontSize: 14,
    fontFamily: fonts['Montserrat-Bold'],
    color: tailwindColors.green[600],
  },
  cartControls: {
    marginTop: 'auto',
  },
  addButton: {
    backgroundColor: tailwindColors.green[400],
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: appColors.white,
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts['Montserrat-SemiBold'],
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tailwindColors.slate[400],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: appColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: tailwindColors.green[500],
    fontSize: 16,
    fontFamily: fonts['Montserrat-Bold'],
    lineHeight: 18,
  },
  quantityText: {
    color: appColors.white,
    fontSize: 14,
    fontFamily: fonts['Montserrat-Bold'],
    minWidth: 20,
    textAlign: 'center',
  },
});

export default FoodCard;