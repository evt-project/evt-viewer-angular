import { ID_SELECTOR_PREFIX } from "../models/constants";

declare global {
    interface String {
        /**
         * Return the string without the starting id selector character 
         * 
         * Ex: #hello => hello
        */
        withoutSelectorCharacter(): string;

        /**
         * Return the string with the starting id selector character
         * 
         * Ex: hello => #hello
        */
        withSelectorCharacter(): string;
    }
}


String.prototype.withoutSelectorCharacter = function (this: string) {
    const normalized = this.trim();
    return normalized.startsWith(ID_SELECTOR_PREFIX) ? normalized.slice(1) : normalized;
};

String.prototype.withSelectorCharacter = function (this: string) {
    const normalized = this.trim();
    return normalized.startsWith(ID_SELECTOR_PREFIX) ? normalized : ID_SELECTOR_PREFIX + normalized;
};

export { };