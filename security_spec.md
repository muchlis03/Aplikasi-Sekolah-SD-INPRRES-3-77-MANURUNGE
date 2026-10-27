# Security Specification for Guru Hebat Firestore Rules

## 1. Data Invariants
- Each authenticated user (Teacher) has their own private data partition isolated under `/users/{userId}/...` and `/artifacts/{appId}/users/{userId}/...`.
- User A (`userId = uidA`) cannot read, write, update, or delete any data belonging to User B (`userId = uidB`).
- Unauthenticated requests are completely rejected with `PERMISSION_DENIED`.
- Document IDs must conform to safe regex patterns `^[a-zA-Z0-9_\-]+$` and not exceed 128 characters.
- Default deny catch-all `match /{document=**} { allow read, write: if false; }` prevents access to arbitrary collections.

## 2. Dirty Dozen Payloads & Test Scenarios
1. **Unauthenticated Read**: Anonymous/Unauthenticated user queries `/users/teacher_123/appData/schoolInfo` -> DENIED.
2. **Cross-User Snooping**: User B attempts to read `/users/userA/appData/students` -> DENIED.
3. **Cross-User Tampering**: User B attempts to overwrite User A's `/users/userA/appData/grades` -> DENIED.
4. **Path Variable ID Injection**: User attempts to create a document with ID `../../secrets` or invalid characters -> DENIED by `isValidId`.
5. **Junk String ID Attack**: Document ID > 128 characters -> DENIED by `isValidId`.
6. **Root Collection Access**: Querying root collections directly without a user path -> DENIED by default catch-all.
7. **Cross-Tenant Artifact Hijacking**: User B attempts to write to `/artifacts/app-1/users/userA/appData/schoolInfo` -> DENIED.
8. **Malicious Delete**: User B tries to delete User A's students list -> DENIED.
9. **Fake Auth UID Header**: Modifying client payload to claim another UID -> DENIED because rule verifies against cryptographic `request.auth.uid`.
10. **Arbitrary Collection Write**: Attempting to write to `/admin_secrets/{id}` -> DENIED.
11. **Spoofed User Profile**: User B writing to `/users/userA/profile/info` -> DENIED.
12. **Public Data Exfiltration**: Attempting a blanket `list` without passing their own authenticated userId -> DENIED.
