window.addEventListener('DOMContentLoaded', event => {
    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Initialize view counter with delay to ensure DOM is fully loaded
    setTimeout(initializeViewCounter, 100);
});

async function initializeViewCounter() {
    const API_URL = "https://d327w8dtdd.execute-api.us-east-1.amazonaws.com/Prod/visitor";
    const counterElement = document.getElementById("view-count");

    try {
        // First try to increment the counter
        console.log('Making POST request to increment counter...');
        const postResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors'
        });

        console.log('POST response status:', postResponse.status);
        
        if (!postResponse.ok) {
            console.error('POST request failed:', postResponse.statusText);
            throw new Error(`HTTP error! status: ${postResponse.status}`);
        }

        const data = await postResponse.json();
        console.log('Received data from POST:', data);

        if (data && typeof data.Views !== 'undefined') {
            counterElement.textContent = data.Views;
        } else {
            // If POST fails, try GET as fallback
            console.log('Making GET request as fallback...');
            const getResponse = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            console.log('GET response status:', getResponse.status);

            if (!getResponse.ok) {
                console.error('GET request failed:', getResponse.statusText);
                throw new Error(`HTTP error! status: ${getResponse.status}`);
            }

            const getData = await getResponse.json();
            console.log('Received data from GET:', getData);

            if (getData && typeof getData.Views !== 'undefined') {
                counterElement.textContent = getData.Views;
            } else {
                throw new Error('No view count data in response');
            }
        }
    } catch (error) {
        console.error("Error with view counter:", error);
        counterElement.textContent = 'Error loading count value';
        
        // Log detailed error information
        console.log('Error details:', {
            message: error.message,
            stack: error.stack
        });
    }
}