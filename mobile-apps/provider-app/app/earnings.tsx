import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const transactions = [
  { id: 1, description: 'Network Configuration - John Smith', date: '2024-10-15', amount: 75, status: 'paid' },
  { id: 2, description: 'Software Installation - Jane Doe', date: '2024-10-14', amount: 50, status: 'paid' },
  { id: 3, description: 'Laptop Repair - Mike Johnson', date: '2024-10-13', amount: 120, status: 'pending' },
  { id: 4, description: 'Data Recovery - Sarah Williams', date: '2024-10-12', amount: 150, status: 'paid' },
];

export default function EarningsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.primaryCard]}>
          <Ionicons name="wallet" size={32} color="#fff" />
          <Text style={styles.statValue}>$2,450</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.smallStatCard}>
            <Ionicons name="trending-up" size={24} color="#10B981" />
            <Text style={styles.smallStatValue}>$850</Text>
            <Text style={styles.smallStatLabel}>This Month</Text>
          </View>

          <View style={styles.smallStatCard}>
            <Ionicons name="hourglass-outline" size={24} color="#F59E0B" />
            <Text style={styles.smallStatValue}>$125</Text>
            <Text style={styles.smallStatLabel}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Payout Button */}
      <TouchableOpacity style={styles.payoutButton}>
        <Ionicons name="card-outline" size={24} color="#fff" />
        <Text style={styles.payoutText}>Request Payout</Text>
      </TouchableOpacity>

      {/* Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <View style={[
                styles.transactionBadge,
                transaction.status === 'paid' ? styles.paidBadge : styles.pendingBadge
              ]}>
                <Text style={[
                  styles.badgeText,
                  transaction.status === 'paid' ? styles.paidText : styles.pendingText
                ]}>
                  {transaction.status === 'paid' ? 'Paid' : 'Pending'}
                </Text>
              </View>
            </View>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
            <Text style={styles.transactionAmount}>${transaction.amount}</Text>
          </View>
        ))}
      </View>

      {/* Download Report */}
      <TouchableOpacity style={styles.downloadButton}>
        <Ionicons name="download-outline" size={20} color="#10B981" />
        <Text style={styles.downloadText}>Download Earnings Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  statsContainer: {
    padding: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: '#10B981',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  smallStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  smallStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  payoutButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  payoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  transactionCard: {
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
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  transactionDescription: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  transactionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paidBadge: {
    backgroundColor: '#D1FAE5',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paidText: {
    color: '#10B981',
  },
  pendingText: {
    color: '#F59E0B',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  downloadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
});
