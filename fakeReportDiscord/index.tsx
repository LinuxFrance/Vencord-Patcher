import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { SafetyIcon } from "@components/Icons";
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
            id="vc-copy-report-vencord"
            label="Report from Vencord"
            action={() => Clipboard.copy(btoa(user.id))}
            icon={SafetyIcon}
            className="item_d90b3d labelContainer_d90b3d colorDanger_d90b3d colorDefault_d90b3d"
        />
    );
};






export default definePlugin({
    name: "Ban From Vencord",
    description: "Juste pour bannir quelqu'un de Vencord !",
    authors: [{ name: "w0l6", id: BigInt("1062336603034501190") }],
    tags: ["Vencord","ulx","ulib","Vencord-Ban"],
    contextMenus: {
        "user-context": UserContextMenuPatch
    }
});;

