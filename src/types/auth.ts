export interface RegisterFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
    gender: string;
    birthDate: string;
    userType: string;
    iesId?: string;
}