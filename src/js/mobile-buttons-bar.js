class MobileButtonsBar {
    constructor() {
        const btnSearchToggle = document.querySelector('.m-mobile-buttons-bar__btn--search');
        const btnToggle = document.querySelector('.m-mobile-buttons-bar__btn--toggle');
        const icon = document.querySelector('.m-mobile-buttons-bar__icon--toggle');
        const searchBar = document.querySelector('.m-sidebar__search');
        const sidebar = document.querySelector('.m-sidebar');

        if (btnSearchToggle && searchBar) {
            btnSearchToggle.onclick = () => searchBar.classList.toggle('m-sidebar__search--show');
        }

        if (sidebar && btnToggle) {
            btnToggle.onclick = () => {
                icon.classList.toggle('m-mobile-buttons-bar__icon--up');
                sidebar.classList.toggle('m-sidebar--hidden');
            }
        }
    }
}

export default MobileButtonsBar;