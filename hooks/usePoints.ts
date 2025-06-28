
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POINTS_KEY = 'focus-timer-points';

export function usePoints() {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const getPoints = async () => {
      try {
        const storedPoints = await AsyncStorage.getItem(POINTS_KEY);
        if (storedPoints !== null) {
          setPoints(JSON.parse(storedPoints));
        }
      } catch (error) {
        console.error("Error loading points", error);
      }
    };

    getPoints();
  }, []);

  const awardPoints = async (newPoints: number) => {
    try {
      const updatedPoints = points + newPoints;
      setPoints(updatedPoints);
      await AsyncStorage.setItem(POINTS_KEY, JSON.stringify(updatedPoints));
    } catch (error) {
      console.error("Error saving points", error);
    }
  };

  return { points, awardPoints };
}
