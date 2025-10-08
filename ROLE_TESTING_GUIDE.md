# Role Testing Guide

This guide explains how to test the role-based features for poultry farmers and technicians in the Flockmate app.

## Current Implementation

The app already supports role-based authentication with the following features:

1. **Role Selection During Signup**
   - Users can choose between "Grower" and "Technician" during account creation
   - Role is stored in Supabase user metadata

2. **Role-Based UI Display**
   - Home screen shows role-specific badge (Sprout for farmers, Wrench for technicians)
   - Navigation is currently unified but can be extended

3. **Authentication Context**
   - The `useAuth()` hook provides access to the user's role
   - Role-based logic can be implemented throughout the app

## Testing Poultry Farmer Features

### 1. Sign Up as a Farmer
1. Open the app
2. Tap "Don't have an account? Create One"
3. Fill in your details:
   - Full Name: "John Farmer"
   - Email: farmer@example.com
   - Password: at least 6 characters
4. Select "Grower" role
5. Tap "Create Account"
6. Check your email for confirmation

### 2. Sign In as a Farmer
1. Enter your email and password
2. Tap "Sign In"
3. Verify that:
   - Home screen shows "Poultry Grower" with Sprout icon
   - Navigation tabs are visible

### 3. Test Farmer-Specific Navigation
Currently, the app shows the same navigation for both roles. The planned enhancements would provide:

- **Home** - Dashboard with farmer metrics
- **Cycles** - List of cycles owned by the farmer
- **Monitor** - Daily monitoring entries (planned)
- **Account** - Profile and settings

### 4. Test Data Access
As a farmer, you should only see:
- Cycles you own
- Data related to your operations
- Your account information

## Testing Poultry Technician Features

### 1. Sign Up as a Technician
1. Open the app
2. Tap "Don't have an account? Create One"
3. Fill in your details:
   - Full Name: "Jane Technician"
   - Email: technician@example.com
   - Password: at least 6 characters
4. Select "Technician" role
5. Tap "Create Account"
6. Check your email for confirmation

### 2. Sign In as a Technician
1. Enter your email and password
2. Tap "Sign In"
3. Verify that:
   - Home screen shows "Poultry Technician" with Wrench icon
   - Navigation tabs are visible

### 3. Test Technician-Specific Navigation
Technicians should see:
- **Home** - Dashboard with technician metrics
- **Cycles** - List of cycles they manage
- **Growers** - List of growers they work with
- **Account** - Profile and settings

### 4. Test Data Access
As a technician, you should be able to:
- View cycles for multiple growers
- Enter data on behalf of growers
- Manage grower accounts

## Implementation Status

### Completed Features ✅
- Role selection during signup
- Role-based UI display
- Authentication with Supabase
- Basic navigation structure

### Planned Features 🔄
- Role-specific navigation tabs
- Farmer monitoring views
- Technician grower management
- Advanced data entry forms

## Code Examples

### Checking User Role
```typescript
import { useAuth } from './src/contexts/AuthContext';

function MyComponent() {
  const { role } = useAuth();
  
  if (role === 'grower') {
    return <FarmerView />;
  } else if (role === 'technician') {
    return <TechnicianView />;
  }
  
  return <DefaultView />;
}
```

### Role-Based Navigation (Planned)
```typescript
function AppContent() {
  const { user, role } = useAuth();
  
  if (!user) {
    return <Login />;
  }
  
  return role === 'grower' ? <FarmerTabs /> : <TechnicianTabs />;
}
```

## Troubleshooting

### Common Issues
1. **Role not displaying correctly**
   - Ensure user metadata is properly set in Supabase
   - Check AuthContext for role retrieval logic

2. **Unable to sign up**
   - Verify Supabase connection
   - Check environment variables

3. **Navigation issues**
   - Confirm React Navigation setup
   - Check tab navigator configuration

### Debugging Tips
1. Use the Supabase dashboard to verify user roles
2. Check console logs for authentication errors
3. Test with different user accounts

## Next Steps

1. Implement role-specific navigation components
2. Create farmer monitoring views
3. Develop technician grower management features
4. Add advanced data entry forms
5. Implement comprehensive testing

This testing guide will help ensure that both poultry farmers and technicians have the appropriate features and access levels in the Flockmate app.