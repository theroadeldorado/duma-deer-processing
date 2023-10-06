export enum RoleType {
  USER = 'user',
  ADMIN = 'admin',
}

export const RoleTypeLabel = {
  [RoleType.USER]: 'User',
  [RoleType.ADMIN]: 'Admin',
};

export enum EmailVar {
  RecipientName = 'recipientName',
  SetPasswordLink = 'setPasswordLink',
  ResetPasswordLink = 'resetPasswordLink',
}

export const EmailVarCode = {
  [EmailVar.RecipientName]: '#recipient_name#',
  [EmailVar.SetPasswordLink]: '#set_password_link#',
  [EmailVar.ResetPasswordLink]: '#reset_password_link#',
};

export const EmailVarExamples = {
  [EmailVar.RecipientName]: 'John Doe',
  [EmailVar.SetPasswordLink]: 'Set Password',
  [EmailVar.ResetPasswordLink]: 'Reset Password',
};
