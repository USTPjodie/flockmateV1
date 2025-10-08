import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

interface LabelProps extends TextProps {
  className?: string;
}

const Label: React.FC<LabelProps> = ({ style, ...props }) => {
  return <Text style={[styles.label, style]} {...props} />;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
});

export { Label };