export interface UserProfile {
    firstName: string;
    lastName: string;
}

export interface UserAccount {
    username: string;
    email: string;
    password_hash: string;
}


export interface RegisterUserInput extends UserAccount{
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  profile?: any;
}

// Component specific props interfaces
export interface UserProfileProps {
  user: UserResponse;
  onUpdate: (data: UserAccount) => void;
}
