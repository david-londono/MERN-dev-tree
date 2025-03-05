export type User = {
    handle: string;
    email: string; 
    name: string;
    _id: string;
    description: string;
    image: string;
    links: string
}

export type UserHandle = Pick<User, 'name' | 'handle' | 'description' | 'image' | 'links' >

export type SignupForm = Pick<User, 'handle' | 'email' | 'name'> & {
    password: string;
    password_confirmation: string;
}

export type LoginForm = Pick<User, 'email'> & {
    password: string;
}

export type ProfileForm = Pick<User, 'handle' | 'description'>;

export type SocialNetwork = {
    id: number
    name: string
    url: string
    enabled: boolean
}

export type DevTreeLink = Pick<SocialNetwork, 'name' | 'url' | 'enabled'>