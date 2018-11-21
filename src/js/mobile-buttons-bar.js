import { SELECTOR_CLASS } from "./index";

class MobileButtonsBar {
    constructor() {
        const btnSearchToggle = document.querySelector(`.${SELECTOR_CLASS}-mobile-buttons-bar__btn--search`);
        const btnToggle = document.querySelector(`.${SELECTOR_CLASS}-mobile-buttons-bar__btn--toggle`);
        const icon = document.querySelector(`.${SELECTOR_CLASS}-mobile-buttons-bar__icon--toggle`);
        const searchBar = document.querySelector(`.${SELECTOR_CLASS}-sidebar__search`);
        const sidebar = document.querySelector(`.${SELECTOR_CLASS}-sidebar`);

        if (btnSearchToggle && searchBar) {
            btnSearchToggle.onclick = () => searchBar.classList.toggle(`${SELECTOR_CLASS}-sidebar__search--show`);
        }

        if (sidebar && btnToggle) {
            btnToggle.onclick = () => {
                icon.classList.toggle(`${SELECTOR_CLASS}-mobile-buttons-bar__icon--up`);
                sidebar.classList.toggle(`${SELECTOR_CLASS}-sidebar--hidden`);
            }
        }
    }
}

export default MobileButtonsBar;