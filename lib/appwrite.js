import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config= {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.tiago.aora',
  projectId: '67b8be95002c52d12960',
  databaseId: '67b8bf880035a6ce446b',
  userCollectionId: '67b8bf9f00141183b381',
  videoCollectionId: '67b8bfb80012756291fa',
  storageId: '67b8c0e1000e9c22a1b4'
}

const {
  endpoint,  
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

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
const storage = new Storage(client);


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

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt')] // to get the latest 7

    )

    return posts.documents;
    
  } catch(error) {
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))] // to get the latest 7
    )

    return posts.documents;
    
  } catch(error) {
    throw new Error(error)
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)] // to get the latest 7
    )

    return posts.documents;
    
  } catch(error) {
    throw new Error(error)
  }
}

export  const getUserPosts = async(userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc('$createdAt')] // where the creator is equal to the userId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current') // Delete current session
    return session;
  } catch(error) {
    console.log('error', error)
  }
}

export const getFilePreview = async(fileId, type) => {
  let fileUrl;

  try {
    if(type === 'video') {
      fileUrl = storage.getFileView(storageId, fileId); // to get the file preview from storage
    } else if (type === 'image') {
      fileUrl= storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100); // to get the file preview from storage
    } else {
      throw new Error('Invalid file type')
    }

    if(!fileUrl) throw Error;

    return fileUrl; // return the file preview


  } catch(error) {
    throw new Error(error)
  }
}

export const uploadFile = async ( file, type) => {
  if(!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  }

  try {

    const uploadedFile = await storage.createFile( // to upload the file
      storageId,
      ID.unique(),
      asset
    )

    const fileUrl = await getFilePreview(uploadedFile.$id, type) // to get the file preview from storage

    return fileUrl;

  } catch(error) {
    throw new Error(error)
  }
}

export const createVideo = async (form) => {
  try {

    const [thumbnailUrl,videoUrl] = await Promise.all([ // promise means to wait for the file to be uploaded
      uploadFile(form.thumbnail, 'image'), 
      uploadFile(form.video, 'video'),
    ])

    const newPost = await databases.createDocument( // to create a new post
      databaseId, videoCollectionId, ID.unique(), {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId
      }
    )

    return newPost; // return to use it later

  } catch(error) {
    throw new Error(error)
  }
}



