import { Client } from 'react-native-appwrite';

export const config= {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.tiago.aora',
  projectId: '67b8be95002c52d12960',
  databaseId: '67b8bf880035a6ce446b',
  userCollectionId: '67b8bf9f00141183b381',
  videoCollectionId: '67b8bfb80012756291fa',
  storageId: '67b8c0e1000e9c22a1b4'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;
