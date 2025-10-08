import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "./contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Package, 
  Truck, 
  Scale, 
  TrendingUp, 
  Sprout, 
  Wrench,
  AlertCircle
} from "lucide-react-native";

export default function CycleDetail() {
  const { user } = useAuth();
  
  // Mock data for demonstration
  const cycleData = {
    id: "1",
    cycleNumber: "CYC-2023-001",
    houseNumber: "House A",
    status: "active",
    targetBirds: 10000,
    startDate: "2023-10-01",
    grower: {
      name: "Green Valley Farms",
      owner: "John Smith",
    },
    currentWeek: 4,
    mortalityRate: 2.5,
    feedConversion: 1.6,
  };

  const actions = [
    { id: 1, title: "DOC Loading", icon: <Package size={20} color="#2d7a4f" />, path: "doc-loading" },
    { id: 2, title: "Supply Delivery", icon: <Truck size={20} color="#2d7a4f" />, path: "supply-delivery" },
    { id: 3, title: "Monitor Growth", icon: <TrendingUp size={20} color="#2d7a4f" />, path: "monitor" },
    { id: 4, title: "Harvest", icon: <Scale size={20} color="#2d7a4f" />, path: "harvest" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.cycleNumber}>{cycleData.cycleNumber}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: "rgba(76, 175, 80, 0.1)" }]}>
            <Text style={[styles.statusText, { color: "#4CAF50" }]}>
              {cycleData.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cycle Information</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>House</Text>
            <Text style={styles.infoValue}>{cycleData.houseNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Target Birds</Text>
            <Text style={styles.infoValue}>{cycleData.targetBirds?.toLocaleString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Start Date</Text>
            <Text style={styles.infoValue}>{cycleData.startDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Week</Text>
            <Text style={styles.infoValue}>{cycleData.currentWeek}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Grower Information</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.growerHeader}>
            <View style={styles.iconContainer}>
              <Sprout size={20} color="#2d7a4f" />
            </View>
            <View>
              <Text style={styles.growerName}>{cycleData.grower.name}</Text>
              <Text style={styles.growerOwner}>Owner: {cycleData.grower.owner}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
        </View>
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{cycleData.mortalityRate}%</Text>
            <Text style={styles.metricLabel}>Mortality Rate</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{cycleData.feedConversion}</Text>
            <Text style={styles.metricLabel}>Feed Conversion</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actions</Text>
        </View>
        <View style={styles.actionsGrid}>
          {actions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.actionCard}>
              <View style={styles.actionIcon}>{action.icon}</View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  cycleNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  statusContainer: {
    flexDirection: "row",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  growerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(45, 122, 79, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  growerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  growerOwner: {
    fontSize: 14,
    color: "#666666",
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d7a4f",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: "#666666",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    textAlign: "center",
  },
});