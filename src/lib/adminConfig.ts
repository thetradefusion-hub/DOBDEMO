export const ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL?.trim() || 'admin@digitalonebox.com'

export const OPEN_DATABASE_RULES = `{
  "rules": {
    "demos": {
      ".read": true,
      ".write": "auth != null",
      "$id": {
        "viewCount": { ".write": true }
      }
    },
    "categories": {
      ".read": true,
      ".write": "auth != null"
    },
    "landings": {
      ".read": true,
      ".write": "auth != null"
    },
    "requests": {
      ".read": "auth != null",
      "$id": {
        ".write": "auth != null || !data.exists()"
      }
    },
    "vault": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}`

export const RULES_CONSOLE_URL =
  'https://console.firebase.google.com/project/dobdemo/database/dobdemo-default-rtdb/rules'

export const AUTH_CONSOLE_URL =
  'https://console.firebase.google.com/project/dobdemo/authentication/providers'
