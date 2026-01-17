import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "./contexts/AuthContext";
import { Sprout, Phone, MapPin } from "lucide-react-native";
import * as DataService from './services/dataService';

export default function Growers() {
  const { user } = useAuth();
  const [growers, setGrowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadGrowers();
  }, []);

  const loadGrowers = async () => {
    try {
      setLoading(true);
      const data = await DataService.getAllGrowers();
      setGrowers(data || []);
    } catch (error) {
      console.error('Error loading growers:', error);
      setGrowers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Growers</Text>
        <Text style={styles.pageSubtitle}>Manage your grower accounts</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00623a" />
          <Text style={styles.loadingText}>Loading growers...</Text>
        </View>
      ) : growers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No growers found</Text>
        </View>
      ) : (
        growers.map((grower) => (
          <TouchableOpacity key={grower.id} style={styles.growerCard}>
            <View style={styles.growerHeader}>
              <View style={styles.iconContainer}>
                <Sprout size={24} color="#00623a" />
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
                <Text style={styles.statValue}>Active</Text>
                <Text style={styles.statLabel}>Status</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
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
    paddingTop: 48,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 12,
    marginTop: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12,
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
    color: "#00623a",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
  },
  growerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  growerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 98, 58, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  growerInfo: {
    flex: 1,
  },
  growerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  growerOwner: {
    fontSize: 13,
    color: "#666666",
  },
  growerDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 8,
  },
  growerStats: {
    borderTopWidth: 1,
    borderTopColor: "#e6e6e6",
    paddingTop: 10,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00623a",
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
  },
});