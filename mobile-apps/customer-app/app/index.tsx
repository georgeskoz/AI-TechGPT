import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>TechersGPT</Text>
        <Text style={styles.subtitle}>Your AI-Powered Tech Support</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <Link href="/chat" asChild>
          <TouchableOpacity style={[styles.card, styles.primaryCard]}>
            <Ionicons name="chatbubbles" size={32} color="#fff" />
            <Text style={styles.cardTitle}>AI Chat Support</Text>
            <Text style={styles.cardDescription}>Get instant help from our AI assistant</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/services" asChild>
          <TouchableOpacity style={styles.card}>
            <Ionicons name="construct" size={32} color="#3B82F6" />
            <Text style={[styles.cardTitle, styles.darkText]}>Book a Technician</Text>
            <Text style={[styles.cardDescription, styles.darkText]}>Schedule an expert to help you</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="call" size={32} color="#10B981" />
          <Text style={[styles.cardTitle, styles.darkText]}>Phone Support</Text>
          <Text style={[styles.cardDescription, styles.darkText]}>Talk to a live expert now</Text>
        </TouchableOpacity>
      </View>

      {/* Popular Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        
        <View style={styles.grid}>
          <TouchableOpacity style={styles.serviceCard}>
            <Ionicons name="laptop" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>Hardware</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.serviceCard}>
            <Ionicons name="wifi" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>Network</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.serviceCard}>
            <Ionicons name="apps" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>Software</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.serviceCard}>
            <Ionicons name="phone-portrait" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>Mobile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#3B82F6" />
          <Text style={[styles.navText, styles.activeNav]}>Home</Text>
        </TouchableOpacity>
        
        <Link href="/chat" asChild>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="chatbubbles-outline" size={24} color="#6B7280" />
            <Text style={styles.navText}>Chat</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/services" asChild>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="grid-outline" size={24} color="#6B7280" />
            <Text style={styles.navText}>Services</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/profile" asChild>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color="#6B7280" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  card: {
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
    backgroundColor: '#3B82F6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#fff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  darkText: {
    color: '#111827',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#6B7280',
  },
  activeNav: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});
