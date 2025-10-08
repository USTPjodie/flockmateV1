import React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";

interface CardProps extends ViewProps {
  className?: string;
}

const Card: React.FC<CardProps> = ({ style, ...props }) => {
  return <View style={[styles.card, style]} {...props} />;
};

const CardHeader: React.FC<ViewProps> = ({ style, ...props }) => {
  return <View style={[styles.cardHeader, style]} {...props} />;
};

const CardTitle: React.FC<TextProps> = ({ style, ...props }) => {
  return <Text style={[styles.cardTitle, style]} {...props} />;
};

const CardDescription: React.FC<TextProps> = ({ style, ...props }) => {
  return <Text style={[styles.cardDescription, style]} {...props} />;
};

const CardContent: React.FC<ViewProps> = ({ style, ...props }) => {
  return <View style={[styles.cardContent, style]} {...props} />;
};

const CardFooter: React.FC<ViewProps> = ({ style, ...props }) => {
  return <View style={[styles.cardFooter, style]} {...props} />;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 24,
    paddingBottom: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666666",
  },
  cardContent: {
    padding: 24,
  },
  cardFooter: {
    padding: 24,
    paddingTop: 0,
  },
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};