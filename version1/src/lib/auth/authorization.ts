import { NextResponse } from "next/server";
import type { Types, HydratedDocument } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getSessionUserId } from "@/lib/auth/session";
import User, { type IUser, type UserRole } from "@/models/User";

export type AuthUser = HydratedDocument<IUser>;

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }

  toResponse() {
    return NextResponse.json(
      {
        success: false,
        message: this.message,
      },
      { status: this.status },
    );
  }
}

/**
 * Handle authentication and authorization errors consistently.
 * Returns a NextResponse if the error is an AuthError, or null otherwise.
 */
export function handleAuthError(error: unknown): NextResponse | null {
  if (error instanceof AuthError) {
    return error.toResponse();
  }
  return null;
}

/**
 * Reads the current session and fetches the user from the database.
 * Returns null if not authenticated or user does not exist.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  await connectToDatabase();
  const user = await User.findById(userId);

  return user;
}

/**
 * Ensures the request has a valid authenticated session and user.
 * Throws an AuthError (401) if not authenticated.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthError("Authentication required. Please log in.", 401);
  }

  return user;
}

/**
 * Ensures the authenticated user has one of the allowed roles.
 * Throws AuthError (401) if unauthenticated, or AuthError (403) if forbidden.
 */
export async function requireRole(...roles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth();

  if (!roles.includes(user.role)) {
    throw new AuthError("Forbidden: Insufficient permissions", 403);
  }

  return user;
}

/**
 * Architecture-ready venue access check:
 * - Admin has access to all venues
 * - Manager only has access to their assigned venueId
 * - Normal user has no venue management permissions
 */
export async function requireVenueAccess(
  venueId: string | Types.ObjectId,
): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role === "admin") {
    return user;
  }

  if (user.role === "manager") {
    if (!user.venueId) {
      throw new AuthError("Forbidden: No venue assigned to manager", 403);
    }

    const assignedId = user.venueId.toString();
    const targetId = venueId.toString();

    if (assignedId !== targetId) {
      throw new AuthError(
        "Forbidden: You do not have access to this venue",
        403,
      );
    }

    return user;
  }

  throw new AuthError("Forbidden: Venue management permission required", 403);
}
