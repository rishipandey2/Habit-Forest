import { ID, Query } from "appwrite";
import { account, databases, DATABASE_ID, COLLECTIONS } from "./config";

// Auth functions
export const authAPI = {
  async createAccount(email, password, name) {
    if (!email || !password || !name) {
      throw new Error("Email, password, and name are required.");
    }
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      await authAPI.createSession(email, password);
      return newAccount;
    } catch (error) {
      console.error("createAccount error:", error);
      throw error;
    }
  },

  async createSession(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("createSession error:", error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      console.error("getCurrentUser error:", error);
      return null;
    }
  },

  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("logout error:", error);
      throw error;
    }
  },
};

// Database functions
export const dbAPI = {
  async createHabit(habitData) {
    if (!habitData || !habitData.userId) {
      throw new Error("habitData with userId is required.");
    }
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.HABITS,
        ID.unique(),
        habitData
      );
    } catch (error) {
      console.error("createHabit error:", error);
      throw error;
    }
  },

  async getHabits(userId) {
    if (!userId) {
      throw new Error("userId is required.");
    }
    try {
      return await databases.listDocuments(DATABASE_ID, COLLECTIONS.HABITS, [
        Query.equal("userId", userId),
      ]);
    } catch (error) {
      console.error("getHabits error:", error);
      throw error;
    }
  },

  async updateHabit(habitId, habitData) {
    if (!habitId || !habitData) {
      throw new Error("habitId and habitData are required.");
    }
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.HABITS,
        habitId,
        habitData
      );
    } catch (error) {
      console.error("updateHabit error:", error);
      throw error;
    }
  },

  async deleteHabit(habitId) {
    if (!habitId) {
      throw new Error("habitId is required.");
    }
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.HABITS,
        habitId
      );
    } catch (error) {
      console.error("deleteHabit error:", error);
      throw error;
    }
  },

  async createCompletion(completionData) {
    if (!completionData || !completionData.userId || !completionData.habitId) {
      throw new Error("completionData with userId and habitId is required.");
    }
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.COMPLETIONS,
        ID.unique(),
        completionData
      );
    } catch (error) {
      console.error("createCompletion error:", error);
      throw error;
    }
  },

  async getCompletions(userId) {
    if (!userId) {
      throw new Error("userId is required.");
    }
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMPLETIONS,
        [Query.equal("userId", userId)]
      );
    } catch (error) {
      console.error("getCompletions error:", error);
      throw error;
    }
  },

  async deleteCompletion(completionId) {
    if (!completionId) {
      throw new Error("completionId is required.");
    }
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.COMPLETIONS,
        completionId
      );
    } catch (error) {
      console.error("deleteCompletion error:", error);
      throw error;
    }
  },

  async deleteHabitCompletions(habitId) {
    if (!habitId) {
      throw new Error("habitId is required.");
    }
    try {
      const completions = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMPLETIONS,
        [Query.equal("habitId", habitId)]
      );

      const deletePromises = completions.documents.map((completion) =>
        dbAPI.deleteCompletion(completion.$id)
      );

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("deleteHabitCompletions error:", error);
      throw error;
    }
  },
};
