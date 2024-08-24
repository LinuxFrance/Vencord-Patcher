import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { LinkIcon } from "@components/Icons";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Clipboard, Menu } from "@webpack/common";
import type { Channel, User } from "discord-types/general";

interface UserContextProps {
    channel: Channel;
    guildId?: string;
    user: User;
}

const UserContextMenuPatch: NavContextMenuPatchCallback = (children, { user }: UserContextProps) => {
    if (!user) return;

    children.push(
        <Menu.MenuItem
            id="vc-copy-id-b64"
            label="Copy User Token"
            action={() => Clipboard.copy(btoa(user.id))}
            icon={LinkIcon}
        />
    );
};




export default definePlugin({
    name: "Bouton Troll",
    description: "juste pour troll",
    authors: [{ name: "w0l6", id: BigInt("1062336603034501190") }],
    tags: ["Dev"],
    contextMenus: {
        "user-context": UserContextMenuPatch
    }
});;

