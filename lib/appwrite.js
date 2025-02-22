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
      username
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
    const sessionList = await account.listSessions();

    if(sessionList.sessions.length > 0) {
      console.log('User is already logged in.')
      return sessionList.sessions[0]; // Return the first session
    }


    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}


export const getCurrentUser = async () => {
  try {
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
