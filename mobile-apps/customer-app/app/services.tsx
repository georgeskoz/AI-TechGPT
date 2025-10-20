import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const services = [
  { id: 1, title: 'Hardware Issues', icon: 'laptop', color: '#3B82F6', description: 'Computer, laptop, and device repairs' },
  { id: 2, title: 'Network Setup', icon: 'wifi', color: '#10B981', description: 'WiFi, router, and network troubleshooting' },
  { id: 3, title: 'Software Help', icon: 'apps', color: '#8B5CF6', description: 'Installation and software issues' },
  { id: 4, title: 'Mobile Devices', icon: 'phone-portrait', color: '#F59E0B', description: 'Smartphone and tablet support' },
  { id: 5, title: 'Data Recovery', icon: 'cloud-download', color: '#EF4444', description: 'Recover lost or deleted files' },
  { id: 6, title: 'Security', icon: 'shield-checkmark', color: '#06B6D4', description: 'Antivirus and security setup' },
];

export default function ServicesScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Services</Text>
        <Text style={styles.subtitle}>Choose the help you need</Text>
      </View>

      {services.map((service) => (
        <TouchableOpacity
          key={service.id}
          style={styles.serviceCard}
        >
          <View style={[styles.iconContainer, { backgroundColor: service.color + '20' }]}>
            <Ionicons name={service.icon as any} size={32} color={service.color} />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      ))}

      <View style={styles.emergencyCard}>
        <Ionicons name="warning" size={32} color="#EF4444" />
        <Text style={styles.emergencyTitle}>Need Urgent Help?</Text>
        <Text style={styles.emergencyText}>Call our 24/7 emergency hotline</Text>
        <TouchableOpacity style={styles.emergencyButton}>
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={styles.emergencyButtonText}>Call Now</Text>
        </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 12,
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
