import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POINTS_KEY = 'focus-timer-points';

export function usePoints() {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const loadPoints = async () => {
      try {
        const storedPoints = await AsyncStorage.getItem(POINTS_KEY);
        if (storedPoints !== null) {
          setPoints(JSON.parse(storedPoints));
        }
      } catch (error) {
        console.error("Error loading points", error);
      }
    };
    loadPoints();
  }, []);

  const awardPoints = async (amount: number) => {
    setPoints((prevPoints) => {
      const newPoints = prevPoints + amount;
      AsyncStorage.setItem(POINTS_KEY, JSON.stringify(newPoints));
      return newPoints;
    });
  };

  return { points, awardPoints };
}
