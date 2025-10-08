import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "./contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Sprout, Phone, MapPin } from "lucide-react-native";

export default function Growers() {
  const { user } = useAuth();
  
  // Mock data for demonstration
  const { data: growers, isLoading } = useQuery<any[]>({
    queryKey: ["/api/technician/growers", user?.id],
    enabled: !!user?.id,
  });

  const mockGrowers = [
    {
      id: "1",
      name: "Green Valley Farms",
      owner: "John Smith",
      location: "Springfield, IL",
      phone: "(555) 123-4567",
      activeCycles: 2,
    },
    {
      id: "2",
      name: "Sunset Poultry",
      owner: "Sarah Johnson",
      location: "Riverside, CA",
      phone: "(555) 987-6543",
      activeCycles: 1,
    },
    {
      id: "3",
      name: "Meadowbrook Farms",
      owner: "Robert Davis",
      location: "Portland, OR",
      phone: "(555) 456-7890",
      activeCycles: 3,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Growers</Text>
        <Text style={styles.pageSubtitle}>Manage your grower accounts</Text>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search Growers</Text>
        </TouchableOpacity>
      </View>

      {mockGrowers.map((grower) => (
        <TouchableOpacity key={grower.id} style={styles.growerCard}>
          <View style={styles.growerHeader}>
            <View style={styles.iconContainer}>
              <Sprout size={24} color="#2d7a4f" />
            </View>
            <View style={styles.growerInfo}>
              <Text style={styles.growerName}>{grower.name}</Text>
              <Text style={styles.growerOwner}>Owner: {grower.owner}</Text>
            </View>
          </View>
          
          <View style={styles.growerDetails}>
            <View style={styles.detailRow}>
              <MapPin size={16} color="#666666" />
              <Text style={styles.detailText}>{grower.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Phone size={16} color="#666666" />
              <Text style={styles.detailText}>{grower.phone}</Text>
            </View>
          </View>
          
          <View style={styles.growerStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{grower.activeCycles}</Text>
              <Text style={styles.statLabel}>Active Cycles</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
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
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    color: "#2d7a4f",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  growerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  growerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(45, 122, 79, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  growerInfo: {
    flex: 1,
  },
  growerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  growerOwner: {
    fontSize: 14,
    color: "#666666",
  },
  growerDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },
  growerStats: {
    borderTopWidth: 1,
    borderTopColor: "#e6e6e6",
    paddingTop: 12,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d7a4f",
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
  },
});