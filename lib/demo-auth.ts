export interface DemoUser {
  id: string
  email: string
  name: string
  createdAt: string
}

const AUTH_KEY = "demo_auth_user"

export function getDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(AUTH_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setDemoUser(user: DemoUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function clearDemoUser(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function demoSignUp(email: string, password: string): DemoUser {
  const user: DemoUser = {
    id: crypto.randomUUID(),
    email,
    name: email.split("@")[0],
    createdAt: new Date().toISOString(),
  }
  setDemoUser(user)
  return user
}

export function demoSignIn(email: string, password: string): DemoUser | null {
  const existingUser = getDemoUser()
  if (existingUser && existingUser.email === email) {
    return existingUser
  }
  return demoSignUp(email, password)
}

export function demoSignOut(): void {
  clearDemoUser()
}

export function updateDemoUserName(name: string): void {
  const user = getDemoUser()
  if (user) {
    user.name = name
    setDemoUser(user)
  }
}
