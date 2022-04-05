const overlay = document.querySelector('.overlay');
const bgOverlay = document.querySelector('.bgOverlay');
const slideBanner = document.querySelectorAll('.slider__banner-wrapper');
const slideProduct = document.querySelectorAll('.col.l-12.m-4.c-6.product-on-left__info');
const countdown = document.querySelector('.hot-deal__heading__countdown');
const mobileMaxWidth = window.matchMedia("(max-width: 739px)");

const searchSuggest = document.querySelector('.search-suggest');
function displaySearchSuggest() {
    searchSuggest.classList.remove('hidden');
}
function hideSearchSuggest() {
    searchSuggest.classList.add('hidden');
}

const app = {

    // Scroll to top
    scrollTop() {
        const scrollTopBtn = document.getElementById('scroll-top');
        window.onscroll = () => {
            if(document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
                scrollTopBtn.classList.add('show-scroll-btn');
                scrollTopBtn.onclick = function () {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                }
            }
            else if(document.body.scrollTop == 0 || document.documentElement.scrollTop == 0) {
                scrollTopBtn.classList.remove('show-scroll-btn');
            }
        }
    },

    // Fixed header on top
    fixedHeader(mobileMaxWidth) {
        
        const header = document.querySelector('.page-header');

        if(mobileMaxWidth.matches === false) {
            window.onscroll = () => {
                if(document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
                    header.classList.add('header-sticky');
                }
                else if(document.body.scrollTop == 0 || document.documentElement.scrollTop == 0) {
                    header.classList.remove('header-sticky');
                }
            }
        }
        
        mobileMaxWidth.onchange = () => {
            if(mobileMaxWidth.matches) {
                window.onscroll = () => {
                    if(document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
                        if(header.classList.contains('header-sticky')) {
                            header.classList.remove('header-sticky')
                        }
                    }
                }
                
            } else {
                window.onscroll = () => {
                    if(document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
                        header.classList.add('header-sticky');
                    }
                    else if(document.body.scrollTop == 0 || document.documentElement.scrollTop == 0) {
                        header.classList.remove('header-sticky');
                    }
                }
            } 
        } 
    },

    responsiveFooter(mobileMaxWidth) {
        const footerTopTitles = document.querySelectorAll('.footer-top__title');
        const footerTopLists = document.querySelectorAll('.footer-top__list')
        
        const n = footerTopTitles.length;
        let i;

        if(mobileMaxWidth.matches) {
            for(let i = 0; i <footerTopLists.length; i++) {
                footerTopLists[i].style.display = 'none';
            }
            for (i = 0; i < n; i++) {
                footerTopTitles[i].addEventListener('click', function() {
                    const footerTopList = this.nextElementSibling;
                    if(footerTopList.style.display === 'block') {
                        footerTopList.style.display = 'none';
                    } else {
                        footerTopList.style.display = 'block';
                    }
                })
            }
        }

        mobileMaxWidth.onchange = () => {
            if(mobileMaxWidth.matches) {
                for(let i = 0; i <footerTopLists.length; i++) {
                    footerTopLists[i].style.display = 'none';
                }
                for (i = 0; i < n; i++) {
                    footerTopTitles[i].addEventListener('click', function() {
                        const footerTopList = this.nextElementSibling;
                        if(footerTopList.style.display === 'block') {
                            footerTopList.style.display = 'none';
                        } else {
                            footerTopList.style.display = 'block';
                        }
                    })
                }
            } else {
                for (i = 0; i < n; i++) {
                    footerTopTitles[i].addEventListener('click', function() {
                        const footerTopList = this.nextElementSibling;
                        footerTopList.style.display = 'block';
                    })
                }

                for(let i = 0; i <footerTopLists.length; i++) {
                    footerTopLists[i].style.display = 'block';
                }
            }
        }
    },

    // Dropdown
    dropDown() {

        const dropDownBtns = document.querySelectorAll('.dropdown-btn');
        const closeBtns = document.querySelectorAll('.close-btn');

        for(let i = 0; i < dropDownBtns.length; i++) {
            dropDownBtns[i].onclick = function () {
                const dropdownContent = this.nextElementSibling;
                if(dropdownContent.style.display === 'block') {
                    dropdownContent.style.display = 'none';
                } else {
                    dropdownContent.style.display = 'block';
                }
            }
        }

        for(let i = 0; i < closeBtns.length; i++) {
            closeBtns[i].onclick = function(event) {
                const dropdownContent = closeBtns[i].closest('.dropdown-content');
                dropdownContent.style.display = 'none';
            }
        }
    },

    // Toggle category 
    toggleCategory() {
        let toggleMenuStatus = false;
        const categoryList = document.querySelector('.vertical-menu-category__list');
        const menuItem = document.querySelectorAll('.vertical-menu-category__link');
        const closeCategory = document.querySelector('#close-category');
        
        if (width >= 1200) {
            toggleBtn.onclick = () => {
                 
                if(toggleMenuStatus === false) {
                    categoryList.style.visibility = 'visible';
                    categoryList.style.opacity = '1';
                    categoryList.style.height = '472px';
                    
                    menuItemLength = menuItem.length;
            
                    for(let i = 0; i < menuItemLength; i++) {
                        menuItem[i].style.opacity = '1';
                        menuItem[i].style.visibility = 'visible';
                    }
            
                    toggleMenuStatus = true;
                }
                
                else if(toggleMenuStatus === true) {
                    categoryList.style.visibility = 'hidden';
                    categoryList.style.opacity = '0';
                    categoryList.style.height = '0';
            
                    for(let i = 0; i < menuItemLength; i++) {
                        menuItem[i].style.opacity = '0';
                    }
            
                    toggleMenuStatus = false;
                }
            }
        }

        else {
            toggleBtn.onclick = () => {
                categoryList.style.left = '0';
            }

            closeCategory.onclick = () => {
                console.log(categoryList)
                categoryList.style.left = '-100%';
            }

        }
        
        
        
    },

    // Handle responsive menu 
    responsiveMenu: function () {
        const menuIcons = document.querySelectorAll('.menu-icon');
        const primaryMenu = document.querySelector('.primary-menu');
        const closeBtn = document.querySelector('#close-menu');

        for(let i = 0; i <menuIcons.length; i++) {
            menuIcons[i].onclick = () => {
                primaryMenu.classList.toggle('show');
                overlay.classList.toggle('visible');
            }
        }

        closeBtn.onclick = () => {
            primaryMenu.classList.remove('show');
            overlay.classList.toggle('visible');
        }

        overlay.onclick = () => {
            primaryMenu.classList.remove('show');
            overlay.classList.toggle('visible');
        }
    },

    // Panel
    panel() {
        const panelHeadings = document.querySelectorAll('.panel-heading');
        
        const n = panelHeadings.length;
        let i;
        for (i = 0; i < n; i++) {
            panelHeadings[i].addEventListener('click', function() {
                const panelContent = this.nextElementSibling;
                if(panelContent.style.display === 'block') {
                    panelContent.style.display = 'none';
                } else {
                    panelContent.style.display = 'block';
                }
            })
        }

    },

    // Auto slider
    autoSlideShow() {
        let slideIndex = 0;
        showSlide();

        function showSlide() {
            let i;
            for (i = 0; i < slideBanner.length; i++) {
                slideBanner[i].style.display = 'none';
            } 
            slideIndex++;
            if(slideIndex > slideBanner.length) {
                slideIndex = 1;
            }
            slideBanner[slideIndex - 1].style.display = 'block';
            setTimeout(showSlide, 3000);
        }
    },

    // Manual slider
    manualSlideShow() {

        const preBtn = document.querySelectorAll('.product-action--pre');
        const nextBtn = document.querySelectorAll('.product-action--next')
        const dots = document.querySelectorAll(".dot");

        let slideIndex = 1;
        showSlides(slideIndex);

        function plusSlide(n) {
            showSlides(slideIndex += n);
        }

        for(let i = 0; i < preBtn.length; i++) {
            preBtn[i].addEventListener('click', () => {
                plusSlide(-1);
            })
        }

        for(let i = 0; i < nextBtn.length; i++) {
            nextBtn[i].addEventListener('click', () => {
                plusSlide(1);
            })
        }

        for(let i = 0; i < dots.length; i++) {
            dots[i].addEventListener('click', () => {
                showSlides(i + 1);
            })
        }

        function showSlides(n) {
            let i;

            if(n > slideProduct.length) {
                slideIndex = 1;
            }
            if(n < 1) {
                slideIndex = slideProduct.length;
            }
            for(i = 0; i < slideProduct.length; i++) {
                slideProduct[i].style.display = 'none';
            }
            for(i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace("dot--active", "")
            }
            slideProduct[slideIndex - 1].style.display = 'block';
            dots[slideIndex - 1].className += ' dot--active';
        }
    },

    // Countdown timer
    countdown() {

        const end = new Date("Jan 25, 2022 00:00:00").getTime();
        
        setInterval(() => {
            let now = new Date().getTime();
            let distance = end - now;
    
            const SECOND = 1000;
            const MINUTE = SECOND * 60;
            const HOUR = MINUTE * 60;
            const DAY = HOUR * 24;
            let days = Math.floor(distance / DAY);
            let hours = Math.floor((distance % DAY) / HOUR);
            let minutes = Math.floor((distance % HOUR) / MINUTE);
            let seconds = Math.floor((distance % MINUTE) / SECOND);

            document.querySelector('.countdown-days__number').innerHTML = days;
            document.querySelector('.countdown-hours__number').innerHTML = hours;
            document.querySelector('.countdown-mins__number').innerHTML = minutes;
            document.querySelector('.countdown-secs__number').innerHTML = seconds;

        }, 1000);
    },

    // Multiple tabs
    multipleTabs() {
        window.addEventListener('load', () => {
            let tabs = document.querySelectorAll('ul.tabs-nav > li');

            tabClicks = (tabClickEvent) => {
                tabClickEvent.preventDefault();
                clickedTab = tabClickEvent.currentTarget;
                tabParent = tabClickEvent.currentTarget.parentNode.parentNode.parentNode.parentNode;
                tabs = tabParent.querySelectorAll('ul.tabs-nav > li');

                for(let i = 0; i < tabs.length; i++) {
                    tabs[i].classList.remove('tab--active');
                }

                clickedTab.classList.add('tab--active');

                const contentPanes = tabParent.querySelectorAll('.tab-pane');
                for(let i = 0; i < contentPanes.length; i++) {
                    contentPanes[i].classList.remove('active');
                }

                const anchorReference = tabClickEvent.target.parentNode;
                const activePaneId = anchorReference.getAttribute("href");
                const activePane = tabParent.querySelector(activePaneId)
                activePane.classList.add("active");
            }

            for(let i = 0; i < tabs.length; i++) {
                tabs[i].addEventListener('click', tabClicks);
            }
        })
    },
    
    // Change layout display products
    changeLayout() {
        const layoutModes = document.querySelectorAll('.layout-mode');
        const productGrids = document.querySelectorAll('.product-grid');

        layoutChosen = (event) => {

            event.preventDefault();
            const currentMode = event.currentTarget;
            
            for(let i = 0; i < layoutModes.length; i++) {
                layoutModes[i].classList.remove('active');
            }
            currentMode.classList.add('active');

            for(let i = 0; i < productGrids.length; i++) {
                productGrids[i].classList.remove('active');
            }
            const activeModeId = currentMode.getAttribute("href");
            const activeLayout = document.querySelector(activeModeId)
            activeLayout.classList.add('active');
        }

        for(let i = 0; i < layoutModes.length; i++) {
            layoutModes[i].addEventListener('click', layoutChosen)
        }

    },

    start() {

        this.scrollTop();

        this.fixedHeader(mobileMaxWidth);

        this.responsiveFooter(mobileMaxWidth);

        this.dropDown();
        
        this.responsiveMenu();
        
        this.panel();
        
        this.multipleTabs();
        
        this.changeLayout();
        
        // this.toggleCategory();

        if(slideBanner.length > 0) {
            this.autoSlideShow();
        }

        if(slideProduct.length > 0) {
            this.manualSlideShow();
        }

        if(countdown != null) {
            this.countdown();
        }

    }
}

app.start();