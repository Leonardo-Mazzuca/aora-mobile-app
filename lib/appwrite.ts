
import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite';


export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    plataform: 'com.jsm.aora',
    projectId: '671fbcb7003b94d90b32',
    databaseId: '671fbda60019ab8363ce',
    userCollectionId: '671fbdc0002f1089a612',
    videCollectionid: '671fbddb00392ebbbec1',
    storageId: '671fbef30009112d1955',
    savedVideosId: '6720fdda00061b7cdfca'
}

const {
    databaseId,
    endpoint,
    plataform,
    projectId,
    storageId,
    userCollectionId,
    videCollectionid,
    savedVideosId
} = config

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.plataform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client)

// Register User
const createUser = async (email:string,password:string,username:string) => {

    try {

        const newAccount = await account.create(ID.unique(),email,password,username)

        if(!newAccount) throw Error
        
        const avatarUrl = avatars.getInitials(username)

        await signIn(email,password)

        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id, 
                email,
                username, 
                avatar: avatarUrl
            }
        )

        return newUser;

    } catch (error:any) {
        console.log('Erro ao registrar usuário: ', error);
        throw new Error(error)
        
    }

}

const signIn = async (email:string,password:string) => {

    try {
        
        const session = await account.createEmailPasswordSession(email,password)

    } catch (error:any) {
        console.log('Erro ao logar: ', error);
        throw new Error(error)
    }   
}

const getCurrentUser = async () => {

    try {

        const currentAccount = await account.get();
        if(!currentAccount) throw Error

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]  )

        if(!currentUser) {
            throw Error
        }

        return currentUser.documents[0]
        
    } catch (error) {
        console.log('Erro ao pegar usuário: ', error);
        
    }
}


const getAllPosts = async () => {

    try {
        
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionid,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents


    } catch (error:any) {
        throw new Error(error)
    }
}

const getLatestPosts = async () => {

    try {
        
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionid,
            [Query.orderDesc('$createdAt'),Query.limit(10)]
        )

        return posts.documents


    } catch (error:any) {
        throw new Error(error)
    }
}

const searchPosts = async (query:string) => {

    try {
        
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionid,
            [Query.search('title',query.toString())]
        )

        return posts.documents


    } catch (error:any) {
        throw new Error(error)
    }
}

const getUserPosts = async (userId:string) => {

    try {
        
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionid,
            [Query.equal('users',userId.toString())]
        )

        return posts.documents


    } catch (error:any) {
        throw new Error(error)
    }
}

const signOut = async() => {

    try {

        const session = await account.deleteSession('current');
        return session;
        
    } catch (error:any) {
        throw new Error(error)
    }    
}

const getFilePreview = async (fileId:string,type:string) => {

    let fileUrl;

    try {

        if(type === 'video') {

            fileUrl = storage.getFileView(storageId,fileId)
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(storageId,fileId,2000,2000,'top' as ImageGravity,100)
        } else {
            throw new Error('Invalid file type')
        }

        if(!fileUrl) {
            throw new Error('Invalid file URL')
        }
        
        return fileUrl

    } catch (error:any) {
        throw new Error(error)
    }
}
const uploadFile = async (file:any,type:string) => {

    if(!file){
        return;
    }


    const asset =  {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    }




    try {

        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

    

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl
        
    } catch (error:any) {
        throw new Error(error)
    }
}

const createVideo = async (form:{title:string,thumbnail:string,video:string,prompt:string,userId:string}) => {


    try {


       const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail,'image'),
        uploadFile(form.video,'video'),
        
       ])

       const newPost = await databases.createDocument(
        databaseId,
        videCollectionid,
        ID.unique(),
        {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            users:form.userId
        }
       )

       return newPost
        
    } catch (error:any) {
        throw new Error(error)
    }
}

const saveVideo = async (videoId:string, userId:string) => {

    try {

        const savedVideo = await databases.createDocument(
            databaseId,
            savedVideosId,
            ID.unique(),
            {
                userId,
                videoId
            }
        )
        
        return savedVideo
        
    } catch (error:any) {
        throw new Error(error)
    }

}


const unsaveVideo = async (videoId:string) => {

    try {

        const documents = await databases.listDocuments(
            databaseId,
            savedVideosId, 
            [Query.equal('videoId', videoId)] 
          );

        const savedVideo = await databases.deleteDocument(
            databaseId,
            savedVideosId,
            videoId
        )
        
        return savedVideo
        
    } catch (error:any) {
        throw new Error(error)
    }

}

const getVideos = async (videoId:string) => {


    try {

        const videos = await databases.listDocuments(
            databaseId,
            videCollectionid,
            [Query.equal('$id',videoId.toString())]
        )

        
        return videos;
    } catch (error:any) {
        throw new Error(error)
    }
}

const getSavedVideos = async (userId:string) => {

    try {

        const savedRecords = await databases.listDocuments(
            databaseId,
            savedVideosId,
            [Query.equal('userId',userId.toString())]
        )

        const videos = await Promise.all(savedRecords.documents.map(async (record) => {
            const video = await getVideos(record.videoId)
            return video.documents[0]
        }))
        
        return videos
        
    }  catch (error:any) {
        throw new Error(error)
    }

}

export {
    createUser,
    signIn,
    getCurrentUser,
    getAllPosts,
    getLatestPosts,
    searchPosts,
    getUserPosts,
    signOut,
    createVideo,
    uploadFile,
    saveVideo,
    getSavedVideos,
    unsaveVideo
}