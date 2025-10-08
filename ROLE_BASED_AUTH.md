# Role-Based Authentication System

This document explains the role-based authentication system implemented for growers and technicians in the Flockmate mobile app.

## Overview

The authentication system now supports two distinct user roles:
1. **Growers** - Poultry farmers who manage their own flocks
2. **Technicians** - Professionals who provide services to multiple growers

## Implementation Details

### 1. Enhanced AuthContext

The `AuthContext` has been updated to include:
- Role information in the context state
- Enhanced signup method that accepts a role parameter
- Automatic role retrieval from user metadata on login

### 2. Updated Login Component

The login screen now offers:
- **Sign In** - For existing users
- **Create Account** - For new users with role selection

#### Role Selection
During signup, users must select their role:
- **Grower** (Sprout icon) - For poultry farmers
- **Technician** (Wrench icon) - For poultry professionals

The role is stored in the user's metadata in Supabase.

### 3. Home Dashboard

The dashboard now displays:
- User's role with appropriate icon (Sprout for growers, Wrench for technicians)
- Role-specific terminology in the UI

## User Experience

### New Users
1. Tap "Don't have an account? Create One"
2. Enter full name, email, and password
3. Select role (Grower or Technician)
4. Tap "Create Account"
5. Check email for confirmation link

### Existing Users
1. Enter email and password
2. Tap "Sign In"
3. Dashboard displays with role-specific information

## Technical Implementation

### Supabase Integration
Roles are stored in the user's metadata:
```javascript
// During signup
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
      role: role, // "grower" or "technician"
    },
  },
});
```

### Role-Based UI
The UI adapts based on the user's role:
- Dashboard shows role-specific icons and labels
- Future enhancements can provide role-specific features

## Future Enhancements

Potential improvements include:
- Role-specific navigation tabs
- Different dashboard metrics based on role
- Technician-specific features like grower management
- Grower-specific features like flock management