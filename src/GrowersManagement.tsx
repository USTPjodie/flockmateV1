import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Users, TrendingUp, BarChart3, Bell, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SQLite from './database/sqlite';
import { randomUUID } from 'expo-crypto';

type RootStackParamList = {
  Cycles: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GrowersManagement = () => {
  const navigation = useNavigation<NavigationProp>();
  const [growers, setGrowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGrower, setNewGrower] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    loadGrowers();
  }, []);

  const loadGrowers = async () => {
    try {
      setLoading(true);
      const growersData: any = await SQLite.getAllGrowers();
      setGrowers(growersData || []);
    } catch (error) {
      console.error('Error loading growers:', error);
      setGrowers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleManageCycles = () => {
    // Navigate to the Cycles tab
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('Cycles');
  };

  const handleNotificationPress = () => {
    // @ts-ignore - Navigation typing will be handled by React Navigation
    navigation.navigate('Notifications');
  };

  const handleAddGrower = async () => {
    // Validation
    if (!newGrower.name.trim()) {
      Alert.alert('Validation Error', 'Please enter a grower name');
      return;
    }
    
    try {
      const growerData = {
        id: randomUUID(),
        name: newGrower.name,
        contactPerson: newGrower.contactPerson,
        phone: newGrower.phone,
        email: newGrower.email,
        address: newGrower.address
      };
      
      await SQLite.createGrower(growerData);
      
      // Reset form and close modal
      setNewGrower({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: ''
      });
      setModalVisible(false);
      
      // Reload growers
      loadGrowers();
      
      Alert.alert('Success', 'Grower added successfully!');
    } catch (error) {
      console.error('Error adding grower:', error);
      Alert.alert('Error', 'Failed to add grower: ' + (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Panel Header with Notification Bell */}
        <View style={styles.panelHeader}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Growers Management</Text>
            <Text style={styles.subtitle}>Manage all growers across cycles</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <Bell size={24} color="#0f172a" />
            {/* Notification badge (optional) */}
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>4</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Management Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management Options</Text>
          
          <TouchableOpacity onPress={handleManageCycles}>
            <Card style={styles.optionCard}>
              <CardContent style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <View style={styles.optionIcon}>
                    <BarChart3 size={20} color="#059669" />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Manage & Monitor Cycles</Text>
                    <Text style={styles.optionDescription}>View and manage all ongoing cycles</Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Add Grower Button */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Growers</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <Text>Loading growers...</Text>
          ) : growers.length === 0 ? (
            <Text>No growers found. Add a new grower to get started.</Text>
          ) : (
            growers.map((grower) => (
              <Card key={grower.id} style={styles.growerCard}>
                <CardContent style={styles.growerContent}>
                  <View style={styles.growerHeader}>
                    <View style={styles.growerIcon}>
                      <Users size={24} color="#059669" />
                    </View>
                    <View style={styles.growerInfo}>
                      <Text style={styles.growerName}>{grower.name}</Text>
                      <Text style={styles.growerCycles}>Contact: {grower.contact_person || 'N/A'}</Text>
                    </View>
                    <View style={styles.performanceContainer}>
                      <TrendingUp size={16} color="#059669" />
                      <Text style={styles.performanceValue}>Active</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
      
      {/* Add Grower Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Grower</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Grower Name *</Text>
              <TextInput
                style={styles.input}
                value={newGrower.name}
                onChangeText={(text) => setNewGrower({...newGrower, name: text})}
                placeholder="Enter grower name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Person</Text>
              <TextInput
                style={styles.input}
                value={newGrower.contactPerson}
                onChangeText={(text) => setNewGrower({...newGrower, contactPerson: text})}
                placeholder="Enter contact person name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={newGrower.phone}
                onChangeText={(text) => setNewGrower({...newGrower, phone: text})}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={newGrower.email}
                onChangeText={(text) => setNewGrower({...newGrower, email: text})}
                placeholder="Enter email address"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newGrower.address}
                onChangeText={(text) => setNewGrower({...newGrower, address: text})}
                placeholder="Enter address"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddGrower}
              >
                <Text style={styles.saveButtonText}>Add Grower</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16, // Add spacing at the top
    paddingHorizontal: 8, // Add horizontal padding
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  addButton: {
    backgroundColor: '#059669',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionContent: {
    padding: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  growerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  growerContent: {
    padding: 16,
  },
  growerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  growerInfo: {
    flex: 1,
  },
  growerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  growerCycles: {
    fontSize: 14,
    color: '#94a3b8',
  },
  performanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#059669',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GrowersManagement;