import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { db } from './db';
import { redirect } from 'next/navigation';
/**
 * Fetch authenticated user details from your database.
 */
export const getAuthUserDetails = async () => {
    const user = await currentUser();
    if (!user) return null;

    const userData = await db.user.findUnique({
        where: {
            email: user.emailAddresses[0]?.emailAddress || '',
        },
        include: {
            agency: {
                include: {
                    SidebarOption: true,
                    SubAccount: {
                        include: {
                            SidebarOption: true,
                        },
                    },
                },
            },
            Permissions: true,
        },
    });

    return userData;
};

/**
 * Save activity logs as notifications.
 */
export const saveActivityLogsNotification = async ({
    agencyId,
    description,
    subaccountId,
}: {
    agencyId?: string;
    description: string;
    subaccountId?: string;
}) => {

    const authUser = await currentUser();
    let userData;

    if (!authUser) {
        userData = await db.user.findFirst({
            where: {
                agency: {
                    SubAccount: {
                        some: { id: subaccountId },
                    },
                },
            },
        });
    } else {
        userData = await db.user.findUnique({
            where: {
                email: authUser.emailAddresses[0]?.emailAddress || '',
            },
        });
    }

    if (!userData) {
        console.error('User not found for activity log');
        return;
    }

    let foundAgencyId = agencyId;
    if (!foundAgencyId && subaccountId) {
        const sub = await db.subAccount.findUnique({ where: { id: subaccountId } });
        if (sub) foundAgencyId = sub.agencyId;
    }

    try {
        await db.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: { id: userData.id },
                },
                agency: {
                    connect: { id: foundAgencyId },
                },
                ...(subaccountId && {
                    subAccount: {
                        connect: { id: subaccountId },
                    },
                }),
            },
        });
    } catch (err) {
        console.error('Failed to save notification:', err);
    }
};

/**
 * Creates a team user and assigns them to an agency.
 */
export const createTeamUser = async (
    agencyId: string,
    user: any
    // user: User
) => {
    if (user.role === 'AGENCY_OWNER') return null;

    return await db.user.create({
        data: {
            ...user,
        },
    });
};

/**
 * Verifies invitation and creates the user if pending.
 */
export const verifyAndAcceptInvitation = async () => {
    const user = await currentUser();
    if (!user) return redirect('/sign-in');

    const email = user.emailAddresses[0]?.emailAddress;

    const invitation = await db.invitation.findUnique({
        where: {
            email,
            status: 'PENDING',
        },
    });

    if (invitation) {
        const userDetails = await createTeamUser(invitation.agencyId, {
            email: invitation.email,
            agencyId: invitation.agencyId,
            avatarUrl: user.imageUrl || '',
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            role: invitation.role || 'AGENCY_MEMBER',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await saveActivityLogsNotification({
            agencyId: invitation.agencyId,
            description: 'Joined',
        });

        if (userDetails) {
            const client = await clerkClient()
            await client.users.updateUserMetadata(user.id, {
                privateMetadata: {
                    role: userDetails.role || 'SUBACCOUNT_USER',
                },
            });

            await db.invitation.delete({
                where: { email: userDetails.email },
            });

            return userDetails.agencyId;
        } else {
            return null;
        }
    } else {
        const agency = await db.user.findUnique({
            where: {
                email: email || '',
            },
        });
        return agency?.agencyId || null;
    }
};
