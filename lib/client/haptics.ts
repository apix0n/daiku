// from cobalt.tools
// https://github.com/imputnet/cobalt/blob/main/web/src/lib/haptics.ts

const haptic = () => {
    const ua = navigator.userAgent.toLowerCase();
    const iPhone = ua.includes("iphone os");
    const iosVersion = Number(ua.match(/iphone os (\d+)_/)?.[1]);
    const modernIOS = iPhone && iosVersion >= 18;

    if (!modernIOS) {
        return;
    }   

    try {
        const label = document.createElement("label");
        label.ariaHidden = "true";
        label.style.display = "none";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.setAttribute("switch", "");
        label.appendChild(input);

        document.head.appendChild(label);
        label.click();
        document.head.removeChild(label);
    } catch { }
};

haptic.confirm = () => {
    haptic();
    setTimeout(() => haptic(), 120);
};

haptic.error = () => {
    haptic();
    setTimeout(() => haptic(), 120);
    setTimeout(() => haptic(), 240);
};

export { haptic };