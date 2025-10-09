# FLOCKMATE Design Guidelines

## Color Palette

### Primary Colors
- **Primary Green**: `#6D9773` - Calm green symbolizing growth and sustainability
- **Deep Forest Green**: `#0C3B2E` - Used for headers, navigation bar, and dark mode backgrounds
- **Warm Brown-Gold**: `#BB8A52` - Accent color for highlights, icons, and buttons
- **Vibrant Yellow**: `#FFBA00` - Used for gamification badges, progress indicators, and key actions

### Neutral Colors
- **White**: `#FFFFFF`
- **Light Gray**: `#F8FAFC`
- **Gray**: `#94A3B8`
- **Dark Gray**: `#334155`
- **Black**: `#0F172A`

### Status Colors
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`
- **Info**: `#3B82F6`

### Gamification Colors
- **Bronze**: `#CD7F32`
- **Silver**: `#C0C0C0`
- **Gold**: `#FFD700`
- **Platinum**: `#E5E4E2`

## Typography

### Font Family
- **Primary Font**: Inter (clean sans-serif)

### Font Sizes
- **Small**: 12px
- **Medium**: 14px
- **Large**: 16px
- **Extra Large**: 18px
- **XX Large**: 20px
- **XXX Large**: 24px
- **Huge**: 28px
- **Massive**: 32px

## Layout & Spacing

### Spacing Scale
- **XS**: 4px
- **SM**: 8px
- **MD**: 12px
- **LG**: 16px
- **XL**: 20px
- **XXL**: 24px
- **XXXL**: 32px

### Border Radius
- **Small**: 8px
- **Medium**: 12px
- **Large**: 16px
- **Round**: 50% (for circular elements)

### Shadows
- **Small**: Subtle shadow for cards and elements
- **Medium**: Medium shadow for elevated components
- **Large**: Strong shadow for modals and important elements

## UI Components

### Cards
- **Border Radius**: 16px
- **Shadow**: Medium
- **Padding**: 16px
- **Background**: White in light mode, dark gray in dark mode

### Buttons
- **Primary Button**:
  - Background: Primary Green (`#6D9773`)
  - Text: White
  - Border Radius: 12px
  - Padding: 12px 24px

- **Secondary Button**:
  - Background: Transparent
  - Border: 1px solid Primary Green
  - Text: Primary Green
  - Border Radius: 12px
  - Padding: 12px 24px

- **Accent Button**:
  - Background: Vibrant Yellow (`#FFBA00`)
  - Text: Black
  - Border Radius: 12px
  - Padding: 12px 24px

### Input Fields
- **Border Radius**: 12px
- **Border**: 1px solid Gray
- **Padding**: 12px 16px
- **Focus State**: Border changes to Primary Green

## Gamification Elements

### Achievement System
- **Levels**: Bronze → Silver → Gold → Platinum
- **Points**: Earned through completing cycles, maintaining optimal conditions, and consistent usage
- **Badges**: Emoji-based visual representations of achievements
- **Progress Bars**: Yellow progress indicators showing advancement to next level

### Progress Indicators
- **Color**: Vibrant Yellow (`#FFBA00`)
- **Shape**: Rounded bars with smooth animations
- **Labels**: Clear percentage and point values

### Notifications
- **Badges**: Small circular indicators with numbers
- **Color**: Vibrant Yellow for attention-grabbing notifications
- **Position**: Top-right corner of relevant icons

## Dark Mode Implementation

### Background Colors
- **Main Background**: Deep Forest Green (`#0C3B2E`)
- **Card Background**: Dark Slate (`#1E293B`)
- **Text**: White (`#FFFFFF`)
- **Secondary Text**: Light Gray (`#CBD5E1`)

### Component Adjustments
- All components maintain the same structure but adapt colors for dark mode
- Shadows are reduced or removed for better performance
- Contrast is maintained for readability

## Screen Designs

### Home Dashboard
- **Header**: Welcome message with notification bell
- **Gamification Section**: Achievement level card for growers
- **Stats Grid**: 2x2 grid of metric cards
- **Cycles List**: Recent cycles with status indicators
- **Insights Section**: AI-generated recommendations (for growers)

### Environment Monitoring
- **Header**: "Environment Monitoring" title
- **Metrics Grid**: 2x2 grid showing temperature, humidity, air quality, and light levels
- **AI Insights**: Predictive analytics and recommendations
- **Alerts Section**: Recent system notifications

### Achievements
- **Current Level**: Large card showing current achievement level
- **Stats Overview**: 2x2 grid of key metrics
- **Achievements List**: Scrollable list of all achievements with unlock status

### Navigation
- **Bottom Tab Bar**: 5-tab navigation (Home, Cycles, Monitoring, Achievements, Account)
- **Icons**: Lucide React Native icons with theme-appropriate coloring
- **Labels**: Clear text labels for each tab

## Mood & Design Direction

### Keywords
- **Smart Farming**: Technology-driven agricultural solutions
- **AI-driven**: Intelligent insights and predictions
- **IoT Monitoring**: Real-time data collection and analysis
- **Sustainability**: Environmentally conscious design choices
- **Innovation**: Modern, forward-thinking interface
- **Productivity**: Tools that enhance efficiency

### Visual Style
- **Modern**: Clean lines, ample whitespace, contemporary aesthetics
- **Intuitive**: Easy-to-understand layouts and interactions
- **Friendly**: Rounded corners, approachable color palette
- **Tech-Inspired**: Subtle tech elements blended with natural farming themes
- **Gamified**: Engaging elements that encourage continued use

### Iconography
- **Style**: Lucide React Native icons
- **Color**: Primary green for standard actions, yellow for important/gamification elements
- **Size**: Consistent sizing throughout the app (24px for main icons)

## Responsive Design

### Mobile-First Approach
- **Breakpoints**: Designed specifically for mobile screens
- **Touch Targets**: Minimum 48px for interactive elements
- **Orientation**: Optimized for portrait mode with landscape support

### Adaptive Components
- **Cards**: Maintain consistent padding and spacing
- **Grids**: Adjust from 2-column to 1-column on smaller screens
- **Text**: Responsive sizing for readability on all devices

## Accessibility

### Color Contrast
- **Text**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: Clear visual feedback on focus/hover
- **Status Indicators**: Multiple visual cues (color + icon + text)

### Typography
- **Scalable**: Support for system font size adjustments
- **Hierarchy**: Clear visual hierarchy through size and weight
- **Readability**: Optimized line height and letter spacing

## Animation & Microinteractions

### Loading States
- **Skeleton Screens**: For content loading
- **Progress Indicators**: For longer operations
- **Success Feedback**: For completed actions

### Transitions
- **Page Transitions**: Smooth navigation between screens
- **State Changes**: Subtle animations for UI state updates
- **Gamification**: Animated progress bars and achievement unlocks

## Implementation Notes

### Theme System
- **Context Provider**: Centralized theme management
- **Dynamic Updates**: Real-time theme switching
- **Persistence**: Theme preference saved to device storage

### Component Reusability
- **Modular Design**: Components built for reuse across screens
- **Consistent Styling**: Shared style definitions
- **Flexible Props**: Components accept theme and customization props

This design system ensures a consistent, engaging, and modern user experience for poultry farmers and technicians using the FLOCKMATE system.