import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class AlphabetService {
    private alphabetLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');;

    /**
    * Creates a label based on english alphabet and the passed index.
    * If the index is greater than the alphabet length, i.e., it exceeds the base-26 sequence,
    * it will loop back and append multiple letters.
    * 
    * @param index the index to access the alphabet array.
    * @returns a label based on the passed index, like 'a', 'b', 'c'...'aa', 'ab', 'ac'. 
    */
    createBase26Label(index: number): string {
        let result = '';
        const alphabetLength = this.alphabetLetters.length;
        while (index >= 0) {
            const indexReminder = index % alphabetLength;
            result = this.alphabetLetters[indexReminder] + result;
            const columIndex = index / alphabetLength;
            index = Math.floor(columIndex) - 1;
        }
        return result;
    }
}