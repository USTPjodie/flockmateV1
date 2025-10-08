# Poultry Farmer Navigation Plan

This document outlines the planned navigation structure for poultry farmers in the Flockmate mobile app.

## Current Implementation

The app currently has a unified navigation structure that works for both farmers and technicians:
- Home (Dashboard)
- Cycles (Cycle management)
- Growers (Grower management - primarily for technicians)
- Account (User settings)

## Proposed Farmer-Specific Navigation

For a better user experience, we plan to implement role-based navigation that shows only relevant features to farmers:

### 1. Home Screen
- **Path:** `/home`
- **Component:** `Home`
- **Description:** Dashboard showing farmer's metrics and quick actions

### 2. Cycles Screen
- **Path:** `/cycles`
- **Component:** `Cycles`
- **Description:** List of cycles owned by the farmer

#### 2.1 Start New Cycle
- **Path:** `/cycles/new`
- **Component:** `NewCycleForm`
- **Description:** Form to create a new poultry cycle

#### 2.2 Make DOC Loading
- **Path:** `/cycles/:id/doc-loading`
- **Component:** `DocLoadingForm`
- **Description:** Record day-old chick loading details

#### 2.3 Make Supply Delivery
- **Path:** `/cycles/:id/supply-delivery`
- **Component:** `SupplyDeliveryForm`
- **Description:** Record feed, medicine, and other supply deliveries

#### 2.4 Monitor Poultry Grower
- **Path:** `/cycles/:id/monitoring`
- **Component:** `MonitoringView`
- **Description:** Daily monitoring entries and health observations

#### 2.5 Make Harvest
- **Path:** `/cycles/:id/harvest`
- **Component:** `HarvestForm`
- **Description:** Record harvest details including quantity and quality metrics

### 3. Account Screen
- **Path:** `/account`
- **Component:** `Account`
- **Description:** User profile and account settings

#### 3.1 Change Password
- **Path:** `/account/change-password`
- **Component:** `ChangePasswordForm`
- **Description:** Form to update account password

#### 3.2 Sign Out
- **Action:** `signOut()`
- **Description:** Log out of the application

## Navigation Implementation Approach

### Option 1: Conditional Rendering in Existing Tabs
Modify the existing tab navigator to conditionally render tabs based on user role:
- Farmers see: Home, Cycles, Monitor, Account
- Technicians see: Home, Cycles, Growers, Account

### Option 2: Separate Navigators
Create separate navigator components for each role:
- `FarmerTabs` - For poultry farmers
- `TechnicianTabs` - For poultry technicians

## Component Requirements

The following components need to be created or adapted for farmers:

1. **Forms:**
   - `NewCycleForm.tsx` - Create new cycle
   - `DocLoadingForm.tsx` - DOC loading entry
   - `SupplyDeliveryForm.tsx` - Supply delivery entry
   - `MonitoringView.tsx` - Daily monitoring
   - `HarvestForm.tsx` - Harvest data entry
   - `ChangePasswordForm.tsx` - Password change form

2. **Views:**
   - Enhance `Cycles.tsx` to filter by farmer ownership
   - Create `MonitoringView.tsx` for daily entries
   - Adapt `CycleDetail.tsx` for farmer-specific actions

## Role-Based Data Access

### Farmers:
- Can only view/edit their own cycles
- Can only see their own monitoring data
- Can only access their account information

### Technicians:
- Can view/edit cycles for growers they manage
- Can access monitoring data for multiple operations
- Can manage grower accounts

## Implementation Steps

### Phase 1: Core Functionality
1. Create missing form components based on backup files
2. Implement role-based data filtering in existing screens
3. Add farmer-specific actions to cycle management

### Phase 2: Enhanced Navigation
1. Implement role-based tab navigation
2. Create separate navigator components
3. Add role-specific icons and labels

### Phase 3: Advanced Features
1. Add offline capabilities for field data entry
2. Implement barcode scanning for quick data entry
3. Include photo capture for documentation

## Technical Considerations

### Supabase Queries
- Farmers: Filter data by `user_id` 
- Technicians: Filter data by `technician_id` or related grower IDs

### UI/UX
- Use appropriate icons (Sprout for farmers, Wrench for technicians)
- Show role-specific terminology
- Implement role-appropriate workflows

### Security
- Ensure farmers cannot access other users' data
- Validate all data submissions
- Implement proper error handling

This navigation plan will provide poultry farmers with a focused, intuitive interface for managing their poultry operations while maintaining the flexibility to support technicians who manage multiple growers.