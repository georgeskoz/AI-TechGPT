import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SERVICE_PROVIDERS_FILE = path.join(DATA_DIR, 'service_providers.json');

export async function migrateServiceProviders() {
  try {
    // Read users.json
    const usersData = await fs.readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(usersData);

    // Read existing service providers
    let serviceProviders = [];
    try {
      const serviceProvidersData = await fs.readFile(SERVICE_PROVIDERS_FILE, 'utf8');
      serviceProviders = JSON.parse(serviceProvidersData);
    } catch (error) {
      console.log('No existing service providers file found, creating new one');
    }

    // Find users with userType "technician" and move them to service providers
    const technicians = users.filter((user: any) => user.userType === 'technician');
    const remainingUsers = users.filter((user: any) => user.userType !== 'technician');

    if (technicians.length > 0) {
      console.log(`Found ${technicians.length} technicians to migrate:`, technicians.map((t: any) => t.username));

      // Convert technicians to service providers and change userType
      const newServiceProviders = technicians.map((technician: any) => ({
        ...technician,
        userType: 'service_provider' // Change userType to service_provider
      }));

      // Add them to service providers (avoid duplicates)
      for (const newSP of newServiceProviders) {
        const existingIndex = serviceProviders.findIndex((sp: any) => sp.id === newSP.id);
        if (existingIndex >= 0) {
          serviceProviders[existingIndex] = newSP;
        } else {
          serviceProviders.push(newSP);
        }
      }

      // Write updated files
      await fs.writeFile(USERS_FILE, JSON.stringify(remainingUsers, null, 2));
      await fs.writeFile(SERVICE_PROVIDERS_FILE, JSON.stringify(serviceProviders, null, 2));

      console.log(`Successfully migrated ${technicians.length} technicians to service providers`);
      console.log('Updated userType from "technician" to "service_provider"');
    } else {
      console.log('No technicians found to migrate');
    }

    return { migrated: technicians.length, serviceProviders: serviceProviders.length };
  } catch (error) {
    console.error('Error migrating service providers:', error);
    throw error;
  }
}