const isMobileDevice: any = () => {
    if (typeof navigator !== 'undefined') {
        const userAgent: string = navigator.userAgent;
        {/*  Check if the user agent string contains a mobile device keyword */ }
        return userAgent.match(/(android|iphone|ipad)/i);
    } else {
        return 1;
    }

}

export { isMobileDevice }