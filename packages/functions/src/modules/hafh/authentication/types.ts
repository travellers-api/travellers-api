export type VerifyPasswordResponse = {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  profilePicture: string;
  refreshToken: string;
  expiresIn: string;
};

export type GetAccountInfoResponse = {
  kind: 'identitytoolkit#GetAccountInfoResponse';
  users: {
    localId: string;
    email: string;
    photoUrl: string;
    passwordHash: string;
    emailVerified: true;
    passwordUpdatedAt: number;
    providerUserInfo: (
      | {
          providerId: 'phone';
          rawId: string;
          phoneNumber: string;
        }
      | {
          providerId: 'password';
          photoUrl: string;
          federatedId: string;
          email: string;
          rawId: string;
        }
    )[];
    validSince: string;
    lastLoginAt: string;
    createdAt: string;
    phoneNumber: string;
    lastRefreshAt: string;
  }[];
};
