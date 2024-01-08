# ExitIntent JavaScript Library

The ExitIntent JavaScript library allows you to detect when a user is about to leave your website or web application. This can be useful for displaying exit-intent popups, capturing leads, or triggering other actions before the user navigates away.

## Installation

You can include the ExitIntent library in your project by adding the JavaScript file before the closing `<body>` tag and calling the `window.ExitIntent` function. This function accepts a hash with the following attributes:

- **contentURL**: The URL to load as the exit intent content. See [intent.html](intent.html) as an example.
- **mobileTimeout**: How long (in milliseconds) to wait on mobile before the exit intent is triggered. Default: 10,000 ms (10s).
- **mobilePushState**: If the history should be overwritten on mobile to including a hash-based trigger (so that exit intent launches when clicking the back button). Default: true.
- **suppressDuration**: How long (in days) to suppress future exit intent popups if the individual actively declines this intent. Default: 7.

See [index.html](index.html) as an example.