import axios from 'axios';

export type UserProfile = {
    'aboutMe': string
    'contacts': {
        'facebook': string | null
        'website': string | null
        'vk': string | null
        'twitter': string | null
        'instagram': string | null
        'youtube': string | null
        'github': string | null
        'mainLink': string | null
    },
    'lookingForAJob': boolean,
    'lookingForAJobDescription': string
    'fullName': string
    'userId': number | null
    'photos': {
        'small': string | undefined
        'large': any
    }
}

export type UserType = {
    name: string
    id: number
    uniqueUrlName: string
    photos: {
        small: string
        large: string
    },
    followed: boolean
    status: string
    location: { city: string, country: string }
}

export const controller = new AbortController();

let instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    headers: {'API-KEY': 'f3f54432-d8c8-49d7-98bb-7ebfd06f7be2'},
    // signal: controller.signal
})
type userAPIType = {
    items: UserType[]
    'totalCount': number
    'error': string
}

type responseAPIType<D = {}> = {
    fieldsErrors: any[]
    resultCode: number
    messages: Array<string>
    data: D
}
export type photosType = {
    photos: { small: string, large: File }
}

export type ProfileUpdateProperties = {
    // userId: number
    lookingForAJob: boolean
    lookingForAJobDescription: string
    fullName: string
    aboutMe: string;
    contacts?: {
        github: string | null
        vk: string | null
        facebook: string | null
        instagram: string | null
        twitter: string | null
        website: string | null
        youtube: string | null
        mainLink: string | null
    }
}

export type UsersQueryParams = {
    count: number
    page: number
    term?: string
    friend?: boolean
}

export const userAPI = {
    getUsers: (params: UsersQueryParams) => instance
        .get<userAPIType>('users', {params})
        .then(res => res.data),

    postFollow: (id: string) => instance
        .post<responseAPIType>(`follow/${id}`)
        .then(res => res.data),

    deleteFollow: (id: string) => instance
        .delete<responseAPIType>(`follow/${id}`)
        .then(res => res.data),

    getUserForProfile: (userID: number) => {
        console.warn('Obsolete method, you must replace your APIs')
        return profileAPI.getProfile(userID)
    },
}

export const profileAPI = {
    getProfile: (userID: number) => instance
        .get<UserProfile>(`profile/${userID}`, {signal: controller.signal})
        .then(res => res.data),

    getStatus: (userID: number | null) => instance
        .get<string>(`profile/status/${userID}`)
        .then(res => res.data),

    updateStatus: (status: string) => instance
        .put<responseAPIType>(`profile/status`, {status})
        .then(res => res.data),

    updateProfile: (payload: ProfileUpdateProperties) => instance
        .put<responseAPIType>(`profile`, payload)
        .then(res => res.data),

    savePhoto: (photoFile: File) => {
        let formData = new FormData();
        formData.append('image', photoFile);
        return instance
            .put<responseAPIType<photosType>>
            (`profile/photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => res.data)
    }


}

export const authAPI = {
    me: () => instance
        .get<responseAPIType<{ id: number, email: string, login: string }>>(`auth/me`)
        .then(res => res.data),

    login: (email: string, password: string, rememberMe: boolean, captcha?: string) => instance
        .post<responseAPIType<{ userId: number }>>
        (`auth/login`, {email, password, rememberMe, captcha})
        .then(res => res.data),

    logout: () => instance
        .delete<responseAPIType>(`auth/login`)
        .then(res => res.data),
}

type ResponseCaptchaType = {
        url: string
}

export const securityAPI = {
    getCaptcha: () => instance
        .get<ResponseCaptchaType>(`security/get-captcha-url`)
        .then(res => res.data),
}


