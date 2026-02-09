import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Calendar, CalendarDays, Bell, Clock, TrendingUp, AlertCircle, CheckCircle, Bird, Scale } from 'lucide-react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useTheme } from '../contexts/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import * as DataService from '../services/dataService';

interface CycleEvent {
  id: string;
  cycleName: string;
  cycleId: string;
  title: string;
  date: Date;
  type: 'feeding' | 'vaccination' | 'weighing' | 'inspection' | 'harvest' | 'other';
  status: 'completed' | 'upcoming' | 'overdue';
  description?: string;
  dayInCycle: number;
}

const CalendarView = () => {
  const { theme } = useTheme();
  const { user, role } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CycleEvent[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<CycleEvent[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');

  useEffect(() => {
    loadCalendarData();
  }, [user, role]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      
      if (role === 'grower' && user?.email) {
        const growerData: any = await DataService.getGrowerByEmail(user.email);
        if (growerData) {
          const cycles: any = await DataService.getCyclesByGrowerId(growerData.id);
          generateEventsFromCycles(cycles || []);
        }
      } else {
        const cycles: any = await DataService.getAllCycles();
        generateEventsFromCycles(cycles || []);
      }
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEventsFromCycles = (cycles: any[]) => {
    const generatedEvents: CycleEvent[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    cycles.forEach((cycle: any) => {
      if (!cycle.start_date) return;

      const startDate = new Date(cycle.start_date);
      const currentDay = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      // Standard poultry cycle events (typically 35-42 day cycle)
      const cycleEvents = [
        { day: 1, title: 'Cycle Start', type: 'other', description: 'Chicks arrival and placement' },
        { day: 7, title: 'Week 1 Vaccination', type: 'vaccination', description: 'Newcastle Disease vaccine' },
        { day: 7, title: 'Week 1 Weighing', type: 'weighing', description: 'Weekly weight check' },
        { day: 14, title: 'Week 2 Vaccination', type: 'vaccination', description: 'Gumboro vaccine' },
        { day: 14, title: 'Week 2 Weighing', type: 'weighing', description: 'Weekly weight check' },
        { day: 21, title: 'Week 3 Inspection', type: 'inspection', description: 'Health inspection' },
        { day: 21, title: 'Week 3 Weighing', type: 'weighing', description: 'Weekly weight check' },
        { day: 28, title: 'Week 4 Weighing', type: 'weighing', description: 'Weekly weight check' },
        { day: 35, title: 'Week 5 Weighing', type: 'weighing', description: 'Pre-harvest weight check' },
        { day: 35, title: 'Week 5 Inspection', type: 'inspection', description: 'Pre-harvest inspection' },
        { day: 42, title: 'Harvest Day', type: 'harvest', description: 'Scheduled harvest' },
      ];

      // Daily feeding events
      for (let day = 1; day <= 42; day++) {
        const eventDate = new Date(startDate);
        eventDate.setDate(startDate.getDate() + day - 1);
        
        // Skip daily feeding display (too cluttered), only show major events
        const majorEvent = cycleEvents.find(e => e.day === day);
        
        if (majorEvent) {
          const status = day < currentDay ? 'completed' : day === currentDay ? 'upcoming' : day > currentDay + 7 ? 'upcoming' : 'upcoming';
          
          generatedEvents.push({
            id: `${cycle.id}_${day}`,
            cycleName: cycle.name,
            cycleId: cycle.id,
            title: majorEvent.title,
            date: eventDate,
            type: majorEvent.type as any,
            status,
            description: majorEvent.description,
            dayInCycle: day,
          });
        }
      }
    });

    // Sort events by date
    generatedEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

    setEvents(generatedEvents);

    // Filter upcoming reminders (next 7 days)
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    const reminders = generatedEvents.filter(event => 
      event.status === 'upcoming' && 
      event.date >= today && 
      event.date <= weekFromNow
    );
    
    setUpcomingReminders(reminders);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'feeding':
        return <Bird size={18} color={theme.primary} />;
      case 'vaccination':
        return <AlertCircle size={18} color="#DC2626" />;
      case 'weighing':
        return <Scale size={18} color="#2563EB" />;
      case 'inspection':
        return <CheckCircle size={18} color="#16A34A" />;
      case 'harvest':
        return <TrendingUp size={18} color="#9333EA" />;
      default:
        return <Calendar size={18} color={theme.textSecondary} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'vaccination':
        return '#DC2626';
      case 'weighing':
        return '#2563EB';
      case 'inspection':
        return '#16A34A';
      case 'harvest':
        return '#9333EA';
      default:
        return theme.primary;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  const getMarkedDates = () => {
    const marked: any = {};
    
    events.forEach(event => {
      const dateString = event.date.toISOString().split('T')[0];
      const color = getEventColor(event.type);
      
      if (!marked[dateString]) {
        marked[dateString] = { dots: [] };
      }
      
      marked[dateString].dots.push({ color });
    });
    
    // Mark selected date
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    if (marked[selectedDateString]) {
      marked[selectedDateString].selected = true;
    } else {
      marked[selectedDateString] = { selected: true };
    }
    
    return marked;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDateString = event.date.toISOString().split('T')[0];
      return eventDateString === dateString;
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading calendar...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Fixed Header - Compact style matching other pages */}
      <View style={[styles.panelHeader, { backgroundColor: theme.primary, borderRadius: 16, padding: 12 }]}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: theme.white }]}>Calendar & Reminders</Text>
          <Text style={[styles.subtitle, { color: theme.white + 'CC' }]}>Track cycle activities and upcoming events</Text>
        </View>
        <TouchableOpacity 
          style={[styles.notificationButton, { backgroundColor: theme.white + '20' }]}
          onPress={() => navigation.navigate('Notifications' as never)}
          activeOpacity={0.7}
        >
          <Bell size={20} color={theme.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* View Mode Selector */}
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'month' && { backgroundColor: theme.primary }
            ]}
            onPress={() => setViewMode('month')}
          >
            <Text style={[
              styles.viewModeText,
              { color: viewMode === 'month' ? '#FFFFFF' : theme.textSecondary }
            ]}>
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'list' && { backgroundColor: theme.primary }
            ]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[
              styles.viewModeText,
              { color: viewMode === 'list' ? '#FFFFFF' : theme.textSecondary }
            ]}>
              List View
            </Text>
          </TouchableOpacity>
        </View>

        {/* Calendar View */}
        {viewMode === 'month' && (
          <Card style={[styles.calendarCard, { backgroundColor: theme.cardBackground }]}>
            <CardContent style={styles.calendarContent}>
              <RNCalendar
                current={selectedDate.toISOString().split('T')[0]}
                onDayPress={(day) => {
                  setSelectedDate(new Date(day.dateString));
                }}
                markedDates={getMarkedDates()}
                theme={{
                  backgroundColor: theme.cardBackground,
                  calendarBackground: theme.cardBackground,
                  textSectionTitleColor: theme.textSecondary,
                  selectedDayBackgroundColor: theme.primary,
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: theme.primary,
                  dayTextColor: theme.text,
                  textDisabledColor: theme.textSecondary + '60',
                  dotColor: theme.primary,
                  selectedDotColor: '#FFFFFF',
                  arrowColor: theme.primary,
                  monthTextColor: theme.text,
                  indicatorColor: theme.primary,
                  textDayFontWeight: '400',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '600',
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 12,
                }}
                markingType={'multi-dot'}
              />
              
              {/* Legend */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.legendText, { color: theme.textSecondary }]}>Vaccination</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={[styles.legendText, { color: theme.textSecondary }]}>Weighing</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={[styles.legendText, { color: theme.textSecondary }]}>Inspection</Text>
                </View>
              </View>

              {/* Events for Selected Date */}
              {getEventsForDate(selectedDate).length > 0 && (
                <View style={styles.selectedDateEvents}>
                  <Text style={[styles.selectedDateTitle, { color: theme.text }]}>
                    Events on {formatDate(selectedDate)}
                  </Text>
                  {getEventsForDate(selectedDate).map((event) => (
                    <View key={event.id} style={[styles.miniEventCard, { backgroundColor: theme.background }]}>
                      <View style={[styles.miniEventDot, { backgroundColor: getEventColor(event.type) }]} />
                      <View style={styles.miniEventInfo}>
                        <Text style={[styles.miniEventTitle, { color: theme.text }]}>{event.title}</Text>
                        <Text style={[styles.miniEventCycle, { color: theme.textSecondary }]}>
                          {event.cycleName}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Reminders Section */}
        {viewMode === 'list' && upcomingReminders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Upcoming Reminders ({upcomingReminders.length})
              </Text>
            </View>

            {upcomingReminders.map((event) => (
              <Card key={event.id} style={[styles.reminderCard, { backgroundColor: theme.cardBackground }]}>
                <CardContent style={styles.reminderContent}>
                  <View style={[styles.eventIconCircle, { backgroundColor: getEventColor(event.type) + '15' }]}>
                    {getEventIcon(event.type)}
                  </View>
                  <View style={styles.reminderInfo}>
                    <Text style={[styles.reminderTitle, { color: theme.text }]}>{event.title}</Text>
                    <Text style={[styles.reminderCycle, { color: theme.textSecondary }]}>
                      {event.cycleName} - Day {event.dayInCycle}
                    </Text>
                    <View style={styles.reminderDateRow}>
                      <Clock size={14} color={theme.textSecondary} />
                      <Text style={[styles.reminderDate, { color: theme.textSecondary }]}>
                        {formatDate(event.date)} • {getDaysUntil(event.date)}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.urgencyBadge, { backgroundColor: theme.highlight + '20' }]}>
                    <Text style={[styles.urgencyText, { color: theme.highlight }]}>!</Text>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        {/* All Events Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>All Events Timeline</Text>
          </View>

          {events.length === 0 ? (
            <Card style={[styles.emptyCard, { backgroundColor: theme.cardBackground }]}>
              <CardContent style={styles.emptyContent}>
                <Calendar size={48} color={theme.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No events scheduled yet
                </Text>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => {
              const isUpcoming = event.status === 'upcoming';
              const isCompleted = event.status === 'completed';

              return (
                <Card key={event.id} style={[
                  styles.eventCard,
                  { backgroundColor: theme.cardBackground },
                  isCompleted && { opacity: 0.6 }
                ]}>
                  <CardContent style={styles.eventContent}>
                    <View style={styles.eventLeftSection}>
                      <View style={[
                        styles.eventIconCircle,
                        { backgroundColor: getEventColor(event.type) + '15' }
                      ]}>
                        {getEventIcon(event.type)}
                      </View>
                      <View style={[
                        styles.eventTimeline,
                        { backgroundColor: isCompleted ? theme.success + '30' : theme.primary + '30' }
                      ]} />
                    </View>

                    <View style={styles.eventDetails}>
                      <View style={styles.eventHeader}>
                        <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
                        {isCompleted && (
                          <CheckCircle size={16} color={theme.success} />
                        )}
                      </View>
                      <Text style={[styles.eventCycle, { color: theme.textSecondary }]}>
                        {event.cycleName} - Day {event.dayInCycle}
                      </Text>
                      {event.description && (
                        <Text style={[styles.eventDescription, { color: theme.textSecondary }]}>
                          {event.description}
                        </Text>
                      )}
                      <View style={styles.eventDateRow}>
                        <Text style={[styles.eventDate, { color: theme.textSecondary }]}>
                          {formatDate(event.date)}
                        </Text>
                        <Text style={[
                          styles.eventStatus,
                          { color: isUpcoming ? theme.highlight : theme.success }
                        ]}>
                          {getDaysUntil(event.date)}
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 48,
    marginBottom: 0,
    paddingHorizontal: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
  },
  viewModeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  viewModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  reminderCard: {
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  reminderCycle: {
    fontSize: 13,
    marginBottom: 4,
  },
  reminderDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderDate: {
    fontSize: 12,
  },
  urgencyBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgencyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventCard: {
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  eventContent: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  eventLeftSection: {
    alignItems: 'center',
  },
  eventIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTimeline: {
    width: 2,
    flex: 1,
    minHeight: 20,
  },
  eventDetails: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  eventCycle: {
    fontSize: 13,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 12,
    marginBottom: 6,
  },
  eventDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 12,
  },
  eventStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    borderRadius: 12,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
  calendarCard: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarContent: {
    padding: 0,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500',
  },
  selectedDateEvents: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  selectedDateTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  miniEventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    gap: 10,
  },
  miniEventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  miniEventInfo: {
    flex: 1,
  },
  miniEventTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  miniEventCycle: {
    fontSize: 11,
  },
});

export default CalendarView;
