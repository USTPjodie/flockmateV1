import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Card, CardContent } from './components/ui/card';
import { Users, TrendingUp, BarChart3, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SQLite from './database/sqlite';
import { randomUUID } from 'expo-crypto';
import { useTheme } from './contexts/ThemeProvider';

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
  const { theme } = useTheme();

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Panel Header */}
        <View style={[styles.panelHeader, { backgroundColor: theme.primary, borderRadius: 12, padding: 16 }]}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: theme.white }]}>Growers Management</Text>
            <Text style={[styles.subtitle, { color: theme.white + 'CC' }]}>Manage all growers across cycles</Text>
          </View>
        </View>

        {/* Management Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Management Options</Text>
          
          <TouchableOpacity onPress={handleManageCycles}>
            <Card style={[styles.optionCard, { backgroundColor: theme.cardBackground }]}>
              <CardContent style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <View style={[styles.optionIcon, { backgroundColor: theme.primary + '20' }]}>
                    <BarChart3 size={20} color={theme.primary} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: theme.text }]}>Manage & Monitor Cycles</Text>
                    <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>View and manage all ongoing cycles</Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Add Grower Button */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>All Growers</Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <Text style={{ color: theme.textSecondary }}>Loading growers...</Text>
          ) : growers.length === 0 ? (
            <Text style={{ color: theme.textSecondary }}>No growers found. Add a new grower to get started.</Text>
          ) : (
            growers.map((grower) => (
              <Card key={grower.id} style={[styles.growerCard, { backgroundColor: theme.cardBackground }]}>
                <CardContent style={styles.growerContent}>
                  <View style={styles.growerHeader}>
                    <View style={[styles.growerIcon, { backgroundColor: theme.primary + '20' }]}>
                      <Users size={24} color={theme.primary} />
                    </View>
                    <View style={styles.growerInfo}>
                      <Text style={[styles.growerName, { color: theme.text }]}>{grower.name}</Text>
                      <Text style={[styles.growerCycles, { color: theme.textSecondary }]}>Contact: {grower.contact_person || 'N/A'}</Text>
                    </View>
                    <View style={styles.performanceContainer}>
                      <TrendingUp size={16} color={theme.success} />
                      <Text style={[styles.performanceValue, { color: theme.success }]}>Active</Text>
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
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add New Grower</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Grower Name *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.textSecondary + '40'
                }]}
                value={newGrower.name}
                onChangeText={(text) => setNewGrower({...newGrower, name: text})}
                placeholder="Enter grower name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Contact Person</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.textSecondary + '40'
                }]}
                value={newGrower.contactPerson}
                onChangeText={(text) => setNewGrower({...newGrower, contactPerson: text})}
                placeholder="Enter contact person"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Phone</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.textSecondary + '40'
                }]}
                value={newGrower.phone}
                onChangeText={(text) => setNewGrower({...newGrower, phone: text})}
                placeholder="Enter phone number"
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.textSecondary + '40'
                }]}
                value={newGrower.email}
                onChangeText={(text) => setNewGrower({...newGrower, email: text})}
                placeholder="Enter email address"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Address</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.textSecondary + '40'
                }]}
                value={newGrower.address}
                onChangeText={(text) => setNewGrower({...newGrower, address: text})}
                placeholder="Enter address"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: theme.textSecondary }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
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
    marginTop: 16,
    paddingHorizontal: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  },
  optionCard: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  growerCard: {
    borderRadius: 12,
    marginBottom: 12,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
  },
  growerCycles: {
    fontSize: 14,
  },
  performanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GrowersManagement;