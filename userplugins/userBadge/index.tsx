import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { LinkIcon } from "@components/Icons";
import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";
import type { User } from "discord-types/general";
import { React } from "@webpack/common";

// TypeScript interface pour les props du composant Checkbox
interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
}

// Composant Checkbox
const Checkbox = ({ checked, onChange }: CheckboxProps) => (
    <div className="checkbox-container">
        <input
            type="checkbox"
            className="discord-checkbox"
            checked={checked}
            onChange={onChange}
        />
    </div>
);

// Liste des badges Discord officiels
const discordBadges = [
    { id: "discord-employee", label: "Discord Employee", imgSrc: "https://cdn.discordapp.com/badge-icons/5e74e9b61934fc1f67c65515d1f7e60d.png" },
    { id: "discord-mod-alumni", label: "Discord Mod Alumni", imgSrc: "https://cdn.discordapp.com/badge-icons/fee1624003e2fee35cb398e125dc479b.png" },
    { id: "hypesquad", label: "HypeSquad", imgSrc: "https://cdn.discordapp.com/badge-icons/8a88d63823d8a71cd5e390baa45efa02.png" },
    { id: "bug-hunter", label: "Bug Hunter", imgSrc: "https://cdn.discordapp.com/badge-icons/7d9ae358c8c5e118768335dbe68b4fb8.png" },
    { id: "early-supporter", label: "Early Supporter", imgSrc: "https://cdn.discordapp.com/badge-icons/2ba85e8026a8614b640c2837bcdfe21b.png" }
];

// Fonction pour vérifier la disponibilité de localStorage
function isLocalStorageAvailable(): boolean {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

// État des badges pour chaque utilisateur, stocké dans localStorage
let userBadgeState: Record<string, Set<string>> = {};

if (isLocalStorageAvailable()) {
    userBadgeState = JSON.parse(localStorage.getItem('userBadgeState') || '{}');
}

// Fonction pour sauvegarder l'état des badges dans le stockage local
function saveBadgeState() {
    if (isLocalStorageAvailable()) {
        localStorage.setItem('userBadgeState', JSON.stringify(userBadgeState));
        console.log('État des badges sauvegardé dans localStorage:', userBadgeState);
    }
}

// Fonction pour obtenir le conteneur de badges de profil utilisateur
function getProfileBadgesContainer(): HTMLElement | null {
    // Essayer de sélectionner le conteneur via plusieurs sélecteurs possibles
    let container = document.querySelector('.container_e5a42d[aria-label="Badges d\'utilisateur"]') as HTMLElement | null;
    
    if (!container) {
        // Ajoutez ici d'autres sélecteurs possibles si nécessaire
        console.error('Conteneur pour les badges de profil non trouvé.');
    }
    return container;
}

// Fonction pour ajouter un badge au profil utilisateur
function addBadge(user: User, badgeId: string) {
    console.log(`Ajout du badge ${badgeId} à l'utilisateur ${user.username}`);

    const profileBadgesContainer = document.querySelector('.container_e5a42d[aria-label="Badges d\'utilisateur"]') as HTMLElement | null;
    if (profileBadgesContainer) {
        const existingBadgeElement = profileBadgesContainer.querySelector(`.badge-${badgeId}`);
        if (existingBadgeElement) {
            console.log(`Badge ${badgeId} déjà présent dans le profil.`);
            return;
        }

        const badge = discordBadges.find(badge => badge.id === badgeId);
        if (badge) {
            const badgeElement = document.createElement('div');
            badgeElement.className = `badge badge-${badgeId}`;
            badgeElement.style.display = 'inline-block';
            badgeElement.style.marginRight = '4px';

            const badgeLink = document.createElement('a');
            badgeLink.className = 'anchor_af404b anchorUnderlineOnHover_af404b';
            badgeLink.href = badge.imgSrc;
            badgeLink.target = '_blank';
            badgeLink.rel = 'noreferrer noopener';
            badgeLink.role = 'button';
            badgeLink.tabIndex = 0;

            const badgeImage = document.createElement('img');
            badgeImage.alt = '';
            badgeImage.src = badge.imgSrc;
            badgeImage.className = 'badge_e5a42d';
            badgeImage.style.width = '20px';
            badgeImage.style.height = '20px';

            badgeLink.appendChild(badgeImage);
            badgeElement.appendChild(badgeLink);
            profileBadgesContainer.appendChild(badgeElement);
            sortBadges(profileBadgesContainer);
            console.log(`Badge ${badgeId} ajouté avec succès.`);
        } else {
            console.error(`Badge ${badgeId} non trouvé dans les badges Discord.`);
        }
    } else {
        console.error('Conteneur pour les badges de profil non trouvé.');
    }
}

function applyBadge(badgeId: string, badgeUrl: string) {
    const profileBadgesContainer = document.querySelector('.container_e5a42d[aria-label="Badges d\'utilisateur"]') as HTMLElement | null;
    
    if (profileBadgesContainer && !profileBadgesContainer.querySelector(`.badge-${badgeId}`)) {
        const badgeElement = document.createElement('div');
        badgeElement.className = `badge badge-${badgeId}`;
        badgeElement.style.display = 'inline-block';
        badgeElement.style.marginRight = '4px';

        const badgeLink = document.createElement('a');
        badgeLink.className = 'anchor_af404b anchorUnderlineOnHover_af404b';
        badgeLink.href = badgeUrl;
        badgeLink.target = '_blank';
        badgeLink.rel = 'noreferrer noopener';
        badgeLink.role = 'button';
        badgeLink.tabIndex = 0;

        const badgeImage = document.createElement('img');
        badgeImage.alt = '';
        badgeImage.src = badgeUrl;
        badgeImage.className = 'badge_e5a42d';
        badgeImage.style.width = '20px';
        badgeImage.style.height = '20px';

        badgeLink.appendChild(badgeImage);
        badgeElement.appendChild(badgeLink);
        profileBadgesContainer.appendChild(badgeElement);
    }
}

// Fonction pour retirer un badge du profil utilisateur
function removeBadge(user: User, badgeId: string) {
    console.log(`Retrait du badge ${badgeId} de l'utilisateur ${user.username}`);

    const badgeElement = document.querySelector(`.badge-${badgeId}`);
    if (badgeElement) {
        badgeElement.remove();
        console.log(`Badge ${badgeId} retiré avec succès.`);
    } else {
        console.warn(`Badge ${badgeId} non trouvé dans le profil.`);
    }
}


// Fonction pour trier les badges dans l'ordre souhaité
function sortBadges(container: HTMLElement) {
    const badgeOrder = [
        "discord-employee",
        "discord-mod-alumni",
        "hypesquad",
        "bug-hunter",
        "early-supporter"
    ];

    const badges = Array.from(container.querySelectorAll('[class^="badge-"]'));
    badges.sort((a, b) => {
        const idA = a.className.replace('badge badge-', '');
        const idB = b.className.replace('badge badge-', '');
        return badgeOrder.indexOf(idA) - badgeOrder.indexOf(idB);
    });

    badges.forEach(badge => container.appendChild(badge));
}

// Fonction pour mettre à jour les badges d'un utilisateur
function updateBadgesForUser(user: User) {
    const profileBadgesContainer = getProfileBadgesContainer();
    if (profileBadgesContainer) {
        // Supprimer les badges existants
        const existingBadges = profileBadgesContainer.querySelectorAll('[class^="badge-"]');
        existingBadges.forEach(badge => badge.remove());

        // Ajouter les badges stockés
        const badges = Array.from(userBadgeState[user.id] || []);
        badges.forEach(badgeId => addBadge(user, badgeId));
    } else {
        console.error('Conteneur pour les badges de profil non trouvé.');
    }
}

// Fonction de patch pour le menu contextuel des utilisateurs
const UserContextMenuPatch: NavContextMenuPatchCallback = (children, { user }: { user: User }) => {
    if (!user) return;

    if (!userBadgeState[user.id]) {
        userBadgeState[user.id] = new Set<string>();
    }

    const submenu = (
        <Menu.MenuItem
            id="vc-user-badge"
            label="Badge"
            icon={LinkIcon}
        >
            <Menu.MenuGroup>
                {discordBadges.map(badge => (
                    <Menu.MenuItem
                        id={`vc-${badge.id}`}
                        label={badge.label}
                        action={() => {
                            if (userBadgeState[user.id].has(badge.id)) {
                                userBadgeState[user.id].delete(badge.id);
                                removeBadge(user, badge.id);
                            } else {
                                userBadgeState[user.id].add(badge.id);
                                addBadge(user, badge.id);
                            }
                            saveBadgeState();
                        }}
                        icon={() => (
                            <Checkbox
                                checked={userBadgeState[user.id].has(badge.id)}
                                onChange={() => {
                                    if (userBadgeState[user.id].has(badge.id)) {
                                        userBadgeState[user.id].delete(badge.id);
                                        removeBadge(user, badge.id);
                                    } else {
                                        userBadgeState[user.id].add(badge.id);
                                        addBadge(user, badge.id);
                                    }
                                    saveBadgeState();
                                }}
                            />
                        )}
                    />
                ))}
            </Menu.MenuGroup>
        </Menu.MenuItem>
    );

    children.push(submenu);
};

// Fonction pour obtenir l'utilisateur actuellement affiché
function getCurrentUser(): User | null {
    const userElement = document.querySelector('.user-profile');
    if (userElement) {
        return {
            id: userElement.getAttribute('data-user-id') || '',
            username: userElement.getAttribute('data-username') || ''
        } as User;
    }
    return null;
}

function resetBadgesForProfile() {
    const user = getCurrentUser();
    if (user) {
        updateBadgesForUser(user);
    }
}

const observer = new MutationObserver(resetBadgesForProfile);

const observerConfig = { childList: true, subtree: true };

// Démarrer l'observation
const startObserving = () => {
    // Vérifiez d'abord si le profil est visible et trouvez le bon conteneur
    const profileContainer = document.querySelector('.profile-container'); // Exemple : à adapter selon le DOM réel
    if (profileContainer) {
        observer.observe(profileContainer, observerConfig);
    } else {
        console.error('Conteneur pour l\'observation des profils non trouvé.');
    }
};

// Fonction pour appliquer le badge au chargement de la page
function startBadgeApplication() {
    const badgeId = 'discord-mod-alumni'; // Identifiant unique du badge
    const badgeUrl = 'https://cdn.discordapp.com/badge-icons/6bdc42827a38498929a4920da12695d9.png'; // URL de l'image du badge

    // Applique initialement le badge
    applyBadge(badgeId, badgeUrl);

    // Observe les changements dans le DOM pour réappliquer le badge si nécessaire
    observeDomChanges(badgeId, badgeUrl); // Assurez-vous que cette fonction est correctement définie
}

// Assurez-vous que le DOM est prêt avant de démarrer l'observation
window.onload = () => {
    startObserving();
    startBadgeApplication();
};

const plugin = definePlugin({
    name: "Custom Badges",
    description: "Gérer les badges Discord visibles dans les profils.",
    authors: [
        { name: "w0l6", id: BigInt("1062336603034501190") },
        { name: "sanagodev", id: BigInt("276780925944332289") }
    ],
    tags: ["Dev"],
    contextMenus: {
        "user-context": UserContextMenuPatch
    }
});

export default plugin;
