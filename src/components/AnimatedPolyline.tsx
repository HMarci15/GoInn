import React, { useEffect } from "react";
import { Polyline } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const AnimatedPolylineComponent = Animated.createAnimatedComponent(Polyline);

type Props = {
  points: string[];
  duration?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

const AnimatedPolyline: React.FC<Props> = ({
  points,
  duration = 2000,
  strokeColor = "red",
  strokeWidth = 2,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration });
  }, [points]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDasharray: [1000, 1000],
      strokeDashoffset: 1000 - 1000 * progress.value,
    };
  });

  return (
    <AnimatedPolylineComponent
      points={points.join(" ")}
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      animatedProps={animatedProps}
    />
  );
};

export default AnimatedPolyline;
