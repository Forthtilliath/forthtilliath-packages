/* eslint-disable @typescript-eslint/no-deprecated -- react-native-gesture-handler recommends the Reanimated version of Swipeable instead; migrating is a separate, larger change (extra peer dep, different API) than extracting this component as-is. */
import type { ReactNode } from "react";
import { useRef } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export interface SwipeableRowStyles {
  deleteAction?: StyleProp<ViewStyle>;
  deleteActionText?: StyleProp<TextStyle>;
  deleteIconColor?: string;
}

export interface SwipeableRowProps {
  children: ReactNode;
  onDelete: () => void;
  deleteLabel: string;
  deleteText?: string;
  styles?: SwipeableRowStyles;
}

const defaultStyles: Required<SwipeableRowStyles> = {
  deleteAction: {
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    width: 84,
    marginBottom: 10,
    borderRadius: 12,
    gap: 2,
  },
  deleteActionText: { color: "#ffffff", fontSize: 11, fontWeight: "600" },
  deleteIconColor: "#ffffff",
};

// Swipe a list row left to reveal a delete button, on top of a tap to edit it.
export function SwipeableRow({
  children,
  onDelete,
  deleteLabel,
  deleteText = "Delete",
  styles,
}: SwipeableRowProps) {
  const merged = { ...defaultStyles, ...styles };
  const swipeableRef = useRef<Swipeable>(null);

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <Pressable
          style={merged.deleteAction}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete();
          }}
          accessibilityRole="button"
          accessibilityLabel={deleteLabel}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color={merged.deleteIconColor}
          />
          <Text style={merged.deleteActionText}>{deleteText}</Text>
        </Pressable>
      )}
    >
      {children}
    </Swipeable>
  );
}
