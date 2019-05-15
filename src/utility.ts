export class Utility {
    static truncate(text: string, maxLength: number): string {
        if (text.length > maxLength) {
            return text.substr(0, maxLength - 1) + "..."
        } else {
            return text 
        }
    }
}

