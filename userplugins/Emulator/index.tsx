/*
 * w0l6, a
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { DeleteIcon } from "@components/Icons";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Clipboard, Menu } from "@webpack/common";
import type { Channel, User } from "discord-types/general";

interface UserContextProps {
    channel: Channel;
    guildId?: string;
    user: User;
}

// Composant pour le bouton d'émulation
const EmulateButton = ({ isEmulated, toggleEmulate }: { isEmulated: boolean; toggleEmulate: () => void }) => (
    <div className="emulate-button" onClick={toggleEmulate} style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
        <div className={`emulate-icon ${isEmulated ? 'emulated' : ''}`}>
            {isEmulated ? '📱' : '📞'}
        </div>
        {isEmulated && (
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '2px',
                backgroundColor: 'green',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                zIndex: 1
            }} />
        )}
    </div>
);

// Fonction pour ajouter le menu contextuel
const addContextMenu = (user: User, channel: Channel) => {
    Menu.addItem({
        label: 'Toggle Emulate',
        icon: <DeleteIcon />,
        action: () => {
            console.log(`${user.username} is now ${user.isEmulated ? 'emulated' : 'not emulated'}.`);
            user.isEmulated = !user.isEmulated; // Toggle l'état emulated
        }
    });
};

// Exportation du plugin
export default definePlugin({
    name: "Emulator From Vencord",
    description: "Emuler sur telephone et play fuck discord !",
    authors: [{ name: "w0l6", id: BigInt("1062336603034501190") }],
    tags: ["Vencord", "ulx", "ulib"],
    contextMenus: {
        "user-context": addContextMenu // Correction ici : ajouter la fonction addContextMenu
    }
});
