/**
 * @param htmlElement {HTMLElement}
 */
export function canSee(htmlElement) {
    if (!window) {
        return false;
    }

    let clientHeight = window.document.documentElement.clientHeight;
    console.log(clientHeight)
}
