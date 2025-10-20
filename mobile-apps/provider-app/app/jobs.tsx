import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const jobs = [
  { id: 1, title: 'Network Configuration', customer: 'John Smith', location: 'New York, NY', amount: 75, status: 'active', urgent: true },
  { id: 2, title: 'Software Installation', customer: 'Jane Doe', location: 'Brooklyn, NY', amount: 50, status: 'pending', urgent: false },
  { id: 3, title: 'Laptop Repair', customer: 'Mike Johnson', location: 'Manhattan, NY', amount: 120, status: 'active', urgent: false },
  { id: 4, title: 'Data Recovery', customer: 'Sarah Williams', location: 'Queens, NY', amount: 150, status: 'completed', urgent: false },
];

export default function JobsScreen() {
  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Active (2)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Pending (1)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Completed (45)</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.jobsList}>
        {jobs.filter(job => job.status === 'active' || job.status === 'pending').map((job) => (
          <TouchableOpacity key={job.id} style={styles.jobCard}>
            {job.urgent && (
              <View style={styles.urgentBadge}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.urgentText}>Urgent</Text>
              </View>
            )}
            
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={[
                styles.statusBadge,
                job.status === 'active' ? styles.activeBadge : styles.pendingBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  job.status === 'active' ? styles.activeText : styles.pendingText
                ]}>
                  {job.status === 'active' ? 'Active' : 'Pending'}
                </Text>
              </View>
            </View>

            <View style={styles.jobDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{job.customer}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{job.location}</Text>
              </View>
            </View>

            <View style={styles.jobFooter}>
              <Text style={styles.amount}>${job.amount}</Text>
              
              <View style={styles.actions}>
                {job.status === 'pending' && (
                  <>
                    <TouchableOpacity style={styles.declineButton}>
                      <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptButton}>
                      <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                  </>
                )}
                {job.status === 'active' && (
                  <TouchableOpacity style={styles.completeButton}>
                    <Text style={styles.completeText}>Complete Job</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10B981',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#10B981',
  },
  jobsList: {
    flex: 1,
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#DBEAFE',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#3B82F6',
  },
  pendingText: {
    color: '#F59E0B',
  },
  jobDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  actions: {
    flexDirection: 'row',
  },
  declineButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  declineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  acceptButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  completeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  completeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
