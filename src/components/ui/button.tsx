import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const buttonStyles = {
  base: {
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
    borderRadius: 8,
  },
  variants: {
    default: {
      backgroundColor: "#2d7a4f",
      borderColor: "#256240",
      borderWidth: 1,
    },
    destructive: {
      backgroundColor: "#cc3333",
      borderColor: "#a62929",
      borderWidth: 1,
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: "#cccccc",
      borderWidth: 1,
    },
    secondary: {
      backgroundColor: "#e6f0eb",
      borderColor: "#2d7a4f",
      borderWidth: 1,
    },
    ghost: {
      backgroundColor: "transparent",
      borderWidth: 0,
    },
  },
  sizes: {
    default: {
      minHeight: 36,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    sm: {
      minHeight: 32,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 4,
      fontSize: 12,
    },
    lg: {
      minHeight: 40,
      borderRadius: 6,
      paddingHorizontal: 32,
      paddingVertical: 8,
    },
    icon: {
      width: 36,
      height: 36,
    },
  },
};

const textStyles = {
  base: {
    fontWeight: "600" as "600",
    textAlign: "center" as "center",
  },
  variants: {
    default: {
      color: "#ffffff",
    },
    destructive: {
      color: "#ffffff",
    },
    outline: {
      color: "#000000",
    },
    secondary: {
      color: "#2d7a4f",
    },
    ghost: {
      color: "#000000",
    },
  },
  sizes: {
    default: {
      fontSize: 14,
    },
    sm: {
      fontSize: 12,
    },
    lg: {
      fontSize: 14,
    },
    icon: {
      fontSize: 14,
    },
  },
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  style,
  ...props
}) => {
  const buttonStyle = [
    styles.base,
    buttonStyles.variants[variant],
    buttonStyles.sizes[size],
    props.disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    textStyles.base,
    textStyles.variants[variant],
    textStyles.sizes[size],
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      activeOpacity={0.7}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

export { Button };