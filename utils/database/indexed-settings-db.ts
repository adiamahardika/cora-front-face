// indexedDBUtils.ts

const dbName = "BackgroundDB";
const storeName = "BackgroundImages";

// Function to open IndexedDB

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBRequest).result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, {keyPath: "id"});
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Function to save data to IndexedDB
export const saveToIndexedDB = async (key: string, file: Blob) => {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);

            store.put({id: key, data: reader.result});

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
};

// Function to retrieve data from IndexedDB
export const getFromIndexedDB = async (key: string): Promise<string | null> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = () => reject(request.error);
    });
};
