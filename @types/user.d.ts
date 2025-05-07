interface UserBasicInfo {
    id: string
    name: string
    displayName: string
    pictureUrl: string
    biography: string
}

interface SupervisedUser {
    supervisorUserId: true
    updatedAt: true
    supervisorUser: UserBasicInfo
}

interface SupervisorUsers {
    supervisedUserId: true
    updatedAt: true
    supervisedUser: UserBasicInfo
}

interface User {
    id: string
    name: string
    displayName: string
    biography: string
    email: string
    emailVerified: boolean
    document: string
    documentType: string
    documentVerified: boolean
    pictureUrl: string
    phone: string
    phoneVerified: boolean
    scopes: string[]
    adressesIds: string[]
    role: string
    birthday: Date
    receiveEmails: boolean
    receiveNotifications: boolean
    connectWithNeighbors: boolean
    termsAccepted: boolean
    privacyAccepted: boolean
    createdAt: Date
    updatedAt: Date
    organizations: {
        id: string
        role: string
        organization: {
            id: string
            name: string
            pictureUrl: string
        }
    }[]
    supervisedUsers?: SupervisedUser[]
    supervisorUsers?: SupervisorUsers[]
}

interface Contact {
    id: string
    name: string
    displayName: string
    pictureUrl: string
    type: 'user' | 'organization'
    role: string
    verified: boolean
}

interface ContactList {
    id: string
    name: string
    displayName: string
    pictureUrl: string
    organizations?: {
        role: string
        organization: {
            id: string
            name: string
            displayName: string
            pictureUrl: string
            verified: boolean
        }
    }[]
    supervisedUsers?: {
        supervisedUser: {
            id: string
            name: string
            displayName: string
            pictureUrl: string
        }
    }[]
    supervisorUsers?: {
        supervisorUser: {
            id: string
            name: string
            displayName: string
            pictureUrl: string
        }
    }[]
}
