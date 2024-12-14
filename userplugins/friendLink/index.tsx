/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { Link as ImportedLink } from "@components/Link";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Menu, MessageActions, PermissionsBits, PermissionStore, SelectedChannelStore, showToast } from "@webpack/common";

interface LinkProps {
    className?: string;
    height?: number;
    width?: number;
}

interface Module {
    exports?: {
        Z?: {
            createFriendInvite?: () => Promise<{ code: string; }>;
        };
    };
}

const Link: React.FC<LinkProps> = ({ className, height, width }) => {
    return (
        <div className={className} style={{ height, width }}>
            {/* Contenu */}
        </div>
    );
};

async function getCreateFriendInvite(): Promise<(() => Promise<{ code: string; }> | undefined) | undefined> {
    try {
        // Assurez-vous que les modules Webpack sont chargés
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attente pour garantir le chargement complet des modules

        const chunks = window.webpackChunkdiscord_app;
        if (!chunks || chunks.length === 0) {
            throw new Error("No Webpack chunks found.");
        }

        // Inspecter chaque chunk pour trouver la fonction createFriendInvite
        for (const chunk of chunks) {
            if (chunk && chunk[1]) {
                console.log("Inspecting chunk:", chunk);
                for (const module of Object.values(chunk[1])) {
                    if (module && module.exports && module.exports.Z && module.exports.Z.createFriendInvite) {
                        console.log("Found createFriendInvite in module:", module);
                        return module.exports.Z.createFriendInvite;
                    }
                }
            }
        }

        throw new Error("createFriendInvite function not found in loaded modules");
    } catch (error) {
        console.error("Error retrieving createFriendInvite:", error);
        throw error;
    }
}

const OptionClasses = findByPropsLazy("optionName", "optionIcon", "optionLabel");

const ctxMenuPatch: NavContextMenuPatchCallback = (children, props) => {
    if (props.channel.guild_id && !(PermissionStore.can(PermissionsBits.SEND_VOICE_MESSAGES, props.channel) && PermissionStore.can(PermissionsBits.SEND_MESSAGES, props.channel))) return;

    children.push(
        <Menu.MenuItem
            id="vc-send-friendlink"
            label={
                <div className={OptionClasses.optionLabel}>
                    <ImportedLink className={OptionClasses.optionIcon} height={24} width={24} /> {/* Utilisation de l'importation */}
                    <div className={OptionClasses.optionName}>Send friend invite</div>
                </div>
            }
            action={async () => {
                try {
                    const channelId = SelectedChannelStore.getChannelId(); // Get the selected channel ID
                    if (channelId) {
                        const createInvite = await getCreateFriendInvite();
                        if (createInvite) {
                            const inviteLink = await createInvite(); // Exécutez la fonction pour obtenir le code
                            if (inviteLink && inviteLink.code) {
                                const fullInviteLink = `https://discord.gg/${inviteLink.code}`;
                                MessageActions.sendMessage(channelId, {
                                    content: `Here's your friend invite: ${fullInviteLink}`
                                });
                                showToast("Friend invite sent!");
                            } else {
                                showToast("Failed to send friend invite. Invite link is invalid.");
                            }
                        } else {
                            showToast("Failed to send friend invite. Create invite function is undefined.");
                        }
                    } else {
                        showToast("Failed to send friend invite. No channel selected.");
                    }
                } catch (error) {
                    console.error("Error sending friend invite:", error);
                    showToast("Failed to send friend invite.");
                }
            }}
        />
    );
};

export default definePlugin({
    name: "Friend Links",
    description: "Create a link for invite friend to add you",
    authors: [{ name: "w0l6", id: BigInt("1062336603034501190") }],
    contextMenus: {
        "channel-attach": ctxMenuPatch
    }
});
