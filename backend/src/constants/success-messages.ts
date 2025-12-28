export const SuccessMessages ={
 REGISTRATION_SUCCESS:'User registered successfully' ,
 SIGNOUT_SUCCESS:'Logged out successfully',
 LOGIN_SUCCESS:'Logged in successfully',
} as const;

export type SuccessMessagesType= typeof SuccessMessages[keyof typeof SuccessMessages]