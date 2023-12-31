export type Auth = {
  userId: string | undefined,
  sessionId: string | undefined,
  sessionToken: Function,
  isLoaded: boolean,
  isSignedIn: boolean | undefined,
  signOut: Function,
  orgId: string | undefined,
  orgRole: string | undefined,
  orgSlug: string | undefined
}
