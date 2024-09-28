export interface RegisterUser {
    fullname: string
    email: string
    date: Date
    confirmationCode: string
    password: string
    permissions: Permissions
}

export interface Permissions {
    receiveEmails: boolean
    connectWithNeighbors: boolean
    receiveNotifications: boolean
    termsOfUse: boolean
    privacyPolicy: boolean
}
