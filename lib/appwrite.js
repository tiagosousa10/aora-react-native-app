import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

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

const account = new Account(client); // Init Account Service
const avatars = new Avatars(client);
const databases = new Databases(client);



export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export const signIn = async (email, password) => {
  try {
  // First, delete any existing session (log out if already logged in)
  await deleteSession()
  // Create a new session with the provided email and password
  const session = await account.createEmailSession(email, password);

  // Ensure session was created successfully
  if (!session) {
    throw new Error("Failed to create session");
  }

  return session;

  } catch (error) {
    throw new Error(error);
  }
}

const deleteSession = async () => {
  try {
    const activeSessions = await account.listSessions(); // Get active sessions
    if (activeSessions.total > 0) {
      await account.deleteSession("current")     // Delete current session
    }
  } catch (error) {
    console.log("No session available.");
  }
};

export const getCurrentUser = async () => {
  try {
    console.log('cheguei aqui')
    const currentAccount = await account.get();

    if(!currentAccount) {
      throw Error('No user logged in.')
    }

   const currentUser = await databases.listDocuments(
     config.databaseId,
     config.userCollectionId,
     [Query.equal('accountId', currentAccount.$id)]
   )    

   if(!currentUser) {
    throw Error;
   }

   return currentUser.documents[0];

  } catch(error) {
    console.log(error)
  }
}
