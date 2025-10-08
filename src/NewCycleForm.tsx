import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./contexts/AuthContext";
import { useToast } from "./hooks/use-toast";
import { Loader2, Plus } from "lucide-react-native";

interface NewCycleFormProps {
  onSuccess: () => void;
}

export default function NewCycleForm({ onSuccess }: NewCycleFormProps) {
  const [cycleNumber, setCycleNumber] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [targetBirds, setTargetBirds] = useState("");
  const [startDate, setStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, role } = useAuth();

  // Mock mutation for demonstration
  // In a real implementation, this would call your API
  const createCycleMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success or failure
      if (Math.random() > 0.2) { // 80% success rate
        return { success: true, data };
      } else {
        throw new Error("Failed to create cycle");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cycles"] });
      toast({
        title: "Success",
        description: "New cycle created successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create cycle",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!cycleNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter a cycle number",
        variant: "destructive",
      });
      return;
    }
    
    const cycleData: any = {
      cycleNumber,
      houseNumber: houseNumber || null,
      targetBirds: targetBirds ? parseInt(targetBirds) : null,
      startDate: startDate || null,
      status: "planned",
      notes: notes || null,
    };

    // Set appropriate ID based on role
    if (role === "grower") {
      cycleData.farmerId = user?.id;
    } else if (role === "technician") {
      cycleData.technicianId = user?.id;
    }

    createCycleMutation.mutate(cycleData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Cycle Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., C-2025-001"
          value={cycleNumber}
          onChangeText={setCycleNumber}
          testID="input-cycle-number"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>House Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., H-1"
          value={houseNumber}
          onChangeText={setHouseNumber}
          testID="input-house-number"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Target Number of Birds</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 5000"
          value={targetBirds}
          onChangeText={setTargetBirds}
          keyboardType="numeric"
          testID="input-target-birds"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Start Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
          testID="input-start-date"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add any notes about this cycle..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          testID="input-notes"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, createCycleMutation.isPending && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={createCycleMutation.isPending}
        testID="button-submit-cycle"
      >
        {createCycleMutation.isPending ? (
          <View style={styles.buttonContent}>
            <Loader2 size={16} color="#fff" />
            <Text style={styles.buttonText}>Creating...</Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Plus size={16} color="#fff" />
            <Text style={styles.buttonText}>Create Cycle</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333333",
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2d7a4f",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});