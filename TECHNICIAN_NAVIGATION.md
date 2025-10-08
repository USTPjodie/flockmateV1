# Poultry Technician Navigation Structure

This document outlines the complete navigation structure for poultry technicians in the Flockmate mobile app.

## Navigation Overview

The app will use a bottom tab navigator as the primary navigation with additional stack navigators for detailed workflows.

## 1. Sign In Screen

**Path:** `/login`
**Component:** `Login`
**Description:** Authentication screen where technicians can sign in with their credentials

## 2. Home Screen

**Path:** `/home`
**Component:** `Home`
**Description:** Dashboard showing technician metrics and quick actions

## 3. Navigation Bar (Bottom Tabs)

**Tabs:**
1. **Home** - Dashboard overview
2. **Cycles** - Cycle management
3. **Growers** - Grower management
4. **Account** - User settings

## 4. Cycles Screen

**Path:** `/cycles`
**Component:** `Cycles`
**Description:** List of all cycles assigned to the technician

### 4.1 Start New Cycle

**Path:** `/cycles/new`
**Component:** `NewCycleForm`
**Description:** Form to create a new poultry cycle

### 4.2 Make DOC Loading

**Path:** `/cycles/:id/doc-loading`
**Component:** `DocLoadingForm`
**Description:** Record day-old chick loading details

### 4.3 Make Supply Delivery

**Path:** `/cycles/:id/supply-delivery`
**Component:** `SupplyDeliveryForm`
**Description:** Record feed, medicine, and other supply deliveries

### 4.4 Resubmit Supply Delivery

**Path:** `/cycles/:id/supply-delivery/:deliveryId/edit`
**Component:** `SupplyDeliveryForm`
**Description:** Edit previously submitted supply delivery

### 4.5 Manage & Monitor Cycle

**Path:** `/cycles/:id`
**Component:** `CycleDetail`
**Description:** Detailed view of a specific cycle with monitoring data

### 4.6 Manage & Monitor Grower

**Path:** `/growers/:id`
**Component:** `GrowerDetail`
**Description:** View and manage a specific grower's information and cycles

### 4.7 Make Harvest

**Path:** `/cycles/:id/harvest`
**Component:** `HarvestForm`
**Description:** Record harvest details including quantity and quality metrics

### 4.8 Resubmit Harvest

**Path:** `/cycles/:id/harvest/edit`
**Component:** `HarvestForm`
**Description:** Edit previously submitted harvest data

### 4.9 Reconciliation of Performance

**Path:** `/cycles/:id/reconciliation`
**Component:** `ReconciliationView`
**Description:** Compare actual performance against targets and calculate variances

### 4.10 Post-harvest

**Path:** `/cycles/:id/post-harvest`
**Component:** `PostHarvestView`
**Description:** View post-harvest analytics and performance reports

## 5. Account Screen

**Path:** `/account`
**Component:** `Account`
**Description:** User profile and account settings

### 5.1 Change Password

**Path:** `/account/change-password`
**Component:** `ChangePasswordForm`
**Description:** Form to update account password

### 5.2 Sign Out

**Action:** `signOut()`
**Description:** Log out of the application

## Navigation Implementation Plan

### Stack Navigators:
1. **AuthStackNavigator** - Handles login flow
2. **HomeStackNavigator** - Home tab with nested screens
3. **CyclesStackNavigator** - Cycles tab with nested screens
4. **GrowersStackNavigator** - Growers tab with nested screens
5. **AccountStackNavigator** - Account tab with nested screens

### Tab Navigator:
- **MainTabNavigator** - Contains all five primary tabs

## Component Requirements

The following components need to be created or adapted:
- `Cycles.tsx` - List of cycles
- `CycleDetail.tsx` - Detailed cycle view
- `NewCycleForm.tsx` - Create new cycle
- `DocLoadingForm.tsx` - DOC loading entry
- `SupplyDeliveryForm.tsx` - Supply delivery entry
- `GrowerDetail.tsx` - Grower management
- `HarvestForm.tsx` - Harvest data entry
- `ReconciliationView.tsx` - Performance reconciliation
- `PostHarvestView.tsx` - Post-harvest analytics
- `ChangePasswordForm.tsx` - Password change form

## Future Enhancements

- Add notifications for upcoming tasks
- Implement offline capabilities for field data entry
- Add barcode scanning for quick data entry
- Include photo capture for documentation
- Add reporting and analytics dashboards