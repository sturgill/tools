window.ExitIntent = function(params) {
    var defaultConfig = {
        contentURL: '',
        mobileTimeout: 10000,
        suppressDuration: 7,
    };

    // Merge the config with the user provided params
    var config = Object.assign({}, defaultConfig, params || {});

    if (config.contentURL === '') {
        console.error('You must provide a contentURL parameter to the ExitIntent function');
        return;
    }
    
    var suppressionCookieName = '_eis';
    var contentID = '_ei-content';
    var closeButtonID = '_ei-close';
    var alreadyTriggered = false;

    var launch = function() {
        // If the exit intent suppression cookie is set, do not trigger the exit intent
        if (document.cookie.indexOf(suppressionCookieName) > -1) {
            return;
        }

        // If the exit intent has already been triggered, do not trigger it again
        if (alreadyTriggered) {
            return;
        }

        // Set the exit intent triggered flag to true to prevent the exit intent 
        // from being triggered again
        alreadyTriggered = true;
        
        document.getElementById(contentID).style.display = 'block';
        document.getElementById(closeButtonID).style.display = 'block';
    };

    var close = function() {
        document.getElementById(contentID).style.display = 'none';
        document.getElementById(closeButtonID).style.display = 'none';
        suppress();
    }

    // The suppress function will write a cookie that will prevent the
    // exit intent from being triggered again for the duration of the
    // suppression period.
    var suppress = function() {
        // Parse the suppression duration into an integer and fallback to the
        // default value if the value is not a valid integer
        var suppressDuration = parseInt(config.suppressDuration);
        if (isNaN(suppressDuration)) {
            suppressDuration = defaultConfig.suppressDuration;
        }

        var date = new Date();
        date.setTime(date.getTime() + (suppressDuration * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + date.toGMTString();
        document.cookie = suppressionCookieName + '=1;' + expires + '; path=/';
    }

    var isMobile = function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Inject a div into the DOM that will contain the exit intent content.
    // Center it on the page. Hide the content by default.
    var content = document.createElement('div');
    content.style.position = 'fixed';
    content.style.top = '0';
    content.style.left = '0';
    content.style.width = '100%';
    content.style.height = '100%';
    content.style.border = 'none';
    content.style.zIndex = 999998;
    content.style.display = 'none';
    content.id = contentID;
    content.innerHTML = '<iframe src="' + config.contentURL + '" style="width: 100%; height: 100%; border: none;"></iframe>';
    document.body.appendChild(content);


    // Inject a close button into the DOM that will close the exit intent when
    // clicked. Give it a fixed position and place it in the top right corner
    // of the exit intent. Hide the close button by default.
    var closeButton = document.createElement('div');
    closeButton.style.position = 'fixed';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.width = '20px';
    closeButton.style.height = '20px';
    closeButton.style.background = '#000';
    closeButton.style.borderRadius = '50%';
    closeButton.style.boxShadow = '1px 2px 3px rgba(0,0,0,0.5)';
    closeButton.style.border = '1px solid #fff';
    closeButton.style.zIndex = 9999999;
    closeButton.style.display = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.textAlign = 'center';
    closeButton.style.lineHeight = '20px';
    closeButton.style.fontFamily = 'sans-serif';
    closeButton.style.fontSize = '20px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.color = '#fff';
    closeButton.innerHTML = '&times;';
    closeButton.id = closeButtonID;
    closeButton.addEventListener('click', function() {
        close();
    });
    document.body.appendChild(closeButton);

    // Create a new listener when the page is blurred that calls the 
    // launch function
    window.addEventListener('blur', launch);

    // Create a new listener on mouseout that calls the launch function
    window.addEventListener('mouseout', function(e) {
        if (e.toElement === null && e.relatedTarget === null) {
            launch();
        }
    });

    // Create a new listener on pagehide that calls the launch function
    window.addEventListener('pagehide', launch);

    // Detect if the user is on a mobile device and if so, trigger the exit
    // intent after the timeout period
    if (isMobile()) {
        // Parse the mobile timeout into an integer and fallback to the default
        // value if the value is not a valid integer
        var mobileTimeout = parseInt(config.mobileTimeout);
        if (isNaN(mobileTimeout)) {
            mobileTimeout = defaultConfig.mobileTimeout;
        }
        setTimeout(launch, mobileTimeout);
    }
};