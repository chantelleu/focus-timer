import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Pressable, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
  icon?: string;
  assignedColor?: string;
  assignedIcon?: IconSymbolName;
  redeemed: boolean;
}

interface RedeemBadgeModalProps {
  isVisible: boolean;
  badge: Badge | null;
  onClose: () => void;
  onRedeem: (badgeId: string) => Promise<boolean>;
}

export const RedeemBadgeModal: React.FC<RedeemBadgeModalProps> = ({
  isVisible,
  badge,
  onClose,
  onRedeem,
}) => {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionMessage, setRedemptionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) {
      // Reset state when modal closes
      setIsRedeeming(false);
      setRedemptionMessage(null);
    }
  }, [isVisible]);

  const handleRedeem = async () => {
    if (!badge || badge.redeemed || isRedeeming) return;

    setIsRedeeming(true);
    setRedemptionMessage(null);

    const success = await onRedeem(badge.id);

    if (success) {
      setRedemptionMessage("Badge successfully redeemed!");
    } else {
      setRedemptionMessage("Failed to redeem badge. It might already be redeemed.");
    }
    setIsRedeeming(false);
  };

  if (!badge) return null; // Don't render if no badge is provided

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          {badge.assignedIcon && (
            <IconSymbol
              name={badge.assignedIcon}
              size={80}
              color={badge.assignedColor || "#FFD700"} // Use assignedColor, fallback to Gold
              style={{ marginBottom: 10 }}
            />
          )}
          <ThemedText style={styles.modalTitle}>{badge.name}</ThemedText>
          <ThemedText style={styles.modalDescription}>{badge.description}</ThemedText>

          {redemptionMessage && (
            <ThemedText style={styles.redemptionMessage}>{redemptionMessage}</ThemedText>
          )}

          {!badge.redeemed && !redemptionMessage && (
            <Pressable
              style={styles.button}
              onPress={handleRedeem}
              disabled={isRedeeming}
            >
              <ThemedText style={styles.buttonText}>Redeem Now</ThemedText>
            </Pressable>
          )}

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <ThemedText style={styles.buttonText}>Close</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#000', // Changed to black
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000', // Changed to black
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
    marginTop: 15,
    width: '80%',
  },
  buttonClose: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#000', // Changed to black
    fontWeight: 'bold',
    textAlign: 'center',
  },
  redemptionMessage: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // Changed to black
  },
});
