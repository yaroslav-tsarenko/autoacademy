import { UAParser } from "ua-parser-js";

export const getUserInfo = async () => {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const { ip } = await ipRes.json();

    const infoRes = await fetch(`https://ipinfo.io/${ip}?token=d84e74217bcf31`);
    const info = await infoRes.json();

    const parser = new UAParser();
    const ua = parser.getResult();

    return {
        ip,
        city: info.city,
        country: info.country,
        region: info.region,
        loc: info.loc,
        org: info.org,
        timezone: info.timezone,
        userAgent: navigator.userAgent,
        browser: ua.browser.name,
        browserVersion: ua.browser.version,
        os: ua.os.name,
        osVersion: ua.os.version,
        device: ua.device.type || "desktop",
    };
};