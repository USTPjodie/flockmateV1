# Start New Cycle Functionality Implementation

This document explains the implementation of the "Start New Cycle" functionality in the Flockmate mobile app.

## Overview

The "Start New Cycle" feature allows users (both farmers and technicians) to create new poultry production cycles. The implementation includes:

1. A form component for entering cycle details
2. Integration with the Cycles screen
3. Role-based data submission
4. Validation and error handling

## Implementation Details

### 1. NewCycleForm Component

**Location:** `src/NewCycleForm.tsx`

This component provides a form for creating new cycles with the following fields:
- Cycle Number (required)
- House Number (optional)
- Target Number of Birds (optional)
- Start Date (optional)
- Notes (optional)

**Key Features:**
- Form validation for required fields
- Role-based data submission (farmerId or technicianId)
- Loading states with visual feedback
- Success and error handling with toast notifications
- React Query integration for data management

### 2. Cycles Screen Integration

**Location:** `src/Cycles.tsx`

The Cycles screen has been updated to include:
- "Start New Cycle" button that opens a modal
- Modal implementation for the form
- Success callback to close the modal

### 3. Role-Based Data Submission

The form automatically sets the appropriate ID based on the user's role:
- For farmers: Sets `farmerId` to the current user's ID
- For technicians: Sets `technicianId` to the current user's ID

### 4. Data Flow

1. User taps "Start New Cycle" button
2. Modal opens with the NewCycleForm
3. User fills in cycle details
4. Form validates required fields
5. Data is submitted via React Query mutation
6. On success:
   - Toast notification shows success message
   - Modal closes
   - Data is invalidated to trigger refresh
7. On error:
   - Toast notification shows error message
   - Form remains open for corrections

## Component Structure

```
src/
├── Cycles.tsx          # Main cycles screen with modal trigger
├── NewCycleForm.tsx    # Form component for creating new cycles
```

## Form Fields

### Cycle Number (Required)
- Unique identifier for the cycle
- Example: "C-2025-001"
- Validation: Cannot be empty

### House Number (Optional)
- Identifier for the poultry house
- Example: "H-1"

### Target Number of Birds (Optional)
- Expected number of birds in the cycle
- Numeric input only

### Start Date (Optional)
- Planned start date for the cycle
- Format: YYYY-MM-DD

### Notes (Optional)
- Additional information about the cycle
- Multi-line text input

## Technical Implementation

### State Management
- Local component state for form fields
- React Query for server state management
- useToast hook for notifications

### Validation
- Required field validation for cycle number
- Numeric validation for target birds
- Error messages via toast notifications

### Styling
- React Native StyleSheet for consistent styling
- Responsive design for different screen sizes
- Accessible touch targets

### Error Handling
- Try/catch for API calls
- User-friendly error messages
- Form remains editable after errors

## Future Enhancements

### 1. API Integration
Replace the mock mutation with actual API calls:
```typescript
const createCycleMutation = useMutation({
  mutationFn: async (data: any) => {
    // Replace with actual API call
    const response = await fetch('/api/cycles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create cycle');
    }
    
    return response.json();
  },
  // ... rest of mutation config
});
```

### 2. Date Picker
Implement a proper date picker component for the start date field:
```typescript
// Add a date picker library like @react-native-community/datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';
```

### 3. Form Persistence
Add form state persistence to prevent data loss:
```typescript
// Use AsyncStorage to save form state
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### 4. Enhanced Validation
Add more sophisticated validation:
- Date format validation
- Numeric range validation
- Uniqueness checking for cycle numbers

## Testing

### Manual Testing
1. Open the Cycles screen
2. Tap "Start New Cycle" button
3. Verify modal opens with form
4. Try submitting without required fields
5. Fill in all fields and submit
6. Verify success notification
7. Verify modal closes

### Automated Testing
Add tests for:
- Form validation
- Role-based data submission
- Success and error flows
- UI state changes

## Usage Instructions

### For Farmers
1. Navigate to the Cycles screen
2. Tap "Start New Cycle"
3. Enter cycle details:
   - Cycle Number (required)
   - House Number (optional)
   - Target Birds (optional)
   - Start Date (optional)
   - Notes (optional)
4. Tap "Create Cycle"
5. Wait for success confirmation

### For Technicians
1. Navigate to the Cycles screen
2. Tap "Start New Cycle"
3. Enter cycle details
4. The system will automatically associate the cycle with your technician ID
5. Tap "Create Cycle"
6. Wait for success confirmation

## Troubleshooting

### Common Issues
1. **Form won't submit**
   - Check that cycle number is filled in
   - Verify internet connection
   - Check console for errors

2. **Modal doesn't close**
   - Verify onSuccess callback is called
   - Check for JavaScript errors

3. **Data doesn't appear in list**
   - Verify query invalidation is working
   - Check API response format

### Debugging Tips
1. Use React DevTools to inspect component state
2. Check network tab for API calls
3. Add console.log statements for debugging
4. Verify Supabase connection for real implementation

This implementation provides a solid foundation for the "Start New Cycle" functionality that can be extended with real API integration and additional features as needed.