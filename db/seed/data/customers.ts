import { v4 as uuidv4 } from "uuid";

export const adminUser = {
  id: uuidv4(),
  username: "admin",
  passwordHash: "$2b$10$DyiUY9J58HRzXcD2e4at.uI28RNiAU3bGk/TDxhVUzb/sP.pj1bxy", // "admin123"
  isAdmin: true,
  isActive: true,
};

export const invitationCodes = [
  {
    id: uuidv4(),
    code: "FAMILY01",
    maxUses: 50,
    usedCount: 0,
    description: "For family members",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    isActive: true,
  },
  {
    id: uuidv4(),
    code: "FRIENDS01",
    maxUses: 50,
    usedCount: 0,
    description: "For close friends",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: uuidv4(),
    code: "WELCOME01",
    maxUses: 50,
    usedCount: 0,
    description: "Welcome batch",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: uuidv4(),
    code: "ACCESS01",
    maxUses: 50,
    usedCount: 0,
    description: "General access code",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: uuidv4(),
    code: "BETA01",
    maxUses: 50,
    usedCount: 0,
    description: "Beta testing group",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    isActive: true,
  },
];
