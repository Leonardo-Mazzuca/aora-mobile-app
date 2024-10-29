

declare global {

    type User = {
        $id: string
        email: string
        username: string
        avatar: string
    }

    type Video = {
        $id: string
        title:string
        thumbnail:string
        video: string
        prompt: string
        users: User
    }
}

export {}