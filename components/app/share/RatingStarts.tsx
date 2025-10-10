import React from "react";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type RatingStarsProps = {
  rating: number;
};

const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FontAwesome
        key={`full-${i}`}
        name="star"
        size={14}
        color="#facc15" // yellow-400
      />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <FontAwesome
        key="half"
        name="star-half-empty"
        size={14}
        color="#facc15"
      />
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FontAwesome
        key={`empty-${i}`}
        name="star-o"
        size={14}
        color="#facc15"
      />
    );
  }

  return <View style={{ flexDirection: "row", gap: 2 }}>{stars}</View>;
};

export default RatingStars;
