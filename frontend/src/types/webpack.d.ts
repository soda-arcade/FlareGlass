declare const require: {
    context: (path: string, useSubdirectories: boolean, regExp: RegExp) => {
    keys: () => string[];
    (id: string): any;
    };
};