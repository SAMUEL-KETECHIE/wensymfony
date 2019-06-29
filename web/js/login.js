var signInWidgetConfig = {
    // Enable or disable widget functionality with the following options. Some of these features require additional configuration in your Okta admin settings. Detailed information can be found here: https://github.com/okta/okta-signin-widget#okta-sign-in-widget
    // Look and feel changes:
    logo: 'https://res.cloudinary.com/wendolin/image/upload/v1543395608/dbrkt66ntm8idfk2ulcr.jpg',
    language: 'en',                       // Try: [fr, de, es, ja, zh-CN] Full list: https://github.com/okta/okta-signin-widget#language-and-text
    i18n: {
        //Overrides default text when using English. Override other languages by adding additional sections.
        'en': {
            'primaryauth.title': 'Sign In Here',   // Changes the sign in text
            'primaryauth.submit': 'Login',  // Changes the sign in button
            // More e.g. [primaryauth.username.placeholder,  primaryauth.password.placeholder, needhelp, etc.].
            // Full list here: https://github.com/okta/okta-signin-widget/blob/master/packages/@okta/i18n/dist/properties/login.properties
        }
    },
    // Changes to widget functionality
    features: {
        registration: true,                 // Enable self-service registration flow
        rememberMe: true,                   // Setting to false will remove the checkbox to save username
        //multiOptionalFactorEnroll: true,  // Allow users to enroll in multiple optional factors before finishing the authentication flow.
        //selfServiceUnlock: true,          // Will enable unlock in addition to forgotten password
        //smsRecovery: true,                // Enable SMS-based account recovery
        //callRecovery: true,               // Enable voice call-based account recovery
        router: false,                       // Leave this set to true for the API demo
    },
    baseUrl: "https://dev-582779.okta.com",
    clientId: "0oat9w9814fG2ryQD356",
    redirectUri: 'https://wensymfony.herokuapp.com/',
    authParams: {
        issuer: 'https://dev-582779.okta.com/oauth2/default',
        responseType: ['id_token', 'token'],
        scopes: ['openid', 'email', 'profile'],
    },
};
var oktaSignIn = new OktaSignIn(signInWidgetConfig);
if (oktaSignIn.token.hasTokensInUrl()) {
    oktaSignIn.token.parseTokensFromUrl(
        function success(res) {
            // The tokens are returned in the order requested by `responseType` above
            var accessToken = res[0];
            var idToken = res[1]

            // Say hello to the person who just signed in:
            console.log('Hello, ' + idToken.claims.email);

            // Save the tokens for later use, e.g. if the page gets refreshed:
            oktaSignIn.tokenManager.add('accessToken', accessToken);
            oktaSignIn.tokenManager.add('idToken', idToken);

            // Remove the tokens from the window location hash
            window.location.hash='';
        },
        function error(err) {
            // handle errors as needed
            console.error(err);
        }
    );
} else {
    oktaSignIn.session.get(function (res) {
        // Session exists, show logged in state.
        if (res.status === 'ACTIVE') {
            console.log('Welcome back, ' + res.login);
            return;
        }
        // No session, show the login form
        oktaSignIn.renderEl(
            { el: '#login-container' },
            function success(res) {
                // Nothing to do in this case, the widget will automatically redirect
                // the user to Okta for authentication, then back to this page if successful
            },
            function error(err) {
                // handle errors as needed
                console.error(err);
            }
        );
    });
}



function widgetSuccessCallback(res) {
    var key = '';
    if (res[0]) {
        key = Object.keys(res[0])[0];
        oktaSignIn.tokenManager.add(key, res[0]);
    }
    if (res[1]) {
        key = Object.keys(res[1])[0];
        oktaSignIn.tokenManager.add(key, res[1]);
    }
    if (res.status === 'SUCCESS') {
        var token = oktaSignIn.tokenManager.get(key);
        console.log("Logged in to Okta and issued token:");
        console.log(token);
        console.log("Reload this page to start over.");
        window.location='https://wensymfony.herokuapp.com/';
    }
}

function widgetErrorCallback (err) {
    console.log(err);
}

oktaSignIn.renderEl({el: '#register-container'}, widgetSuccessCallback, widgetErrorCallback);

