import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestoreDb } from "./firebase";

export type AuthProviderType = "email" | "google";

interface AuthProviderPayload {
    email: string;
    role: string;
    authProvider: AuthProviderType;
    firebaseUid?: string;
}

const USERS_COLLECTION = "users";
const PROVIDER_CACHE_KEY = "authProviderByEmail";

const memoryCache: Record<string, AuthProviderType> = {};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const readStorageCache = (): Record<string, AuthProviderType> => {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        const raw = localStorage.getItem(PROVIDER_CACHE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const writeStorageCache = (cache: Record<string, AuthProviderType>) => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        localStorage.setItem(PROVIDER_CACHE_KEY, JSON.stringify(cache));
    } catch {
        // ignore localStorage write errors
    }
};

export const getCachedAuthProviderByEmail = (email: string): AuthProviderType | null => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
        return null;
    }

    if (memoryCache[normalizedEmail]) {
        return memoryCache[normalizedEmail];
    }

    const storageCache = readStorageCache();
    const cachedProvider = storageCache[normalizedEmail] || null;
    if (cachedProvider) {
        memoryCache[normalizedEmail] = cachedProvider;
    }

    return cachedProvider;
};

const setCachedAuthProviderByEmail = (email: string, provider: AuthProviderType) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
        return;
    }

    memoryCache[normalizedEmail] = provider;
    const storageCache = readStorageCache();
    storageCache[normalizedEmail] = provider;
    writeStorageCache(storageCache);
};

export const getAuthProviderByEmail = async (email: string): Promise<AuthProviderType | null> => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
        return null;
    }

    const cachedProvider = getCachedAuthProviderByEmail(normalizedEmail);
    if (cachedProvider) {
        return cachedProvider;
    }

    const snapshot = await getDoc(doc(firestoreDb, USERS_COLLECTION, normalizedEmail));
    if (!snapshot.exists()) {
        return null;
    }

    const data = snapshot.data() as { authProvider?: AuthProviderType };
    const provider = data.authProvider || null;

    if (provider) {
        setCachedAuthProviderByEmail(normalizedEmail, provider);
    }

    return provider;
};

export const upsertAuthProviderByEmail = async ({
    email,
    role,
    authProvider,
    firebaseUid,
}: AuthProviderPayload): Promise<void> => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
        return;
    }

    await setDoc(
        doc(firestoreDb, USERS_COLLECTION, normalizedEmail),
        {
            email: normalizedEmail,
            role,
            authProvider,
            firebaseUid: firebaseUid || null,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );

    setCachedAuthProviderByEmail(normalizedEmail, authProvider);
};
