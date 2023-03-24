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
